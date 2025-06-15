
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const { customerName, customerPhone, roomNumber, services, bookingIdKey } = await req.json()

    console.log('Received service order:', { customerName, customerPhone, services })

    // Insert the order into the database
    const { data: orderData, error: orderError } = await supabaseClient
      .from('shop_orders')
      .insert({
        booking_id_key: bookingIdKey,
        customer_name: customerName,
        customer_phone: customerPhone,
        room_number: roomNumber,
        ordered_items: services,
        total_amount: 0, // Services might not have prices
        order_status: 'pending'
      })
      .select()
      .single()

    if (orderError) {
      console.error('Database error:', orderError)
      throw orderError
    }

    console.log('Service order saved to database:', orderData.id)

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
          to: ['admin@hotel.com'],
          subject: 'Новый заказ услуг в номере',
          html: `
            <h2>Новый заказ услуг в номере</h2>
            <p><strong>Имя клиента:</strong> ${customerName}</p>
            <p><strong>Телефон:</strong> ${customerPhone}</p>
            <p><strong>Номер комнаты:</strong> ${roomNumber || 'Не указан'}</p>
            <p><strong>Заказ ID:</strong> ${orderData.id}</p>
            <h3>Заказанные услуги:</h3>
            <ul>
              ${services.map((service: any) => `
                <li>${service.title} - ${service.description}</li>
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
    console.error('Error processing service order:', error)
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
