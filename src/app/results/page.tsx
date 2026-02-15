'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { auth, db } from '@/lib/supabase-client'

interface DiagnosticResult {
  id: string
  overall_mastery: number
  mastery_profile: {
    concept_mastery: Record<string, number>
  }
  misconceptions_detected: string[]
}

const CONCEPT_NAMES: Record<string, string> = {
  'S1.1.1': 'Elements & Compounds Classification',
  'S1.1.2': 'Kinetic Molecular Theory',
  'S1.1.3': 'Temperature & Kinetic Energy',
}

const MISCONCEPTION_REMEDIATIONS: Record<string, string> = {
  'S1.1.1-M1':
    'Remember: Mixtures separate by PHYSICAL methods. Compounds require CHEMICAL breakdown.',
  'S1.1.1-M2':
    'An element is made of ONE type of atom. O₂ is an element with 2 atoms per molecule.',
  'S1.1.2-M2':
    'Early bubbles = dissolved air escaping. At 100°C, vigorous bubbles = water vapor.',
  'S1.1.2-M3':
    'During phase changes: Temperature stays constant. Energy goes to breaking bonds, not speed.',
  'S1.1.3-M1': 'Use KELVIN temperature for proportionality. Celsius doesnt work!',
}

export default function ResultsPage() {
  const router = useRouter()
  const [result, setResult] = useState<DiagnosticResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const loadResults = async () => {
      try {
        const { data: userData } = await auth.getCurrentUser()
        if (!userData.user) {
          router.push('/login')
          return
        }
        setUserId(userData.user.id)

        const { data } = await db.getLatestDiagnosticResult(
          userData.user.id,
          'S1.1'
        )
        if (data) {
          setResult(data)
        }
      } catch (err) {
        console.error('Failed to load results:', err)
      } finally {
        setLoading(false)
      }
    }

    loadResults()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <p className="text-slate-600 dark:text-slate-400">Loading...</p>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            No diagnostic results found
          </p>
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold inline-block"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const conceptMastery = result.mastery_profile.concept_mastery

  const getMasteryColor = (mastery: number) => {
    if (mastery >= 70) return 'bg-green-500'
    if (mastery >= 40) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getMasteryLabel = (mastery: number) => {
    if (mastery >= 70) return 'Strong'
    if (mastery >= 40) return 'Developing'
    return 'Needs Work'
  }

  const weakConcepts = Object.entries(conceptMastery)
    .filter(([_, mastery]) => mastery < 70)
    .sort(([_, a], [__, b]) => a - b)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Your Diagnostic Results 📊
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Structure 1.1 — Particulate Nature of Matter
          </p>
        </div>

        {/* Overall Score Card */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8 mb-8 text-center">
          <div className="mb-4">
            <div className="inline-block relative">
              <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 160 160">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-slate-200 dark:text-slate-700"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  strokeDasharray={`${result.overall_mastery * 4.4} 440`}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient
                    id="gradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#4f46e5" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div>
                  <div className="text-5xl font-bold text-indigo-600">
                    {result.overall_mastery}%
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Overall Mastery
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p className="text-slate-600 dark:text-slate-400 mt-8">
            Good start! You've shown understanding of the basics. Focus on the areas below to strengthen your knowledge.
          </p>
        </div>

        {/* Concept Breakdown */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            Mastery by Concept
          </h2>
          <div className="space-y-6">
            {Object.entries(conceptMastery).map(([conceptId, mastery]) => (
              <div key={conceptId}>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    {CONCEPT_NAMES[conceptId] || conceptId}
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-indigo-600">
                      {mastery}%
                    </span>
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full text-white ${
                        mastery >= 70
                          ? 'bg-green-500'
                          : mastery >= 40
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                    >
                      {getMasteryLabel(mastery)}
                    </span>
                  </div>
                </div>
                <div className="w-full h-4 bg-slate-300 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${getMasteryColor(
                      mastery
                    )}`}
                    style={{ width: `${mastery}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Misconceptions */}
        {result.misconceptions_detected.length > 0 && (
          <div className="bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500 rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-orange-900 dark:text-orange-100 mb-6 flex items-center gap-2">
              <span>⚠️</span> Common Misconceptions Detected
            </h2>
            <div className="space-y-4">
              {result.misconceptions_detected.map((misconceptionId) => (
                <div
                  key={misconceptionId}
                  className="bg-white dark:bg-slate-800 p-4 rounded-lg"
                >
                  <p className="font-semibold text-orange-900 dark:text-orange-100 mb-2">
                    {misconceptionId}
                  </p>
                  <p className="text-orange-800 dark:text-orange-200">
                    {MISCONCEPTION_REMEDIATIONS[misconceptionId] ||
                      'Review your concept understanding.'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Focus Areas */}
        {weakConcepts.length > 0 && (
          <div className="bg-indigo-50 dark:bg-indigo-900/20 border-l-4 border-indigo-500 rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-indigo-900 dark:text-indigo-100 mb-6">
              Focus on These First
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-indigo-800 dark:text-indigo-200">
              {weakConcepts.map(([conceptId]) => (
                <li key={conceptId}>
                  {CONCEPT_NAMES[conceptId] || conceptId}
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-lg shadow-lg p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Learn with Your AI Tutor?
          </h2>
          <p className="text-indigo-100 mb-6 text-lg">
            Your tutor will focus on your weak areas and teach at your pace.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              disabled
              className="px-8 py-3 bg-white text-indigo-600 rounded-lg hover:bg-slate-100 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Start Tutoring Session (Coming Soon)
            </button>
            <Link
              href="/dashboard"
              className="px-8 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 font-semibold border border-white"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
