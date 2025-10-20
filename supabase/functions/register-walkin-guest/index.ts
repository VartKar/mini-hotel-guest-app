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
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const { email, name, phone, currentRoomId, sessionToken, consentGiven } = await req.json()

    console.log('Registering walk-in guest:', { email, name, currentRoomId })

    // Validation
    if (!email || !name || !consentGiven) {
      return new Response(
        JSON.stringify({ success: false, error: 'Заполните все обязательные поля и дайте согласие на обработку данных' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Некорректный формат email' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Check if guest already exists
    const { data: existingGuest } = await supabaseClient
      .from('guests')
      .select('id, guest_type, loyalty_points')
      .eq('email', email.toLowerCase().trim())
      .single()

    let guestId: string
    let isNewGuest = false

    if (existingGuest) {
      // Update existing guest
      const { data: updatedGuest, error: updateError } = await supabaseClient
        .from('guests')
        .update({
          name: name.trim(),
          phone: phone?.trim() || null,
          consent_given: true,
          consent_date: new Date().toISOString(),
          guest_type: 'walk_in'
        })
        .eq('id', existingGuest.id)
        .select()
        .single()

      if (updateError) throw updateError
      guestId = updatedGuest.id
      console.log('Updated existing guest:', guestId)
    } else {
      // Create new guest
      const { data: newGuest, error: createError } = await supabaseClient
        .from('guests')
        .insert({
          email: email.toLowerCase().trim(),
          name: name.trim(),
          phone: phone?.trim() || null,
          guest_type: 'walk_in',
          loyalty_points: 100, // Welcome bonus
          total_spent: 0,
          consent_given: true,
          consent_date: new Date().toISOString()
        })
        .select()
        .single()

      if (createError) throw createError
      guestId = newGuest.id
      isNewGuest = true
      console.log('Created new guest:', guestId)
    }

    // Find default booking for current room
    const { data: defaultBooking, error: bookingLookupError } = await supabaseClient
      .from('bookings')
      .select('*')
      .eq('room_id', currentRoomId)
      .eq('is_default_guest', true)
      .single()

    if (bookingLookupError || !defaultBooking) {
      console.error('Default booking not found:', bookingLookupError)
      return new Response(
        JSON.stringify({ success: false, error: 'Не найдено бронирование по умолчанию для номера' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Create personal booking (clone of default)
    const { data: personalBooking, error: createBookingError } = await supabaseClient
      .from('bookings')
      .insert({
        room_id: currentRoomId,
        guest_id: guestId,
        guest_name: name.trim(),
        guest_email: email.toLowerCase().trim(),
        guest_phone: phone?.trim() || null,
        is_default_guest: false,
        booking_status: 'walk_in',
        check_in_date: new Date().toISOString().split('T')[0],
        check_out_date: null,
        number_of_guests: 1,
        visible_to_guests: true,
        visible_to_hosts: true,
        visible_to_admin: true,
        notes_internal: 'Walk-in self-registration'
      })
      .select()
      .single()

    if (createBookingError) {
      console.error('Failed to create personal booking:', createBookingError)
      throw createBookingError
    }

    console.log('Created personal booking:', personalBooking.id)

    // Link past orders (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

    // Shop orders
    const { data: pastShopOrders } = await supabaseClient
      .from('shop_orders')
      .select('id, total_amount')
      .eq('room_number', defaultBooking.room_number)
      .is('guest_id', null)
      .gte('created_at', sevenDaysAgo)

    if (pastShopOrders && pastShopOrders.length > 0) {
      await supabaseClient
        .from('shop_orders')
        .update({
          guest_id: guestId,
          booking_id_key: personalBooking.id
        })
        .in('id', pastShopOrders.map(o => o.id))

      console.log(`Linked ${pastShopOrders.length} shop orders`)
    }

    // Travel orders
    const { data: pastTravelOrders } = await supabaseClient
      .from('travel_service_orders')
      .select('id, total_amount')
      .is('guest_id', null)
      .gte('created_at', sevenDaysAgo)

    if (pastTravelOrders && pastTravelOrders.length > 0) {
      await supabaseClient
        .from('travel_service_orders')
        .update({
          guest_id: guestId,
          booking_id_key: personalBooking.id
        })
        .in('id', pastTravelOrders.map(o => o.id))

      console.log(`Linked ${pastTravelOrders.length} travel orders`)
    }

    // Calculate total spent and bonuses
    const totalFromShop = pastShopOrders?.reduce((sum, o) => sum + Number(o.total_amount), 0) || 0
    const totalFromTravel = pastTravelOrders?.reduce((sum, o) => sum + Number(o.total_amount), 0) || 0
    const totalSpent = totalFromShop + totalFromTravel

    const bonusFromPurchases = Math.floor(totalSpent * 0.01) // 1%
    const totalBonuses = isNewGuest ? 100 + bonusFromPurchases : bonusFromPurchases

    // Update guest with total_spent and loyalty_points
    await supabaseClient
      .from('guests')
      .update({
        total_spent: totalSpent,
        loyalty_points: totalBonuses
      })
      .eq('id', guestId)

    // Create bonus transaction
    if (totalBonuses > 0) {
      await supabaseClient
        .from('bonus_transactions')
        .insert({
          guest_id: guestId,
          amount: totalBonuses,
          balance_after: totalBonuses,
          note: isNewGuest 
            ? `Приветственный бонус (100) + за покупки (${bonusFromPurchases})`
            : `Бонусы за прошлые покупки (${totalSpent} ₽)`,
          created_by: 'system'
        })
    }

    // Update guest_sessions
    if (sessionToken) {
      await supabaseClient
        .from('guest_sessions')
        .update({
          session_type: 'registered',
          guest_email: email.toLowerCase().trim(),
          guest_name: name.trim(),
          guest_phone: phone?.trim() || null
        })
        .eq('session_token', sessionToken)
        .eq('room_id', currentRoomId)
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        guest: {
          id: guestId,
          email: email.toLowerCase().trim(),
          name: name.trim(),
          loyalty_points: totalBonuses,
          guest_type: 'walk_in'
        },
        booking: {
          id: personalBooking.id,
          booking_id: personalBooking.booking_id
        },
        bonuses_awarded: totalBonuses,
        past_orders_linked: (pastShopOrders?.length || 0) + (pastTravelOrders?.length || 0)
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error registering walk-in guest:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to register guest' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
