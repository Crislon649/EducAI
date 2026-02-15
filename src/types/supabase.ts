export type Database = {
  public: {
    Tables: {
      student_profiles: {
        Row: {
          id: string
          user_id: string
          display_name: string
          grade_level: string | null
          curriculum: string
          preferences: Record<string, any>
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          display_name: string
          grade_level?: string | null
          curriculum?: string
          preferences?: Record<string, any>
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          display_name?: string
          grade_level?: string | null
          curriculum?: string
          preferences?: Record<string, any>
          created_at?: string
          updated_at?: string
        }
      }
      diagnostic_results: {
        Row: {
          id: string
          user_id: string
          subtopic_id: string
          subtopic_name: string | null
          answers: Record<string, any>
          mastery_profile: Record<string, any>
          misconceptions_detected: string[]
          overall_mastery: number
          time_taken_seconds: number | null
          completed_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          subtopic_id: string
          subtopic_name?: string | null
          answers: Record<string, any>
          mastery_profile: Record<string, any>
          misconceptions_detected?: string[]
          overall_mastery: number
          time_taken_seconds?: number | null
          completed_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          subtopic_id?: string
          subtopic_name?: string | null
          answers?: Record<string, any>
          mastery_profile?: Record<string, any>
          misconceptions_detected?: string[]
          overall_mastery?: number
          time_taken_seconds?: number | null
          completed_at?: string
          created_at?: string
        }
      }
      student_knowledge_state: {
        Row: {
          id: string
          user_id: string
          concept_id: string
          mastery_level: number
          confidence: string
          misconceptions: string[]
          last_assessed: string | null
          last_tutored: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          concept_id: string
          mastery_level?: number
          confidence?: string
          misconceptions?: string[]
          last_assessed?: string | null
          last_tutored?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          concept_id?: string
          mastery_level?: number
          confidence?: string
          misconceptions?: string[]
          last_assessed?: string | null
          last_tutored?: string | null
          updated_at?: string
        }
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}
