import { useState } from 'react'
import { Mic, CheckCircle, ChevronRight, RotateCcw, Star, Clock } from 'lucide-react'
import { dummyInterviewQuestions } from '../../utils/dummyData'
import { evaluateAnswer } from '../../utils/aiHelpers'
import toast from 'react-hot-toast'
import clsx from 'clsx'

const ROLES = ['Frontend Engineer', 'Backend Engineer', 'Full Stack Developer', 'Data Scientist', 'DevOps Engineer']

export default function MockInterview() {
  const [setup, setSetup] = useState({ role: 'Frontend Engineer', type: 'technical' })
  const [started, setStarted] = useState(false)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answer, setAnswer] = useState('')
  const [results, setResults] = useState([])
  const [evaluating, setEvaluating] = useState(false)
  const [evaluation, setEvaluation] = useState(null)
  const [history, setHistory] = useState([])

  const questions = dummyInterviewQuestions[setup.type]
  const current = questions[currentIdx]
  const isLast = currentIdx === questions.length - 1

  const handleStart = () => {
    setStarted(true)
    setCurrentIdx(0)
    setResults([])
    setAnswer('')
    setEvaluation(null)
  }

  const handleSubmit = async () => {
    if (!answer.trim()) { toast.error('Write your answer first'); return }
    setEvaluating(true)
    await new Promise(r => setTimeout(r, 1000))
    const result = evaluateAnswer(current.question, answer)
    setEvaluation(result)
    setResults(prev => [...prev, { question: current.question, answer, ...result }])
    setEvaluating(false)
  }

  const handleNext = () => {
    if (isLast) {
      // Save session
      const avg = Math.round(results.reduce((s, r) => s + r.score, 0) / results.length)
      setHistory(prev => [{
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        role: setup.role,
        type: setup.type,
        avgScore: avg,
        questions: results.length,
      }, ...prev.slice(0, 4)])
      setStarted(false)
      toast.success(`Session complete! Average score: ${avg}/10 🎉`)
    } else {
      setCurrentIdx(prev => prev + 1)
      setAnswer('')
      setEvaluation(null)
    }
  }

  const ScoreStars = ({ score }) => (
    <div className="flex gap-0.5">
      {[...Array(10)].map((_, i) => (
        <Star key={i} size={14}
          className={i < score ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 dark:text-gray-700'} />
      ))}
    </div>
  )

  if (!started) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="font-display text-2xl font-700 text-gray-900 dark:text-white">Mock Interview</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Practice real interview questions and get AI feedback on your answers.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-5">
          <div className="card p-6 space-y-5">
            <h2 className="font-semibold text-gray-900 dark:text-white">Configure your session</h2>

            <div>
              <label className="label">Target Role</label>
              <select className="input" value={setup.role} onChange={e => setSetup({ ...setup, role: e.target.value })}>
                {ROLES.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>

            <div>
              <label className="label">Interview Type</label>
              <div className="grid grid-cols-2 gap-3">
                {['technical', 'hr'].map(type => (
                  <button key={type} onClick={() => setSetup({ ...setup, type })}
                    className={clsx('p-4 rounded-xl border-2 text-center transition-all',
                      setup.type === type
                        ? 'border-brand-400 bg-brand-50 dark:bg-brand-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300')}>
                    <p className="text-2xl mb-1">{type === 'technical' ? '💻' : '🤝'}</p>
                    <p className="font-medium text-sm text-gray-800 dark:text-gray-100 capitalize">{type}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {type === 'technical' ? 'Coding & system design' : 'Behavioral & culture fit'}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-sm text-gray-500 dark:text-gray-400">
              📋 {questions.length} questions · ~{questions.length * 3} minutes · AI scoring on each answer
            </div>

            <button onClick={handleStart} className="btn-primary w-full justify-center">
              <Mic size={16} /> Start Interview Session
            </button>
          </div>

          {/* History */}
          <div className="space-y-4">
            <h2 className="font-semibold text-gray-900 dark:text-white text-sm">Previous Sessions</h2>
            {history.length === 0 ? (
              <div className="card p-6 text-center text-gray-400 text-sm">
                No sessions yet. Complete your first interview to see results here.
              </div>
            ) : (
              history.map(h => (
                <div key={h.id} className="card p-4 flex items-center gap-4">
                  <div className={clsx('w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold',
                    h.avgScore >= 8 ? 'bg-green-50 dark:bg-green-900/20' : h.avgScore >= 6 ? 'bg-yellow-50 dark:bg-yellow-900/20' : 'bg-red-50 dark:bg-red-900/20')}>
                    {h.avgScore >= 8 ? '🌟' : h.avgScore >= 6 ? '👍' : '💪'}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm text-gray-800 dark:text-gray-100">{h.role}</p>
                    <p className="text-xs text-gray-400">{h.date} · {h.type} · {h.questions} questions</p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-lg font-700 text-gray-900 dark:text-white">{h.avgScore}<span className="text-sm text-gray-400">/10</span></p>
                    <p className="text-xs text-gray-400">avg score</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5 animate-fade-in max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-700 text-gray-900 dark:text-white">Mock Interview</h1>
          <p className="text-gray-500 text-sm">{setup.role} · {setup.type} · Question {currentIdx + 1} of {questions.length}</p>
        </div>
        <button onClick={() => { setStarted(false); toast('Session ended') }} className="btn-ghost text-sm">
          <RotateCcw size={14} /> Exit
        </button>
      </div>

      {/* Progress */}
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${((currentIdx + (evaluation ? 1 : 0)) / questions.length) * 100}%` }} />
      </div>

      {/* Question */}
      <div className="card p-6 space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold text-brand-500">{currentIdx + 1}</span>
          </div>
          <p className="text-gray-800 dark:text-gray-100 font-medium leading-relaxed">{current.question}</p>
        </div>

        <div>
          <label className="label">Your Answer</label>
          <textarea
            className="input min-h-[140px] resize-none"
            placeholder="Type your answer here... Be detailed and use the STAR method where applicable (Situation, Task, Action, Result)"
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            disabled={!!evaluation}
          />
          <p className="text-xs text-gray-400 mt-1">{answer.split(/\s+/).filter(Boolean).length} words</p>
        </div>

        {!evaluation ? (
          <button onClick={handleSubmit} disabled={evaluating || !answer.trim()} className="btn-primary">
            {evaluating ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Evaluating...
              </span>
            ) : 'Submit Answer'}
          </button>
        ) : (
          <div className="space-y-4">
            {/* Score */}
            <div className={clsx('rounded-xl p-4 space-y-2',
              evaluation.score >= 8 ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
              : evaluation.score >= 6 ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'
              : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800')}>
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm text-gray-800 dark:text-gray-100">Score</span>
                <span className="font-display text-2xl font-700 text-gray-900 dark:text-white">
                  {evaluation.score}<span className="text-sm text-gray-400">/10</span>
                </span>
              </div>
              <ScoreStars score={evaluation.score} />
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{evaluation.feedback}</p>
            </div>

            <button onClick={handleNext} className="btn-primary">
              {isLast ? '🎉 View Results' : <><ChevronRight size={16} /> Next Question</>}
            </button>
          </div>
        )}
      </div>

      {/* Progress sidebar */}
      {results.length > 0 && (
        <div className="card p-4 space-y-2">
          <p className="text-xs font-medium text-gray-500">Questions answered</p>
          <div className="flex gap-2 flex-wrap">
            {results.map((r, i) => (
              <div key={i} className={clsx('w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white',
                r.score >= 8 ? 'bg-green-500' : r.score >= 6 ? 'bg-yellow-500' : 'bg-red-500')}>
                {r.score}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
