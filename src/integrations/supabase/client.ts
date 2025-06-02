
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xsklkktajwtcdgkmmsrk.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhza2xra3Rhand0Y2Rna21tc3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4NDI0NjQsImV4cCI6MjA2NDQxODQ2NH0.rSPgimhCF1FIhN22g05FjFchByO7xFnfgagKJv-drL4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
