-- EducAI Supabase Schema
-- Created: 2026-02-15
-- Purpose: Student profiles, authentication, diagnostic results, knowledge tracking

-- ============================================================
-- TABLE: student_profiles
-- Purpose: Store student metadata and preferences
-- ============================================================
CREATE TABLE IF NOT EXISTS student_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  grade_level TEXT,
  curriculum TEXT DEFAULT 'ib-chemistry-hl-2025',
  preferences JSONB DEFAULT '{"theme": "light", "notifications": true}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ============================================================
-- TABLE: diagnostic_results
-- Purpose: Store results from diagnostic assessments
-- ============================================================
CREATE TABLE IF NOT EXISTS diagnostic_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subtopic_id TEXT NOT NULL,
  subtopic_name TEXT,
  answers JSONB NOT NULL,
  mastery_profile JSONB NOT NULL,
  misconceptions_detected TEXT[] DEFAULT '{}',
  overall_mastery INTEGER CHECK (overall_mastery >= 0 AND overall_mastery <= 100),
  time_taken_seconds INTEGER,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: student_knowledge_state
-- Purpose: Track student mastery and misconceptions per concept
-- (evolves after each diagnostic or tutoring session)
-- ============================================================
CREATE TABLE IF NOT EXISTS student_knowledge_state (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  concept_id TEXT NOT NULL,
  mastery_level INTEGER DEFAULT 0 CHECK (mastery_level >= 0 AND mastery_level <= 100),
  confidence TEXT DEFAULT 'low' CHECK (confidence IN ('low', 'medium', 'high')),
  misconceptions TEXT[] DEFAULT '{}',
  last_assessed TIMESTAMPTZ,
  last_tutored TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, concept_id)
);

-- ============================================================
-- TABLE: tutor_sessions
-- Purpose: Track individual tutoring sessions (for future use)
-- ============================================================
CREATE TABLE IF NOT EXISTS tutor_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  concept_id TEXT NOT NULL,
  messages JSONB NOT NULL DEFAULT '[]',
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  summary JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES for performance
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_student_profiles_user_id ON student_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_diagnostic_results_user_id ON diagnostic_results(user_id);
CREATE INDEX IF NOT EXISTS idx_diagnostic_results_completed_at ON diagnostic_results(completed_at);
CREATE INDEX IF NOT EXISTS idx_knowledge_state_user_id ON student_knowledge_state(user_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_state_concept ON student_knowledge_state(concept_id);
CREATE INDEX IF NOT EXISTS idx_tutor_sessions_user_id ON tutor_sessions(user_id);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) Policies
-- Purpose: Users can only access their own data
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnostic_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_knowledge_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutor_sessions ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- student_profiles RLS Policies
-- ============================================================
CREATE POLICY "Users can view own profile" ON student_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON student_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON student_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================
-- diagnostic_results RLS Policies
-- ============================================================
CREATE POLICY "Users can view own diagnostic results" ON diagnostic_results
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own diagnostic results" ON diagnostic_results
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own diagnostic results" ON diagnostic_results
  FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================
-- student_knowledge_state RLS Policies
-- ============================================================
CREATE POLICY "Users can view own knowledge state" ON student_knowledge_state
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own knowledge state" ON student_knowledge_state
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own knowledge state" ON student_knowledge_state
  FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================
-- tutor_sessions RLS Policies
-- ============================================================
CREATE POLICY "Users can view own tutor sessions" ON tutor_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tutor sessions" ON tutor_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tutor sessions" ON tutor_sessions
  FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================
-- GRANT permissions
-- ============================================================
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON student_profiles TO authenticated;
GRANT ALL ON diagnostic_results TO authenticated;
GRANT ALL ON student_knowledge_state TO authenticated;
GRANT ALL ON tutor_sessions TO authenticated;
