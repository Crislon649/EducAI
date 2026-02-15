# EducAI Backend Integration Plan
## From Lovable UI to Functional MVP

**Status:** Lovable UI generated and customized ✅  
**Next Phase:** Backend integration (Supabase + scoring engine)  
**Timeline:** 2-3 days (if focused)  
**Owner:** Dion (backend), Claude (scoring logic review)

---

## Current State

### What's Done
- ✅ Lovable UI: 4 pages generated with custom branding
  - Landing: "Your AI Tutor That Actually Understands You"
  - Dashboard: Clean, focused start diagnostic CTA
  - Diagnostic: 5 questions with subtle feedback, curriculum IDs visible
  - Results: Concept mastery bars by ID (S1.1.1, S1.1.2, S1.1.3)
- ✅ Curriculum JSON: S1.1 complete (3 concepts, 12 misconceptions)
- ✅ Diagnostic questions: 5 Qs mapped to misconceptions

### What's Missing
- ❌ Lovable code exported to GitHub
- ❌ Supabase schema verified (partially done, needs review)
- ❌ Auth wired to Lovable pages
- ❌ Diagnostic questions hardcoded in Lovable → replaced with real JSON
- ❌ Scoring logic: answers → misconceptions → StudentKnowledgeProfile
- ❌ Results page connected to Supabase data
- ❌ Full flow tested (signup → diagnostic → results)

---

## Integration Roadmap (5 Tasks)

### TASK 1: Export Lovable to GitHub (1-2 hours)

**What to do:**
1. In Lovable: Top-right → "Export" or "⋯" menu → "Export as Next.js + TypeScript"
2. Download ZIP
3. Extract to Desktop/temp folder
4. In Terminal:
   ```bash
   cd /home/cris/.openclaw/workspace/EducAI
   git checkout -b lovable-integration
   # Copy Lovable src/app and src/components into your project
   cp -r ~/Downloads/educai-lovable/src/app/* src/app/
   cp -r ~/Downloads/educai-lovable/src/components/* src/components/
   # Check for conflicts (package.json, tsconfig.json, etc.) — merge carefully
   git add .
   git commit -m "feat: Export Lovable UI (landing, dashboard, diagnostic, results)"
   git push origin lovable-integration
   ```

**Deliverable:**
- [ ] GitHub branch `lovable-integration` with Lovable code
- [ ] No merge to main yet (manual review first)
- [ ] package.json merged (check for duplicate dependencies)
- [ ] tsconfig.json aligned with your project

**Owner:** Cristian (or Dion if you want me to do it)

---

### TASK 2: Verify Supabase Schema (1 hour)

**Current Status:**
Your Supabase project already has these tables (from earlier setup):
- `student_profiles` (user_id, email, full_name, date_of_birth, created_at)
- `diagnostic_results` (id, student_id FK, subtopic, overall_mastery, concept_mastery JSONB, misconceptions_detected JSONB, timestamp)
- `student_knowledge_state` (id, student_id FK, subtopic, concept_mastery JSONB, misconceptions JSONB, last_updated)
- `tutor_sessions` (id, student_id FK, subtopic, session_start, session_end, messages JSONB)

**What to verify:**
1. Log into Supabase console: https://app.supabase.com
2. Navigate to your project (jucx5thvhyi)
3. Check "Tables" section → Verify all 4 tables exist
4. Click each table → Verify columns match above
5. Check "Authentication" → Verify Auth is enabled
6. Check "SQL Editor" → Run this to verify RLS:
   ```sql
   SELECT * FROM pg_policies WHERE schemaname = 'public';
   ```

