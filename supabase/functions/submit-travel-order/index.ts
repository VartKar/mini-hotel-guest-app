
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

    const { customerName, customerPhone, customerComment, services, totalPrice, bookingIdKey } = await req.json()

    // Insert the order into the database
    const { data: orderData, error: orderError } = await supabaseClient
      .from('travel_service_orders')
      .insert({
        booking_id_key: bookingIdKey,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_comment: customerComment,
        selected_services: services,
        total_amount: totalPrice,
        order_status: 'pending'
      })
      .select()
      .single()

    if (orderError) {
      throw orderError
    }

    // Send email notification to admin
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    if (resendApiKey) {
      const emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'noreply@lovable.app',
          to: ['admin@hotel.com'],
          subject: 'Новый заказ услуг путешествия',
          html: `
            <h2>Новый заказ услуг путешествия</h2>
            <p><strong>Имя клиента:</strong> ${customerName}</p>
            <p><strong>Телефон:</strong> ${customerPhone}</p>
            <p><strong>Комментарий:</strong> ${customerComment || 'Нет комментариев'}</p>
            <p><strong>Общая сумма:</strong> ${totalPrice} ₽</p>
            <p><strong>Заказ ID:</strong> ${orderData.id}</p>
            <h3>Выбранные услуги:</h3>
            <ul>
              ${services.map((service: any) => `
                <li>${service.title} - ${service.price}</li>
              `).join('')}
            </ul>
          `,
        }),
      })

      if (!emailResponse.ok) {
        console.error('Failed to send email notification')
      }
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
    console.error('Error processing travel order:', error)
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
