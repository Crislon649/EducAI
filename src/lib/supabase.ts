import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          created_at?: string
        }
      }
      student_profiles: {
        Row: {
          id: string
          user_id: string
          subject: string
          learning_style: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          subject: string
          learning_style?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          subject?: string
          learning_style?: string | null
          created_at?: string
        }
      }
    }
  }
}
