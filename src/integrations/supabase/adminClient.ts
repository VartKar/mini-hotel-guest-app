
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xsklkktajwtcdgkmmsrk.supabase.co'
// Use the correct service role key from Supabase secrets
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhza2xra3Rhand0Y2Rna21tc3JrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODg0MjQ2NCwiZXhwIjoyMDY0NDE4NDY0fQ.xE4zQ9T_KE5qEq5QI9yjhGk-fFQlqNQgJdKEHWgWWBQ'

console.log('=== ADMIN CLIENT SETUP ===');
console.log('Supabase URL:', supabaseUrl);
console.log('Service key length:', supabaseServiceKey.length);
console.log('Service key starts with:', supabaseServiceKey.substring(0, 20));

// Validate service key format
if (!supabaseServiceKey.startsWith('eyJ')) {
  console.error('❌ Invalid service key format - should start with eyJ');
  throw new Error('Invalid service key format');
}

console.log('✅ Service key format is valid');

// Create admin client with proper configuration
export const adminSupabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  global: {
    headers: {
      'Authorization': `Bearer ${supabaseServiceKey}`
    }
  }
})

console.log('✅ Admin client created successfully');

// Test connection immediately
const testConnection = async () => {
  try {
    console.log('🔍 Testing admin client connection...');
    
    // First test: simple table query
    const { data, error, count } = await adminSupabase
      .from('combined')
      .select('*', { count: 'exact' })
      .limit(1);
    
    if (error) {
      console.error('❌ Admin client connection test failed:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      return false;
    }
    
    console.log('✅ Admin client connection test successful:', {
      dataCount: data?.length || 0,
      totalCount: count
    });
    
    return true;
  } catch (err) {
    console.error('❌ Admin client connection test exception:', err);
    return false;
  }
};

// Run test immediately
testConnection().then(success => {
  if (success) {
    console.log('🎉 Admin client is ready to use');
  } else {
    console.error('💥 Admin client failed initialization');
  }
});
