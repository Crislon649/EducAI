# EducAI Roadmap: 7 Phases to Global Scale

---

## Phase 1: IB Chemistry MVP (Weeks 1-4)
**Goal:** Validate that diagnostic + voice tutor concept works for learning

### Deliverables
- [ ] Text diagnostic (5 questions for S1.1)
- [ ] Results page (concept mastery, misconceptions, remediation)
- [ ] Supabase integration (save diagnostic results)
- [ ] Dashboard (start diagnostic, view results)
- [ ] Landing page (explain how it works)
- [ ] Middleware (route protection)

### Timeline
- Weeks 1-2: Lovable generates UI (landing, dashboard, diagnostic, results)
- Week 3: Integration with Supabase + curriculum JSON
- Week 4: Testing with Cristian's brother + iteration

### Success Criteria
- [ ] Brother completes diagnostic in <10 min
- [ ] Results accurately identify his misconceptions
- [ ] He says: "This was actually helpful"
- [ ] Diagnostic data saves to Supabase correctly
- [ ] No crashes or major bugs

### Tech Stack
- Next.js 15 + TypeScript
- Tailwind CSS + shadcn/ui (via Lovable)
- Supabase (auth, database, RLS)
- Curriculum JSON (S1.1 complete)

### Owner
- UI: Lovable (generated)
- Backend: Dion (Supabase integration, curriculum wiring)
- Testing: Cristian + brother

---

## Phase 2: Voice Tutor MVP (Weeks 5-8)
**Goal:** Prove that voice I/O + Claude tutoring works better than text

### Deliverables
- [ ] Voice input (Deepgram Nova-2)
- [ ] Voice output (ElevenLabs Turbo v2)
- [ ] Tutor system prompt (Claude Sonnet)
- [ ] Session management (save to tutor_sessions table)
- [ ] One complete tutoring interaction (5-10 min)
- [ ] Simple session UI (chat-like interface)

### Timeline
- Week 5: Design tutor system prompt + voice stack selection
- Week 6: Integrate Deepgram + ElevenLabs
- Week 7: Wire up Claude Sonnet as tutor brain
- Week 8: Test with brother + iterate

### Success Criteria
- [ ] Brother has natural conversation with AI tutor
- [ ] Tutor correctly addresses his misconceptions (from Phase 1)
- [ ] Session ends with measurable learning ("I understand why now")
- [ ] Voice audio is clear, not robotic
- [ ] No major latency issues (<3 seconds per response)

### Tech Stack
- Deepgram SDK (speech-to-text)
- ElevenLabs API (text-to-speech)
- Claude API (Sonnet model)
- Supabase (tutor_sessions table)

### Budget
- Deepgram: ~$1/month (development)
- ElevenLabs: ~$5-10/month (development)
- Claude API: ~$20-50/month (lots of testing)

### Owner
- Voice stack: Dion + Claude
- System prompt: Claude (Opus-level design)
- Testing: Cristian + brother

---

## Phase 3: Complete IB Chemistry HL (Weeks 9-12)
**Goal:** Build out full IB Chemistry HL curriculum (all 148 concepts)

### Deliverables
- [ ] Curriculum JSON: S1 (23 concepts)
- [ ] Curriculum JSON: S2 (28 concepts)
- [ ] Curriculum JSON: S3 (22 concepts)
- [ ] Curriculum JSON: R1 (18 concepts)
- [ ] Curriculum JSON: R2 (25 concepts)
- [ ] Curriculum JSON: R3 (49 concepts)
- [ ] Diagnostic questions for each theme (5-10 Qs per theme)
- [ ] Parent dashboard (progress tracking, mastery heatmap)
- [ ] Tutor sessions for multiple concepts

### Timeline
- Week 9: S1 + S2 curriculum + diagnostics
- Week 10: S3 + R1 curriculum + diagnostics
- Week 11: R2 + R3 curriculum + diagnostics
- Week 12: Parent dashboard + integration testing

### Success Criteria
- [ ] 148 IB Chemistry concepts mapped with misconceptions
- [ ] Diagnostic questions cover all major concepts
- [ ] Parent dashboard shows meaningful progress data
- [ ] Brother can complete tutoring for any S1-S3 concept
- [ ] Learning outcomes: Brother's exam scores improve

### Tech Stack
- Curriculum JSON (expanded)
- Claude Opus (complex concept explanation)
- Parent dashboard (UI from Lovable or manual)

