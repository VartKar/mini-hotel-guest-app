
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

    const { bookingIdKey, customerName, rating, message, roomNumber } = await req.json()

    console.log('Received feedback:', { customerName, rating, message })

    // Store feedback as a shop order for now (we can create a separate table later)
    const { data: feedbackData, error: feedbackError } = await supabaseClient
      .from('shop_orders')
      .insert({
        booking_id_key: bookingIdKey,
        customer_name: customerName,
        customer_phone: 'feedback',
        room_number: roomNumber,
        ordered_items: [{
          type: 'feedback',
          rating: rating,
          message: message
        }],
        total_amount: 0,
        order_status: 'completed'
      })
      .select()
      .single()

    if (feedbackError) {
      console.error('Database error:', feedbackError)
      throw feedbackError
    }

    console.log('Feedback saved to database:', feedbackData.id)

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
          subject: 'Новый отзыв от гостя',
          html: `
            <h2>Новый отзыв от гостя</h2>
            <p><strong>Имя гостя:</strong> ${customerName}</p>
            <p><strong>Номер комнаты:</strong> ${roomNumber || 'Не указан'}</p>
            <p><strong>Рейтинг:</strong> ${rating}/5 ⭐</p>
            <p><strong>Отзыв:</strong></p>
            <blockquote style="border-left: 4px solid #ccc; padding-left: 16px; margin: 16px 0;">
              ${message || 'Без комментариев'}
            </blockquote>
            <p><strong>ID записи:</strong> ${feedbackData.id}</p>
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
        feedbackId: feedbackData.id,
        message: 'Отзыв успешно отправлен' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error processing feedback:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to process feedback' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
