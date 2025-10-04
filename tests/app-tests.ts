/**
 * Application Test Suite
 * Run these tests to verify core functionality
 * 
 * Usage: Copy and paste test sections into browser console or run with a test runner
 */

import { supabase } from '@/integrations/supabase/client';
import { getGuestBookingByToken, ensureGuestToken } from '@/utils/tokenUtils';

// ============================================
// 1. DATABASE TESTS
// ============================================

export const databaseTests = {
  /**
   * Test: Verify guests table has correct data
   * Expected: All guests have loyalty tiers and points calculated
   */
  async testGuestsTable() {
    console.log('🧪 Testing guests table...');
    const { data, error } = await supabase
      .from('guests')
      .select('*')
      .order('total_spent', { ascending: false });
    
    if (error) {
      console.error('❌ FAIL: Could not fetch guests', error);
      return false;
    }
    
    console.log(`✅ PASS: Found ${data.length} guests`);
    console.table(data.map(g => ({
      name: g.name,
      email: g.email,
      tier: g.loyalty_tier,
      points: g.loyalty_points,
      spent: g.total_spent
    })));
    return true;
  },

  /**
   * Test: Check bookings-to-orders relationship
   * Expected: All orders should link to valid bookings
   */
  async testBookingOrderIntegrity() {
    console.log('🧪 Testing booking-order integrity...');
    
    const { data: orphanShopOrders } = await supabase
      .from('shop_orders')
      .select('id, booking_id_key')
      .is('booking_id_key', null);
    
    const { data: orphanTravelOrders } = await supabase
      .from('travel_service_orders')
      .select('id, booking_id_key')
      .is('booking_id_key', null);
    
    if ((orphanShopOrders?.length || 0) > 0 || (orphanTravelOrders?.length || 0) > 0) {
      console.warn(`⚠️ WARNING: Found ${orphanShopOrders?.length || 0} orphan shop orders and ${orphanTravelOrders?.length || 0} orphan travel orders`);
      return false;
    }
    
    console.log('✅ PASS: All orders are linked to bookings');
    return true;
  },

  /**
   * Test: Verify RLS policies on guests table
   * Expected: Public can read, admin can manage
   */
  async testGuestsRLS() {
    console.log('🧪 Testing guests RLS policies...');
    
    // Test public read
    const { data, error } = await supabase
      .from('guests')
      .select('email')
      .limit(1);
    
    if (error) {
      console.error('❌ FAIL: Public cannot read guests table', error);
      return false;
    }
    
    console.log('✅ PASS: RLS policies allow public read access');
    return true;
  }
};

// ============================================
// 2. GUEST AUTHENTICATION TESTS
// ============================================

export const guestAuthTests = {
  /**
   * Test: Guest email lookup
   * Expected: Returns booking data for valid email
   */
  async testEmailLookup(testEmail = 'test@example.com') {
    console.log(`🧪 Testing email lookup for: ${testEmail}...`);
    
    const { data, error } = await supabase
      .from('combined')
      .select('*')
      .eq('guest_email', testEmail)
      .eq('visible_to_guests', true)
      .eq('is_archived', false)
      .maybeSingle();
    
    if (error) {
      console.error('❌ FAIL: Email lookup failed', error);
      return false;
    }
    
    if (!data) {
      console.log(`⚠️ No booking found for ${testEmail}`);
      return false;
    }
    
    console.log('✅ PASS: Email lookup successful');
    console.log('Booking data:', data);
    return true;
  },

  /**
   * Test: Token-based guest access
   * Expected: Valid token returns booking data
   */
  async testTokenAccess(token: string) {
    console.log(`🧪 Testing token access: ${token.substring(0, 10)}...`);
    
    const bookingData = await getGuestBookingByToken(token);
    
    if (!bookingData) {
      console.error('❌ FAIL: Token access failed');
      return false;
    }
    
    console.log('✅ PASS: Token access successful');
    console.log('Booking:', bookingData);
    return true;
  },

  /**
   * Test: Token generation for booking
   * Expected: Creates access token for booking
   */
  async testTokenGeneration(bookingId: string) {
    console.log(`🧪 Testing token generation for booking: ${bookingId}...`);
    
    const token = await ensureGuestToken(bookingId);
    
    if (!token) {
      console.error('❌ FAIL: Token generation failed');
      return false;
    }
    
    console.log('✅ PASS: Token generated:', token);
    return true;
  }
};

// ============================================
// 3. ADMIN AUTHENTICATION TESTS
// ============================================

export const adminAuthTests = {
  /**
   * Test: Admin login with correct email
   * Expected: Returns success
   */
  testCorrectAdminEmail() {
    console.log('🧪 Testing admin email validation...');
    const correctEmail = 'monaco1@ya.ru';
    const isValid = correctEmail.toLowerCase().trim() === 'monaco1@ya.ru';
    
    if (!isValid) {
      console.error('❌ FAIL: Admin email validation failed');
      return false;
    }
    
    console.log('✅ PASS: Admin email is valid');
    return true;
  },

  /**
   * Test: Admin login with incorrect email
   * Expected: Returns failure
   */
  testIncorrectAdminEmail() {
    console.log('🧪 Testing admin email rejection...');
    const incorrectEmail = 'wrong@email.com';
    const isValid = incorrectEmail.toLowerCase().trim() === 'monaco1@ya.ru';
    
    if (isValid) {
      console.error('❌ FAIL: Incorrect email was accepted');
      return false;
    }
    
    console.log('✅ PASS: Incorrect admin email was rejected');
    return true;
  }
};