### Owner
- Curriculum: Dion + Claude (content research)
- Dashboard: Lovable or manual build
- Integration: Dion

---

## Phase 4: IB Mathematics HL MVP (Weeks 13-16)
**Goal:** Prove modular architecture (reuse engines for new subject)

### Deliverables
- [ ] IB Mathematics HL curriculum JSON (core topics)
- [ ] Diagnostic questions (first 3-4 units)
- [ ] Voice tutor system prompt (math-specific)
- [ ] Integration with existing Diagnostic + Tutor engines
- [ ] First student using math tutor

### Timeline
- Week 13: IB Math curriculum JSON + diagnostic questions
- Week 14: Integrate with existing system (should be <1 day if architecture is good)
- Week 15: Tutor system prompt tweaking for math
- Week 16: Testing + iteration

### Success Criteria
- [ ] "All we changed was the JSON and it worked" (proves modularity)
- [ ] First math student completes diagnostic + tutoring session
- [ ] Tutor explains math concepts clearly (different from chemistry teaching style)
- [ ] Development time < 1 week (2x faster than chemistry)

### Tech Stack
- Same engines as Chemistry (Diagnostic, Tutor, Voice I/O)
- New curriculum JSON (IB Math)
- Claude Sonnet (math-specific prompting)

### Owner
- Curriculum: Dion + Claude
- Integration: Dion (should be minimal if architecture is modular)

---

## Phase 5: IB Economics + IB Business (Weeks 17-20)
**Goal:** Expand full IB curriculum

### Deliverables
- [ ] IB Economics HL curriculum JSON
- [ ] IB Business Management HL curriculum JSON
- [ ] Diagnostic questions for each
- [ ] Voice tutor prompts for each
- [ ] 3-5 students using platform (mix of subjects)

### Timeline
- Week 17: Economics curriculum + diagnostic
- Week 18: Business curriculum + diagnostic
- Week 19-20: Integration + testing