**If tables are missing:**
Run this SQL in Supabase SQL Editor:
```sql
-- student_profiles
CREATE TABLE IF NOT EXISTS student_profiles (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  date_of_birth DATE,
  curriculum TEXT DEFAULT 'ib-chemistry-hl-2025',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- diagnostic_results
CREATE TABLE IF NOT EXISTS diagnostic_results (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subtopic_id TEXT NOT NULL,
  answers JSONB NOT NULL,
  mastery_profile JSONB NOT NULL,
  misconceptions_detected TEXT[] NOT NULL,
  overall_mastery NUMERIC NOT NULL,
  time_taken_seconds INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- student_knowledge_state
CREATE TABLE IF NOT EXISTS student_knowledge_state (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  concept_id TEXT NOT NULL,
  mastery_level NUMERIC NOT NULL,
  misconceptions TEXT[] NOT NULL,
  last_assessed TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, concept_id)
);

-- tutor_sessions
CREATE TABLE IF NOT EXISTS tutor_sessions (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subtopic_id TEXT NOT NULL,
  session_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_end TIMESTAMP WITH TIME ZONE,
  messages JSONB[] DEFAULT '{}',
  completed BOOLEAN DEFAULT FALSE
);

-- Enable RLS
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnostic_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_knowledge_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutor_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users see only own data
CREATE POLICY "Users see own profiles" 
  ON student_profiles FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Users insert own profile" 
  ON student_profiles FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users see own diagnostic results" 
  ON diagnostic_results FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Users insert own diagnostic" 
  ON diagnostic_results FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users see own knowledge state" 
  ON student_knowledge_state FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Users update own knowledge state" 
  ON student_knowledge_state FOR UPDATE 
  USING (user_id = auth.uid());

CREATE POLICY "Users see own tutor sessions" 
  ON tutor_sessions FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Users insert own tutor session" 
  ON tutor_sessions FOR INSERT 
  WITH CHECK (user_id = auth.uid());
```

**Deliverable:**
- [ ] All 4 tables verified in Supabase
- [ ] RLS policies active
- [ ] Auth enabled
- [ ] Can connect from Next.js via .env.local credentials

**Owner:** Dion (verify + run SQL if needed)

---

### TASK 3: Integrate Auth with Lovable Pages (2-3 hours)

**Current situation:**
- Lovable generated UI pages (landing, dashboard, diagnostic, results)
- Your existing auth logic is in `/src/lib/supabase-client.ts`
- Lovable pages may not be wired to Supabase auth yet

**What to do:**

1. **Review Lovable pages for auth:**
   - Check `/src/app/(auth)/login/page.tsx` (from Lovable)
   - Check `/src/app/(auth)/signup/page.tsx` (from Lovable)
   - Are they using your `supabase-client.ts` or have their own auth?

2. **If Lovable has separate auth:**
   - Replace with your existing auth code (already tested, has error handling)
   - Or integrate Lovable's auth with your Supabase client if it's good

3. **Update middleware.ts** to protect Lovable routes:
   ```typescript
   // Already done, but verify it catches these new routes:
   const protectedRoutes = ['/dashboard', '/diagnostic', '/results']
   ```

4. **Test auth flow:**
   ```bash
   npm run dev
   # Try: signup → check Supabase for new user ✅
   # Try: login with same user ✅
   # Try: access /dashboard without auth → redirects to /login ✅
   ```

**Deliverable:**
- [ ] Auth pages wired to your Supabase client
- [ ] Middleware protecting diagnostic + results routes
- [ ] Signup creates student_profiles entry in Supabase
- [ ] Login redirects to dashboard
- [ ] Test signup + login flow manually

**Owner:** Dion

---

### TASK 4: Connect Diagnostic to Scoring Engine (3-4 hours) ⭐

