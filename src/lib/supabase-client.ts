import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/supabase'

export const supabase = createClientComponentClient<Database>()

export const auth = {
  signUp: async (email: string, password: string, displayName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName },
      },
    })
    return { data, error }
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  getSession: async () => {
    const { data, error } = await supabase.auth.getSession()
    return { data, error }
  },

  getCurrentUser: async () => {
    const { data, error } = await supabase.auth.getUser()
    return { data, error }
  },
}

export const db = {
  createStudentProfile: async (userId: string, displayName: string) => {
    const { data, error } = await supabase
      .from('student_profiles')
      .insert({
        user_id: userId,
        display_name: displayName,
        curriculum: 'ib-chemistry-hl-2025',
      })
      .select()
      .single()
    return { data, error }
  },

  getStudentProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from('student_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()
    return { data, error }
  },

  updateStudentProfile: async (userId: string, updates: any) => {
    const { data, error } = await supabase
      .from('student_profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single()
    return { data, error }
  },

  saveDiagnosticResult: async (
    userId: string,
    subtopicId: string,
    answers: any,
    masteryProfile: any,
    misconceptions: string[],
    overallMastery: number,
    timeTaken: number
  ) => {
    const { data, error } = await supabase
      .from('diagnostic_results')
      .insert({
        user_id: userId,
        subtopic_id: subtopicId,
        answers,
        mastery_profile: masteryProfile,
        misconceptions_detected: misconceptions,
        overall_mastery: overallMastery,
        time_taken_seconds: timeTaken,
      })
      .select()
      .single()
    return { data, error }
  },

  getLatestDiagnosticResult: async (userId: string, subtopicId: string) => {
    const { data, error } = await supabase
      .from('diagnostic_results')
      .select('*')
      .eq('user_id', userId)
      .eq('subtopic_id', subtopicId)
      .order('completed_at', { ascending: false })
      .limit(1)
      .single()
    return { data, error }
  },

  updateKnowledgeState: async (
    userId: string,
    conceptId: string,
    masteryLevel: number,
    misconceptions: string[]
  ) => {
    const { data, error } = await supabase
      .from('student_knowledge_state')
      .upsert(
        {
          user_id: userId,
          concept_id: conceptId,
          mastery_level: masteryLevel,
          misconceptions,
          last_assessed: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,concept_id' }
      )
      .select()
      .single()
    return { data, error }
  },

  getKnowledgeState: async (userId: string, conceptId: string) => {
    const { data, error } = await supabase
      .from('student_knowledge_state')
      .select('*')
      .eq('user_id', userId)
      .eq('concept_id', conceptId)
      .single()
    return { data, error }
  },
}
