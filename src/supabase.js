import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rorxefawrqpzthsaigcb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvcnhlZmF3cnFwenRoc2FpZ2NiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyNTcwMjIsImV4cCI6MjA5NDgzMzAyMn0.BaFOU6ocdRCGj8LFvQRM7qJgPFXI9gyjNzoNo1fKASo'

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
)