**Current situation:**
- Lovable diagnostic page has hardcoded questions (Lovable's test data)
- You have real diagnostic questions in `/data/diagnostics/diagnostic_S1.1_v1.json`
- Scoring logic exists in curriculum JSON but not wired to UI

**What to do:**

1. **Load real diagnostic questions:**
   ```typescript
   // src/app/diagnostic/page.tsx
   import diagnosticData from '@/data/diagnostics/diagnostic_S1.1_v1.json'
   
   export default function DiagnosticPage() {
     const questions = diagnosticData.questions // S1.1 has 5 questions
     // Render questions instead of Lovable's hardcoded ones
   }
   ```

2. **Capture student answers:**
   ```typescript
   // On "Next" button, store answer:
   const [answers, setAnswers] = useState<Record<number, string>>({})
   
   const handleSelectAnswer = (questionIndex: number, optionId: string) => {
     setAnswers(prev => ({
       ...prev,
       [questionIndex]: optionId
     }))
   }
   ```

3. **On diagnostic completion, call scoring engine:**
   ```typescript
   // src/app/diagnostic/page.tsx
   const handleSubmitDiagnostic = async () => {
     const result = await scoreStudentAnswers(
       answers,
       diagnosticData,
       curriculumData
     )
     // result = StudentKnowledgeProfile
     // Save to Supabase + redirect to /results
   }
   ```

**Deliverable:**
- [ ] Lovable's hardcoded questions replaced with real diagnostic JSON
- [ ] Answer selection captured
- [ ] "Submit Diagnostic" button calls scoring logic
- [ ] Results sent to Supabase before redirect to /results

**Owner:** Dion + Claude (scoring logic review)

---

### TASK 5: Build Scoring Logic (Haiku: setup, Sonnet: algorithm) (3-4 hours) ⭐⭐

**This is the core logic. Two parts:**

#### Part A: Setup (Haiku-level)
Create `/src/lib/scoring.ts`:
```typescript
import curriculumData from '@/data/curriculum/ib-chemistry-hl-2025.json'
import diagnosticData from '@/data/diagnostics/diagnostic_S1.1_v1.json'

export interface StudentKnowledgeProfile {
  student_id: string
  subtopic: 'S1.1'
  overall_mastery: number // 0-100
  concept_mastery: {
    'S1.1.1': number // percentage
    'S1.1.2': number
    'S1.1.3': number
  }
  misconceptions_detected: string[] // e.g., ['S1.1.1-M2', 'S1.1.2-M3']
  timestamp: string
}

export async function scoreStudentAnswers(
  answers: Record<number, string>,
  diagnostic: typeof diagnosticData,
  curriculum: typeof curriculumData
): Promise<StudentKnowledgeProfile> {
  // TODO: Implement scoring algorithm
}
```

#### Part B: Scoring Algorithm (Sonnet-level)

**Algorithm:**
```
For each question answered:
  1. Get the student's answer (e.g., "option_b")
  2. Find the question in diagnostic JSON
  3. Check if answer_is_correct
  4. If correct:
     - Get knowledge_signals.concept_mastery score (e.g., 85)
     - Add to that concept's mastery pool
  5. If incorrect:
     - Get misconception_id (e.g., "S1.1.1-M2")
     - Record in detected_misconceptions
     - Add to concept's mastery pool (usually lower, e.g., 40)

After all questions:
  - Calculate average mastery per concept
  - Calculate overall mastery (average of all concepts)
  - List detected misconceptions
  - Return StudentKnowledgeProfile
```

**Example calculation:**

```json
Question 1: Student answers option_b (WRONG)
  - correct_option: option_a
  - misconception_triggered: S1.1.1-M2 (element ≠ atom)
  - knowledge_signal_mastery: 35%
  - Concept S1.1.1 score: 35

Question 2: Student answers option_a (CORRECT)
  - knowledge_signal_mastery: 85%
  - Concept S1.1.1 score: 85

Question 3: Student answers option_c (WRONG)
  - misconception_triggered: S1.1.2-M3
  - knowledge_signal_mastery: 45%
  - Concept S1.1.2 score: 45

Question 4: Student answers option_a (CORRECT)
  - knowledge_signal_mastery: 90%
  - Concept S1.1.2 score: 90

Question 5: Student answers option_b (CORRECT)
  - knowledge_signal_mastery: 88%
  - Concept S1.1.3 score: 88

RESULTS:
  S1.1.1: (35 + 85) / 2 = 60%
  S1.1.2: (45 + 90) / 2 = 67.5% ≈ 68%
  S1.1.3: 88%
  Overall: (60 + 68 + 88) / 3 = 72%
  Misconceptions: [S1.1.1-M2, S1.1.2-M3]
```

**Implementation (Haiku):**
```typescript
export async function scoreStudentAnswers(
  answers: Record<number, string>,
  diagnostic,
  curriculum
): Promise<StudentKnowledgeProfile> {
  const conceptMastery: Record<string, number[]> = {
    'S1.1.1': [],
    'S1.1.2': [],
    'S1.1.3': []
  }
  const misconceptions = new Set<string>()

  Object.entries(answers).forEach(([qIndex, selectedOptionId]) => {
    const qNum = parseInt(qIndex)
    const question = diagnostic.questions[qNum]
    const selectedOption = question.options.find(o => o.id === selectedOptionId)
    
    if (selectedOption.is_correct) {
      // Correct answer
      conceptMastery[selectedOption.targets_concept].push(
        selectedOption.knowledge_signals.concept_mastery
      )
    } else {
      // Wrong answer
      if (selectedOption.misconception_id) {
        misconceptions.add(selectedOption.misconception_id)
      }
      conceptMastery[selectedOption.targets_concept].push(
        selectedOption.knowledge_signals.concept_mastery
      )
    }
  })

  const conceptAverages = Object.entries(conceptMastery).reduce(
    (acc, [concept, scores]) => ({
      ...acc,
      [concept]: scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b) / scores.length) : 0
    }),
    {}
  )

  const overallMastery = Object.values(conceptAverages).reduce((a, b) => a + b) / 3

  return {
    overall_mastery: Math.round(overallMastery),
    concept_mastery: conceptAverages,
    misconceptions_detected: Array.from(misconceptions),
    timestamp: new Date().toISOString()
  }
}
```

**Deliverable:**
- [ ] `/src/lib/scoring.ts` created
- [ ] `scoreStudentAnswers()` function implemented
- [ ] Algorithm tested with example answers
- [ ] Returns correct StudentKnowledgeProfile shape

**Owner:** Dion (implementation), Claude (review)

---

### TASK 6: Connect Results Page to Supabase (2-3 hours)

**What to do:**

1. **In `/src/app/results/page.tsx`:**
   ```typescript
   'use client'
   
   import { useEffect, useState } from 'react'
   import { supabase } from '@/lib/supabase-client'
   
   export default function ResultsPage() {
     const [profile, setProfile] = useState(null)
     const [loading, setLoading] = useState(true)
   
     useEffect(() => {
       const fetchResults = async () => {
         // Get latest diagnostic_results from Supabase
         const { data } = await supabase
           .from('diagnostic_results')
           .select('*')
           .order('completed_at', { ascending: false })
           .limit(1)
           .single()
         
         setProfile(data)
         setLoading(false)
       }
       
       fetchResults()
     }, [])
   
     if (loading) return <div>Loading...</div>
     
     return (
       <div>
         <h1>Overall Mastery: {profile.overall_mastery}%</h1>
         
         {/* Concept mastery bars */}
         {Object.entries(profile.mastery_profile).map(([concept, mastery]) => (
           <div key={concept}>
             <p>{concept}: {mastery}%</p>
             <div className="w-full bg-gray-200 rounded">
               <div 
                 className="bg-blue-500 h-2 rounded"
                 style={{ width: `${mastery}%` }}
               />
             </div>
           </div>
         ))}
         
         {/* Misconceptions */}
         <div>
           <h2>Misconceptions Detected:</h2>
           {profile.misconceptions_detected.map(m => (
             <div key={m} className="p-4 bg-orange-100 rounded">
               <p>{m}</p>
             </div>
           ))}
         </div>
         
         {/* Coming Soon: AI Tutor */}
         <button disabled className="opacity-50">
           🔒 Start AI Tutoring Session (Coming Soon)
         </button>
       </div>
     )
   }
   ```

2. **Color-code mastery bars:**
   - Green: 80%+
   - Yellow: 50-79%
   - Red: <50%

3. **Display misconceptions with description:**
   - Pull misconception details from curriculum JSON
   - Show "This is a common misconception. Here's the correct understanding..."

**Deliverable:**
- [ ] Results page fetches from Supabase
- [ ] Mastery bars rendered with colors
- [ ] Misconceptions displayed with details
- [ ] Data persists (check Supabase after test)

**Owner:** Dion

---

## Execution Order (Priority)

```
1. TASK 1: Export Lovable → GitHub branch
   └─ Deliverable: lovable-integration branch
   
2. TASK 2: Verify Supabase schema
   └─ Deliverable: All tables + RLS confirmed
   
3. TASK 3: Integrate Auth
   └─ Deliverable: signup/login working
   
4. TASK 4: Connect Diagnostic to JSON
   └─ Deliverable: Real questions load, answers captured
   
5. TASK 5: Build Scoring Logic
   └─ Deliverable: StudentKnowledgeProfile generated
   
6. TASK 6: Connect Results to Supabase
   └─ Deliverable: Real data displayed
   
7. FULL FLOW TEST
   └─ Signup → Dashboard → Diagnostic (5 Q) → Results
   └─ Brother tests + feedback
```

---

## Testing Checklist

### Auth Flow
- [ ] Signup creates user in Supabase auth
- [ ] Signup creates student_profiles entry
- [ ] Login with same credentials works
- [ ] Unauthenticated access to /dashboard redirects to /login
- [ ] Logout clears session

### Diagnostic Flow
- [ ] Dashboard button "Start Diagnostic" navigates to /diagnostic
- [ ] All 5 questions load from JSON
- [ ] Can select options
- [ ] "Next" button progresses through questions
- [ ] "Previous" button goes back
- [ ] Last question has "Submit" button
- [ ] Submit button is disabled until all 5 Qs answered

### Scoring & Results
- [ ] Submit diagnostic calls scoring function
- [ ] Scoring returns correct StudentKnowledgeProfile
- [ ] Results saved to diagnostic_results table
- [ ] Redirect to /results page
- [ ] Results page shows correct mastery % and misconceptions
- [ ] Mastery bars are color-coded (green/yellow/red)

### Full Flow (with brother)
- [ ] Brother completes signup
- [ ] Brother takes diagnostic
- [ ] Brother sees results
- [ ] Results are accurate (spot-check against curriculum)
- [ ] Brother gives feedback: "Was this helpful?"

---

## Model Routing (Budget Optimization)

| Task | Complexity | Model | Cost Estimate |
|------|-----------|-------|---------------|
| TASK 1: Export | Low | N/A (CLI) | $0 |
| TASK 2: Verify | Low | Haiku | $0.10 |
| TASK 3: Auth | Medium | Haiku | $0.50 |
| TASK 4: Connect | Medium | Sonnet | $2.00 |
| TASK 5: Scoring | High | Sonnet | $3.00 |
| TASK 6: Results | Medium | Haiku | $0.50 |
| **TOTAL** | — | — | **~$6.10** |

---

## Success Criteria (End of Integration)

- ✅ Full signup → diagnostic → results flow works
- ✅ Data persists to Supabase (verify in console)
- ✅ Scoring algorithm accurate (test with known answers)
- ✅ Results page displays real data from DB
- ✅ Brother completes test, gives positive feedback
- ✅ Zero auth errors, zero database errors
- ✅ Ready to merge lovable-integration → main
- ✅ Ready to deploy to Vercel

---

## Timeline

| Task | Hours | Who | When |
|------|-------|-----|------|
| 1-2 | 3 | Cristian/Dion | Today |
| 3 | 2-3 | Dion | Today/Tomorrow |
| 4 | 3-4 | Dion + Claude | Tomorrow |
| 5 | 3-4 | Dion + Claude | Tomorrow |
| 6 | 2-3 | Dion | Tomorrow |
| Testing | 2 | Cristian + Brother | End of week |
| **TOTAL** | **15-19 hours** | — | **2-3 days** |

---

## Next Immediate Action

**Priority 1 (Today):**
- [ ] Export Lovable → GitHub `lovable-integration` branch
- [ ] Verify Supabase schema (tables exist, RLS active)

Once done, I take relay on TASK 3-6 (auth + scoring + results).

Let me know when Lovable is exported!
