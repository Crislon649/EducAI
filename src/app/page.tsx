export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-6 py-4 bg-white dark:bg-slate-950 shadow-sm">
        <div className="text-2xl font-bold text-indigo-600">EducAI</div>
        <div className="flex gap-4">
          <button className="px-4 py-2 text-slate-700 dark:text-slate-300 hover:text-indigo-600">
            Login
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            Sign Up
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6 text-slate-900 dark:text-white">
          Personalized AI Tutoring
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
          Learn IB Chemistry with an AI tutor that adapts to your pace, identifies knowledge gaps, and helps you master concepts.
        </p>
        <button className="px-8 py-3 bg-indigo-600 text-white rounded-lg text-lg font-semibold hover:bg-indigo-700">
          Start Learning Free
        </button>
      </section>

      {/* Subject Browser - Skeleton */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold mb-12 text-center text-slate-900 dark:text-white">
          Available Subjects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Chemistry - Available */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">🧪</div>
            <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">
              IB Chemistry HL
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Master the IB Chemistry Higher Level curriculum
            </p>
            <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
              Start Diagnostic
            </button>
          </div>

          {/* Physics - Coming Soon */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 opacity-50">
            <div className="text-4xl mb-4 grayscale">⚛️</div>
            <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">
              IB Physics HL
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Coming soon...
            </p>
            <button className="w-full px-4 py-2 bg-slate-300 text-slate-500 rounded cursor-not-allowed">
              Coming Soon
            </button>
          </div>

          {/* Biology - Coming Soon */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 opacity-50">
            <div className="text-4xl mb-4 grayscale">🧬</div>
            <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">
              IB Biology HL
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Coming soon...
            </p>
            <button className="w-full px-4 py-2 bg-slate-300 text-slate-500 rounded cursor-not-allowed">
              Coming Soon
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8 mt-20">
        <div className="max-w-6xl mx-auto px-6 text-center text-slate-600 dark:text-slate-400">
          <p>© 2026 EducAI. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
