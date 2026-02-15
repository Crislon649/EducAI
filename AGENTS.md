# AGENTS.md - EducAI Project

## Project Vision
EducAI is an AI-powered educational platform for IB Chemistry HL. Built with Next.js 15, Supabase, and Claude AI.

**Goal:** MVP with diagnostic + tutor for IB Chemistry HL Year 1 (Structure 1.1 initially)

## Team Model
- **Cristian (Founder)**: Product decisions, user testing with brother
- **Claude (Architect)**: System design, specs, prompt engineering
- **OpenClaw (Executor)**: Code, deployment, automation

## Tech Stack
- **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Backend:** Supabase (PostgreSQL), Next.js API Routes
- **AI:** Claude API (Sonnet for tutor, Opus for analysis)
- **Hosting:** Vercel
- **Version Control:** GitHub

## Project Structure
```
educai/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── layout.tsx    # Root layout
│   │   ├── page.tsx      # Landing page
│   │   ├── api/          # API routes
│   │   └── (subjects)/   # Subject routes
│   ├── components/       # React components
│   ├── lib/             # Utilities
│   │   ├── supabase.ts  # Supabase client
│   │   └── utils.ts     # Helpers
│   └── styles/          # Global styles
├── public/              # Static assets
├── .env.local          # Environment variables
├── tsconfig.json       # TypeScript config
├── tailwind.config.ts  # Tailwind config
└── package.json        # Dependencies
```

## Development Rules

### DO's
✅ Build features in feature branches (never commit to main)
✅ Test with real user feedback (brother) early and often
✅ Keep diagnostic SHORT (<15 min) and engaging
✅ Curriculum Engine before UI
✅ Git commits for every logical feature
✅ Use TypeScript strictly (noImplicitAny)
✅ Environment variables for all secrets

### DON'Ts
❌ Don't build marketplace, community, or future features yet
❌ Don't try institutional features before validating B2C
❌ Don't deploy directly to production without manual review
❌ Don't commit secrets or API keys
❌ Don't use unvetted third-party skills
❌ Don't over-design UI before backend works

## Token Optimization
- **Default model:** Haiku (for this project)
- **Complex tasks:** Sonnet when needed
- **Opus:** Only with explicit approval from Cristian
- **Ollama:** Heartbeats and status checks (free)

## Current Phase
**PHASE 0: Setup (Week 1)**
- [x] GitHub repo created
- [x] Supabase project initialized
- [x] Next.js 15 scaffold
- [x] Environment variables configured
- [ ] Deploy to Vercel
- [ ] Basic landing page
- [ ] Subject browser skeleton

## Roadmap
1. **Phase 0** (Weeks 1-2): Infrastructure + skeleton
2. **Phase 1** (Weeks 3-4): Landing page + subject browser + auth flow
3. **Phase 2** (Weeks 5-6): Diagnostic engine for Structure 1.1
4. **Phase 3** (Weeks 7-8): Tutor engine + student state model
5. **Phase 4** (Weeks 9-10): Full Chemistry HL curriculum
6. **Phase 5** (Weeks 11-14): Polish + first users (beta with brother)

## Important Notes
- First user: Cristian's brother (test with him from Week 1)
- Curriculum JSON is the competitive moat — invest heavily
- Privacy-by-design from the start (student data security)
- Monitor costs: $500/month budget for APIs
- Align with IB syllabus 2025 (first assessment May 2025)

## Communication
- GitHub Issues for specs and tracking
- Telegram for quick updates/decisions
- Claude for architecture decisions
- OpenClaw reports every 45-60 min during dev sessions
