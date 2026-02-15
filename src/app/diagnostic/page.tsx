'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { auth, db } from '@/lib/supabase-client'
import diagnosticData from '@/data/diagnostic_S1.1.json'

interface Answer {
  questionId: string
  selectedOption: string
  isCorrect: boolean
  misconceptionId: string | null
}

export default function DiagnosticPage() {
  const router = useRouter()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [startTime] = useState(Date.now())

  const questions = diagnosticData.questions
  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await auth.getCurrentUser()
      if (!data.user) {
        router.push('/login')
        return
      }
      setUserId(data.user.id)
      setLoading(false)
    }
    checkAuth()
  }, [router])

  const handleSelectAnswer = (optionLetter: string) => {
    const selectedOption = currentQuestion.options.find(
      (opt) => opt.letter === optionLetter
    )
    if (!selectedOption) return

    const newAnswer: Answer = {
      questionId: currentQuestion.id,
      selectedOption: optionLetter,
      isCorrect: selectedOption.is_correct,
      misconceptionId: selectedOption.misconception_id,
    }

    setSelectedAnswer(optionLetter)
    setShowFeedback(true)
    setAnswers([...answers, newAnswer])
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
      setShowFeedback(false)
    } else {
      handleComplete()
    }
  }

  const handleComplete = async () => {
    if (!userId) return

    const timeTaken = Math.floor((Date.now() - startTime) / 1000)
    
    // Calculate mastery profile
    const masteryByQuestion = answers.reduce((acc, answer) => {
      const question = questions.find((q) => q.id === answer.questionId)
      if (!question) return acc

      const conceptId = question.concept_id
      const knowledgeSignals = question.knowledge_signals as any

      const currentMastery = acc[conceptId] || []
      const signal = answer.isCorrect
        ? knowledgeSignals.correct
        : knowledgeSignals[`incorrect_to_${answer.selectedOption}`] ||
          { concept_mastery: 0, confidence: 'low' }

      return {
        ...acc,
        [conceptId]: [...currentMastery, signal.concept_mastery],
      }
    }, {} as Record<string, number[]>)

    const conceptMastery = Object.entries(masteryByQuestion).reduce(
      (acc, [conceptId, scores]) => {
        const average = scores.reduce((a, b) => a + b, 0) / scores.length
        return { ...acc, [conceptId]: Math.round(average) }
      },
      {} as Record<string, number>
    )

    const overallMastery = Math.round(
      Object.values(conceptMastery).reduce((a, b) => a + b, 0) /
        Object.keys(conceptMastery).length
    )

    const misconceptionsDetected = answers
      .filter((a) => a.misconceptionId)
      .map((a) => a.misconceptionId as string)

    // Save to Supabase
    const { error } = await db.saveDiagnosticResult(
      userId,
      diagnosticData.subtopic_id,
      answers,
      { concept_mastery: conceptMastery, overall_mastery: overallMastery },
      misconceptionsDetected,
      overallMastery,
      timeTaken
    )

    if (error) {
      console.error('Failed to save diagnostic result:', error)
    }

    // Redirect to results
    router.push('/results')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <p className="text-slate-600 dark:text-slate-400">Loading...</p>
      </div>
    )
  }

  const selectedOptionObj = currentQuestion.options.find(
    (opt) => opt.letter === selectedAnswer
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            {diagnosticData.subtopic_name}
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {diagnosticData.description}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full h-2 bg-slate-300 dark:bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-indigo-600"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8 mb-8"
          >
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
              {currentQuestion.question_text}
            </h2>

            {/* Options */}
            <div className="space-y-4 mb-8">
              {currentQuestion.options.map((option) => {
                const isSelected = selectedAnswer === option.letter
                const isCorrectAnswer = option.is_correct
                const showCorrectness =
                  showFeedback && (isSelected || isCorrectAnswer)

                let bgColor = 'bg-white dark:bg-slate-700'
                let borderColor = 'border-slate-300 dark:border-slate-600'

                if (showFeedback && isSelected && isCorrectAnswer) {
                  bgColor = 'bg-green-50 dark:bg-green-900/20'
                  borderColor = 'border-green-500 dark:border-green-600'
                } else if (showFeedback && isSelected && !isCorrectAnswer) {
                  bgColor = 'bg-orange-50 dark:bg-orange-900/20'
                  borderColor = 'border-orange-500 dark:border-orange-600'
                } else if (isSelected) {
                  bgColor = 'bg-indigo-50 dark:bg-indigo-900/20'
                  borderColor = 'border-indigo-500 dark:border-indigo-600'
                }

                return (
                  <button
                    key={option.letter}
                    onClick={() => !showFeedback && handleSelectAnswer(option.letter)}
                    disabled={showFeedback}
                    className={`w-full text-left p-4 border-2 rounded-lg transition-all ${bgColor} ${borderColor} ${
                      !showFeedback ? 'cursor-pointer hover:border-indigo-500' : ''
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                            isSelected && isCorrectAnswer
                              ? 'bg-green-500 text-white'
                              : isSelected && !isCorrectAnswer
                              ? 'bg-orange-500 text-white'
                              : isSelected
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-300 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {option.letter}
                        </div>
                      </div>
                      <div className="flex-grow">
                        <p className="text-slate-900 dark:text-white font-semibold">
                          {option.text}
                        </p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Feedback */}
            <AnimatePresence>
              {showFeedback && selectedOptionObj && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`p-4 rounded-lg mb-8 ${
                    selectedOptionObj.is_correct
                      ? 'bg-green-100 dark:bg-green-900/30 border border-green-500'
                      : 'bg-orange-100 dark:bg-orange-900/30 border border-orange-500'
                  }`}
                >
                  <p
                    className={`font-semibold mb-2 ${
                      selectedOptionObj.is_correct
                        ? 'text-green-900 dark:text-green-100'
                        : 'text-orange-900 dark:text-orange-100'
                    }`}
                  >
                    {selectedOptionObj.is_correct ? '✓ Correct!' : '✗ Not quite'}
                  </p>
                  <p
                    className={
                      selectedOptionObj.is_correct
                        ? 'text-green-800 dark:text-green-200'
                        : 'text-orange-800 dark:text-orange-200'
                    }
                  >
                    {selectedOptionObj.feedback}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Next Button */}
            {showFeedback && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={handleNext}
                className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold transition-colors"
              >
                {currentQuestionIndex === questions.length - 1
                  ? 'See Results'
                  : 'Next Question'}
              </motion.button>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
