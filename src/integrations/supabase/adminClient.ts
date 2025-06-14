
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xsklkktajwtcdgkmmsrk.supabase.co'
// Using the correct service role key from Supabase secrets
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhza2xra3Rhand0Y2Rna21tc3JrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODg0MjQ2NCwiZXhwIjoyMDY0NDE4NDY0fQ.xE4zQ9T_KE5qEq5QI9yjhGk-fFQlqNQgJdKEHWgWWBQ'

console.log('=== ADMIN CLIENT SETUP ===');
console.log('Supabase URL:', supabaseUrl);
console.log('Service key starts with:', supabaseServiceKey.substring(0, 20) + '...');

// Create a client with service role key for admin operations
export const adminSupabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

console.log('Admin client created successfully');
