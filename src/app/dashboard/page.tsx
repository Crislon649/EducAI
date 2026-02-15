'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { auth, db } from '@/lib/supabase-client'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()
  const [displayName, setDisplayName] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data: userData } = await auth.getCurrentUser()
        if (!userData.user) {
          router.push('/login')
          return
        }

        const { data: profile } = await db.getStudentProfile(userData.user.id)
        if (profile) {
          setDisplayName(profile.display_name)
        }
      } catch (err) {
        console.error('Failed to load profile:', err)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [router])

  const handleLogout = async () => {
    await auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <p className="text-slate-600 dark:text-slate-400">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      {/* Navigation */}
      <nav className="bg-white dark:bg-slate-950 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">EducAI</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-slate-700 dark:text-slate-300 hover:text-indigo-600 font-semibold"
          >
            Log Out
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Welcome, {displayName || 'Student'}! 👋
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Ready to master IB Chemistry with AI-powered personalized learning?
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Take Diagnostic Card */}
          <Link href="/diagnostic">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-8 cursor-pointer hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">
                Take Diagnostic
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Find out where you stand. 5-minute assessment that identifies your knowledge gaps and learning style.
              </p>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold">
                Start Diagnostic →
              </button>
            </div>
          </Link>

          {/* Progress Card */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-8">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">
              Your Progress
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Track your mastery across topics and see your growth over time.
            </p>
            <button className="px-4 py-2 bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg cursor-not-allowed font-semibold">
              Coming Soon
            </button>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-100 mb-2">
            How EducAI Works
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-indigo-800 dark:text-indigo-200">
            <li>
              <strong>Diagnostic:</strong> We assess your current knowledge and learning gaps
            </li>
            <li>
              <strong>Profile:</strong> You get a personalized knowledge profile showing strengths and weaknesses
            </li>
            <li>
              <strong>Tutoring:</strong> AI tutoring sessions adapt to your pace and learning style
            </li>
            <li>
              <strong>Progress:</strong> Track your improvement and master IB Chemistry concepts
            </li>
          </ol>
        </div>
      </main>
    </div>
  )
}
