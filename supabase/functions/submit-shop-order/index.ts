
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const escapeHtml = (text: string) => {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const { customerName, customerPhone, roomNumber, items, totalAmount, bookingIdKey, customerComment, guestId, wantsBonusDiscount } = await req.json()

    // Input validation
    if (!customerName || customerName.trim().length < 2 || customerName.trim().length > 100) {
      return new Response(
        JSON.stringify({ success: false, error: 'Имя должно содержать от 2 до 100 символов' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }
    if (customerComment && customerComment.length > 500) {
      return new Response(
        JSON.stringify({ success: false, error: 'Комментарий слишком длинный (максимум 500 символов)' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }
    if (!totalAmount || totalAmount < 0 || totalAmount > 1000000) {
      return new Response(
        JSON.stringify({ success: false, error: 'Некорректная сумма заказа' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }
    if (customerPhone && !/^[+]?[0-9\s\-\(\)]{7,20}$/.test(customerPhone)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Некорректный формат телефона' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    console.log('Received shop order:', { customerName, customerPhone, items, totalAmount, customerComment })

    // Insert the order into the database
    const { data: orderData, error: orderError } = await supabaseClient
      .from('shop_orders')
      .insert({
        guest_id: guestId || null,
        booking_id_key: bookingIdKey || null,
        customer_name: customerName.trim(),
        customer_phone: customerPhone?.trim() || '',
        room_number: roomNumber,
        ordered_items: items,
        total_amount: totalAmount,
        customer_comment: customerComment?.trim() || null,
        order_status: 'pending',
        wants_bonus_discount: wantsBonusDiscount || false
      })
      .select()
      .single()

    if (orderError) {
      console.error('Database error:', orderError)
      throw orderError
    }

    console.log('Order saved to database:', orderData.id)

    // Process bonuses if guest_id is provided (only award loyalty points, no deduction)
    if (guestId) {
      const { data: guest } = await supabaseClient
        .from('guests')
        .select('loyalty_points, total_spent')
        .eq('id', guestId)
        .single()

      if (guest) {
        let currentBalance = Number(guest.loyalty_points)
        
        // Award loyalty points (1% of total)
        const bonusEarned = Math.floor(Number(totalAmount) * 0.01)
        if (bonusEarned > 0) {
          currentBalance += bonusEarned
          
          await supabaseClient
            .from('bonus_transactions')
            .insert({
              guest_id: guestId,
              amount: bonusEarned,
              balance_after: currentBalance,
              note: `Бонусы за заказ №${orderData.id} (${totalAmount} ₽)`,
              created_by: 'system'
            })
          
          console.log(`Awarded ${bonusEarned} loyalty points to guest ${guestId}`)
        }
        
        // Update guest balance and total spent
        const newTotalSpent = Number(guest.total_spent) + Number(totalAmount)
        
        await supabaseClient
          .from('guests')
          .update({
            loyalty_points: currentBalance,
            total_spent: newTotalSpent
          })
          .eq('id', guestId)
      }
    }

    // Send email notification to admin
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    if (resendApiKey) {
      console.log('Attempting to send email notification...')
      
      const emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Hotel System <noreply@lovable.app>',
          to: ['monaco1@ya.ru'],
          subject: 'Новый заказ в магазине',
          html: `
            <h2>Новый заказ в магазине</h2>
            <p><strong>Имя клиента:</strong> ${escapeHtml(customerName)}</p>
            <p><strong>Телефон:</strong> ${escapeHtml(customerPhone) || 'Не указан'}</p>
            <p><strong>Номер комнаты:</strong> ${escapeHtml(roomNumber) || 'Не указан'}</p>
            <p><strong>Общая сумма:</strong> ${escapeHtml(String(totalAmount))} ₽</p>
            <p><strong>Заказ ID:</strong> ${escapeHtml(orderData.id)}</p>
            ${customerComment ? `<p><strong>Комментарий:</strong> ${escapeHtml(customerComment)}</p>` : ''}
            <h3>Заказанные товары:</h3>
            <ul>
              ${items.map((item: any) => `
                <li>${escapeHtml(item.name)} - ${escapeHtml(String(item.price))} ₽ x ${escapeHtml(String(item.quantity))} (${escapeHtml(item.category)})</li>
              `).join('')}
            </ul>
          `,
        }),
      })

      const emailResult = await emailResponse.text()
      console.log('Email API response status:', emailResponse.status)
      console.log('Email API response:', emailResult)

      if (!emailResponse.ok) {
        console.error('Failed to send email notification:', emailResult)
      } else {
        console.log('Email notification sent successfully')
      }
    } else {
      console.log('RESEND_API_KEY not found, skipping email notification')
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        orderId: orderData.id,
        message: 'Заказ успешно отправлен' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error processing shop order:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to process order' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
