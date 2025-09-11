import { createClient } from '@supabase/supabase-js'

// Using Lovable's built-in Supabase integration
export const supabase = createClient(
  'https://your-project.supabase.co',
  'your-anon-key'
)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      memes: {
        Row: {
          id: string
          title: string
          image_url: string
          user_id: string
          upvotes: number
          downvotes: number
          comments_count: number
          tags: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          image_url: string
          user_id: string
          upvotes?: number
          downvotes?: number
          comments_count?: number
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          image_url?: string
          user_id?: string
          upvotes?: number
          downvotes?: number
          comments_count?: number
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}