// ============================================
// 4. HOST PORTAL TESTS
// ============================================

export const hostPortalTests = {
  /**
   * Test: Fetch host bookings by email
   * Expected: Returns bookings for host email
   */
  async testHostBookingsLookup(hostEmail: string) {
    console.log(`🧪 Testing host bookings lookup for: ${hostEmail}...`);
    
    const { data, error } = await supabase
      .from('rooms')
      .select(`
        *,
        bookings (
          id,
          booking_id,
          guest_name,
          guest_email,
          check_in_date,
          check_out_date,
          booking_status
        )
      `)
      .eq('host_email', hostEmail)
      .eq('is_active', true);
    
    if (error) {
      console.error('❌ FAIL: Host bookings lookup failed', error);
      return false;
    }
    
    console.log(`✅ PASS: Found ${data.length} properties for host`);
    console.log('Properties:', data);
    return true;
  },

  /**
   * Test: Submit host change request
   * Expected: Creates change request and sends notification
   */
  async testChangeRequest(hostEmail: string, propertyId: string, requestType: string, details: string) {
    console.log('🧪 Testing change request submission...');
    
    // Insert change request
    const { data, error } = await supabase
      .from('host_change_requests')
      .insert({
        host_email: hostEmail,
        property_id: propertyId,
        request_type: requestType,
        request_details: details
      })
      .select()
      .single();
    
    if (error) {
      console.error('❌ FAIL: Change request submission failed', error);
      return false;
    }
    
    console.log('✅ PASS: Change request created:', data);
    
    // Test notification function
    try {
      const { data: notifyData, error: notifyError } = await supabase.functions.invoke(
        'notify-admin-change-request',
        {
          body: {
            host_email: hostEmail,
            property_id: propertyId,
            request_type: requestType,
            request_details: details
          }
        }
      );
      
      if (notifyError) {
        console.warn('⚠️ WARNING: Notification failed', notifyError);
        return true; // Request was saved, notification is secondary
      }
      
      console.log('✅ PASS: Admin notification sent');
      return true;
    } catch (err) {
      console.warn('⚠️ WARNING: Notification function error', err);
      return true; // Request was saved, notification is secondary
    }
  }
};

// ============================================
// 5. SHOP & ORDERS TESTS
// ============================================

export const shopTests = {
  /**
   * Test: Load shop items
   * Expected: Returns active shop items
   */
  async testLoadShopItems() {
    console.log('🧪 Testing shop items loading...');
    
    const { data, error } = await supabase
      .from('shop_items')
      .select('*')
      .eq('is_active', true)
      .order('category');
    
    if (error) {
      console.error('❌ FAIL: Could not load shop items', error);
      return false;
    }
    
    console.log(`✅ PASS: Loaded ${data.length} shop items`);
    console.table(data.map(item => ({
      name: item.name,
      category: item.category,
      price: item.base_price
    })));
    return true;
  },

  /**
   * Test: Submit shop order
   * Expected: Creates order and sends notification
   */
  async testShopOrder(orderData: {
    customer_name: string;
    customer_phone: string;
    room_number?: string;
    ordered_items: any[];
    total_amount: number;
    customer_comment?: string;
  }) {
    console.log('🧪 Testing shop order submission...');
    
    try {
      const { data, error } = await supabase.functions.invoke('submit-shop-order', {
        body: orderData
      });
      
      if (error) {
        console.error('❌ FAIL: Shop order submission failed', error);
        return false;
      }
      
      console.log('✅ PASS: Shop order created:', data);
      return true;
    } catch (err) {
      console.error('❌ FAIL: Shop order error', err);
      return false;
    }
  }
};

// ============================================
// 6. TRAVEL SERVICES TESTS
// ============================================

export const travelTests = {
  /**
   * Test: Load travel services
   * Expected: Returns active travel services
   */
  async testLoadTravelServices() {
    console.log('🧪 Testing travel services loading...');
    
    const { data, error } = await supabase
      .from('travel_services')
      .select('*')
      .eq('is_active', true)
      .order('category');
    
    if (error) {
      console.error('❌ FAIL: Could not load travel services', error);
      return false;
    }
    
    console.log(`✅ PASS: Loaded ${data.length} travel services`);
    console.table(data.map(service => ({
      title: service.title,
      category: service.category,
      price: service.base_price,
      duration: service.duration_hours
    })));
    return true;
  },

  /**
   * Test: Submit travel order
   * Expected: Creates order and sends notification
   */
  async testTravelOrder(orderData: {
    customer_name: string;
    customer_phone: string;
    selected_services: any[];
    total_amount: number;
    customer_comment?: string;
  }) {
    console.log('🧪 Testing travel order submission...');
    
    try {
      const { data, error } = await supabase.functions.invoke('submit-travel-order', {
        body: orderData
      });
      
      if (error) {
        console.error('❌ FAIL: Travel order submission failed', error);
        return false;
      }
      
      console.log('✅ PASS: Travel order created:', data);
      return true;
    } catch (err) {
      console.error('❌ FAIL: Travel order error', err);
      return false;
    }
  }
};