### Success Criteria
- [ ] Users can switch between Chemistry, Math, Economics, Business seamlessly
- [ ] Tutor adapts teaching style per subject
- [ ] First real user signups (beyond Cristian's circle)
- [ ] Development time per subject: 2-3 days (modularity paying off)

### Tech Stack
- Same engines
- 2 new curriculum JSONs
- Subject-specific prompts

### Owner
- Curriculum: Dion + Claude + community research
- Development: Dion (minimal, engines are solid)

---

## Phase 6: AP Subjects (Months 5-6)
**Goal:** Attack massive US market (2M+ AP test-takers annually)

### Deliverables
- [ ] AP Calculus AB/BC curriculum JSON
- [ ] AP Physics 1/2 curriculum JSON
- [ ] AP Chemistry curriculum JSON
- [ ] AP Statistics curriculum JSON
- [ ] Diagnostic + voice tutor for each
- [ ] Marketing plan for AP students

### Timeline
- Month 5: 2 AP subjects + curriculum
- Month 6: 2 more AP subjects + full integration

### Success Criteria
- [ ] 100+ signups in first month (AP community is large)
- [ ] NPS > 50 (word of mouth drives growth)
- [ ] First institutional inquiry (tutoring center, homeschool co-op)
- [ ] Monthly recurring revenue reaches $5K+

### Tech Stack
- Same modular engines
- 4 new curriculum JSONs
- AP-specific tutor prompts

### Owner
- Curriculum sourcing: Dion + Claude + community
- Marketing: Cristian (Instagram content starts here)

---

## Phase 7: Scale + Institutional (Months 7-12)
**Goal:** Build $1M+ ARR business with institutional partnerships

### Deliverables
- [ ] General secondary curriculum (non-IB, non-AP)
- [ ] Institutional dashboard (teacher/admin view)
- [ ] Learning outcomes data (proof of effectiveness)
- [ ] Case studies (students improved X% on exams)
- [ ] First tutoring center partnership
- [ ] First school district pilot

### Timeline
- Months 7-9: Build institutional features + 10+ case studies
- Months 10-11: Sales cycle with first customers
- Month 12: Contracts signed, revenue flowing

### Success Criteria
- [ ] 5,000+ active users
- [ ] $100K+ MRR ($1.2M ARR)
- [ ] 3+ institutional customers (tutoring centers, schools)
- [ ] Learning outcomes: "Students using EducAI improved 25% on final exams" (statistically significant)
- [ ] Second funding round interest (VCs asking questions)

### Tech Stack
- All previous phases + scaling infrastructure
- Institutional dashboard
- Analytics/reporting engine
- Multi-tenant support (for schools)

### Owner
- Curriculum: Sourcing/partnerships
- Institutional features: Dion + team
- Sales: Cristian (personal brand + sales ops)
- Operations: New team member (community support)

---

## Resource Allocation

| Phase | Dion Hours | Claude Hours | Cristian Hours | Cost |
|-------|-----------|--------------|----------------|------|
| 1 | 40 | 10 | 20 | $1K (APIs) |
| 2 | 60 | 20 | 10 | $5K (APIs) |
| 3 | 80 | 40 | 30 | $8K (research) |
| 4 | 20 | 10 | 5 | $2K (APIs) |
| 5 | 15 | 5 | 5 | $2K (APIs) |
| 6 | 30 | 15 | 20 | $3K + marketing budget |
| 7 | 60 | 10 | 80 | $5K + infrastructure |
| **TOTAL** | **305** | **110** | **170** | **$26K** |

---

## Monthly Milestones

```
Feb 2026:
  [████████████████░░] Phase 1: 80% complete
  Brother testing diagnostic

Mar 2026:
  [████████████████████] Phase 1: DONE
  [██████████░░░░░░░░░░] Phase 2: 50% complete
  Voice tutor prototype testing

Apr 2026:
  [████████████████████] Phase 2: DONE
  [████████████░░░░░░░░] Phase 3: 60% complete
  Full IB Chemistry being built

May 2026:
  [████████████████████] Phase 3: DONE
  [████████████████░░░░] Phase 4: 80% complete
  IB Math integration

Jun 2026:
  [████████████████████] Phase 4: DONE
  [██████████░░░░░░░░░░] Phase 5: 50% complete
  Economics + Business

Jul 2026:
  [████████████████████] Phase 5: DONE
  [████████░░░░░░░░░░░░] Phase 6: 40% complete
  AP Calculus + Physics started

Aug 2026:
  [██████████████░░░░░░] Phase 6: 70% complete
  AP Statistics finishing

Sep 2026:
  [████████████████████] Phase 6: DONE
  [████░░░░░░░░░░░░░░░░] Phase 7: 20% complete
  Institutional partnerships starting

Dec 2026:
  [████████████████████] Phase 7: DONE
  Series A ready. $1M+ ARR. Global platform.
```

---

## Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| Brother doesn't like it | Iterate UX, don't move forward until he finds it useful |
| Voice is too expensive at scale | Have fallback to text; optimize prompts for shorter responses |
| Curriculum is hard to build | Use Claude to generate first drafts; community helps iterate |
| Can't get institutional customers | Start with tutoring centers (easier than schools); build case studies first |
| Competitors add voice | Our moat is curriculum depth + misconception handling, not voice alone |
| Market doesn't care about IB | Phase 6 (AP) + Phase 7 (general) covers 10B+ TAM |

---

## Success Looks Like

**By end of Phase 7 (Dec 2026):**

- ✅ 5,000+ active users (students + parents)
- ✅ $100K+ monthly recurring revenue
- ✅ Cristian's Instagram: 50K+ followers ("Building the world's best AI tutor")
- ✅ Learning outcomes: "Students improve 25% on exams on average"
- ✅ 3+ institutional customers (tutoring centers, homeschool co-ops)
- ✅ Venture capital interest (Series A conversations)
- ✅ Brother's chemistry grades: A or better (proof of concept)
- ✅ Team: Dion + 2-3 contractors (content, support)
- ✅ Global brand recognition in homeschool + AP communities

---

## Funding Path (Optional)

If you decide to raise capital:

**Seed round (now, $500K-1M):**
- Finish Phase 3 (complete IB Chemistry)
- Hire 1 engineer + 1 content person
- Marketing: Instagram growth + content strategy

**Series A (Month 6, $2-5M):**
- Finish Phase 6 (AP subjects live)
- Sales team for institutional deals
- Expand to 10 subjects

**Series B (Month 12+, $10M+):**
- Global expansion (EU, Asia)
- More subjects (languages, fine arts)
- Build the $1B+ company

---

## Next Action

**This week:**
1. Lovable generates UI (landing, dashboard, diagnostic, results)
2. Dion integrates with Supabase
3. Brother tests Phase 1 MVP
4. Get feedback: "Was this helpful?"

If yes → move to Phase 2 (voice).
If no → iterate until it is.
