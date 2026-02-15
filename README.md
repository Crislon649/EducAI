# EducAI 🎓

AI-Powered Learning Platform for IB Chemistry and beyond.

## Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Crislon649/EducAI.git
cd EducAI
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

- `/src/app` - Next.js App Router pages and API routes
- `/src/components` - Reusable React components
- `/src/lib` - Utilities and helpers (Supabase client, etc.)
- `/public` - Static assets

## Tech Stack

- **Frontend:** Next.js 15, TypeScript, Tailwind CSS
- **Backend:** Supabase (PostgreSQL, Auth)
- **AI:** Claude API (Sonnet, Opus)
- **Hosting:** Vercel

## Development

### Build
```bash
npm run build
```

### Lint
```bash
npm run lint
```

## Deployment

Deployed on Vercel. Push to `main` branch to trigger automatic deployment.

## License

Proprietary - All rights reserved.

## Contact

For questions, contact Cristian Zapata.