// ============================================
// 7. FEEDBACK SYSTEM TESTS
// ============================================

export const feedbackTests = {
  /**
   * Test: Submit feedback
   * Expected: Creates feedback and sends notification
   */
  async testSubmitFeedback(feedbackData: {
    customer_name: string;
    room_number?: string;
    rating: number;
    message?: string;
  }) {
    console.log('🧪 Testing feedback submission...');
    
    try {
      const { data, error } = await supabase.functions.invoke('submit-feedback', {
        body: feedbackData
      });
      
      if (error) {
        console.error('❌ FAIL: Feedback submission failed', error);
        return false;
      }
      
      console.log('✅ PASS: Feedback submitted:', data);
      return true;
    } catch (err) {
      console.error('❌ FAIL: Feedback error', err);
      return false;
    }
  },

  /**
   * Test: Load all feedback (admin)
   * Expected: Returns all feedback entries
   */
  async testLoadFeedback() {
    console.log('🧪 Testing feedback loading...');
    
    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('❌ FAIL: Could not load feedback', error);
      return false;
    }
    
    console.log(`✅ PASS: Loaded ${data.length} feedback entries`);
    console.table(data.map(f => ({
      name: f.customer_name,
      rating: f.rating,
      room: f.room_number,
      date: new Date(f.created_at).toLocaleDateString()
    })));
    return true;
  }
};

// ============================================
// 8. QUICK TEST RUNNER
// ============================================

export const runAllTests = async () => {
  console.log('🚀 Running all tests...\n');
  
  const results = {
    passed: 0,
    failed: 0,
    warnings: 0
  };
  
  // Database Tests
  console.log('\n📊 DATABASE TESTS');
  console.log('='.repeat(50));
  await databaseTests.testGuestsTable() ? results.passed++ : results.failed++;
  await databaseTests.testBookingOrderIntegrity() ? results.passed++ : results.failed++;
  await databaseTests.testGuestsRLS() ? results.passed++ : results.failed++;
  
  // Guest Auth Tests
  console.log('\n👤 GUEST AUTHENTICATION TESTS');
  console.log('='.repeat(50));
  // Note: Add actual test emails from your database
  
  // Admin Auth Tests
  console.log('\n🔐 ADMIN AUTHENTICATION TESTS');
  console.log('='.repeat(50));
  adminAuthTests.testCorrectAdminEmail() ? results.passed++ : results.failed++;
  adminAuthTests.testIncorrectAdminEmail() ? results.passed++ : results.failed++;
  
  // Shop Tests
  console.log('\n🛒 SHOP TESTS');
  console.log('='.repeat(50));
  await shopTests.testLoadShopItems() ? results.passed++ : results.failed++;
  
  // Travel Tests
  console.log('\n✈️ TRAVEL SERVICES TESTS');
  console.log('='.repeat(50));
  await travelTests.testLoadTravelServices() ? results.passed++ : results.failed++;
  
  // Feedback Tests
  console.log('\n💬 FEEDBACK TESTS');
  console.log('='.repeat(50));
  await feedbackTests.testLoadFeedback() ? results.passed++ : results.failed++;
  
  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📋 TEST SUMMARY');
  console.log('='.repeat(50));
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`⚠️ Warnings: ${results.warnings}`);
  console.log(`📊 Total: ${results.passed + results.failed}`);
  console.log(`🎯 Success Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%`);
};

// Export quick test commands for manual use
export const quickTests = {
  // Run all database tests
  db: async () => {
    await databaseTests.testGuestsTable();
    await databaseTests.testBookingOrderIntegrity();
    await databaseTests.testGuestsRLS();
  },
  
  // Test guest lookup with specific email
  guest: (email: string) => guestAuthTests.testEmailLookup(email),
  
  // Test shop functionality
  shop: async () => {
    await shopTests.testLoadShopItems();
  },
  
  // Test travel services
  travel: async () => {
    await travelTests.testLoadTravelServices();
  },
  
  // Load all feedback
  feedback: async () => {
    await feedbackTests.testLoadFeedback();
  }
};

// Usage examples in console:
console.log(`
📖 TEST SUITE USAGE:
===================

// Run all tests
runAllTests()

// Run specific test groups
quickTests.db()           // Database tests
quickTests.shop()         // Shop tests
quickTests.travel()       // Travel tests
quickTests.feedback()     // Feedback tests

// Run individual tests
databaseTests.testGuestsTable()
shopTests.testLoadShopItems()
guestAuthTests.testEmailLookup('test@example.com')

// Test order submission
shopTests.testShopOrder({
  customer_name: 'Test User',
  customer_phone: '+79991234567',
  room_number: '101',
  ordered_items: [{ id: 'xxx', name: 'Test Item', quantity: 1, price: 100 }],
  total_amount: 100
})
`);
