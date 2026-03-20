'use client';

import { useState } from 'react';
import { AssessmentFlow } from '@/components/quiz';
import { loadQuizBank, getQuizBankIds } from '@/lib/quiz';
import { AssessmentResult } from '@/types/quiz';

export default function QuizExamplePage() {
  const [selectedQuizId, setSelectedQuizId] = useState<string>('');
  const [completedResult, setCompletedResult] = useState<AssessmentResult | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);

  const availableQuizzes = getQuizBankIds();
  const selectedQuiz = selectedQuizId ? loadQuizBank(selectedQuizId) : null;

  const handleStart = () => {
    if (selectedQuiz) {
      setShowQuiz(true);
    }
  };

  const handleComplete = (result: AssessmentResult) => {
    setCompletedResult(result);
    setShowQuiz(false);
  };

  const handleAbandon = () => {
    setShowQuiz(false);
    setSelectedQuizId('');
  };

  if (completedResult) {
    return (
      <div className="min-h-screen bg-gray-950 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Quiz Complete!</h1>
            <p className="text-gray-400">You scored {completedResult.score}%</p>
          </div>
          
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">Result Summary</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-white">{completedResult.score}%</p>
                <p className="text-xs text-gray-500 uppercase">Score</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-white">
                  {completedResult.questionResults.filter(q => q.isCorrect).length}
                </p>
                <p className="text-xs text-gray-500 uppercase">Correct</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-white">
                  {completedResult.timeSpentMinutes.toFixed(1)}
                </p>
                <p className="text-xs text-gray-500 uppercase">Minutes</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                <p className={`text-2xl font-bold ${completedResult.passed ? 'text-green-400' : 'text-red-400'}`}>
                  {completedResult.passed ? 'PASS' : 'FAIL'}
                </p>
                <p className="text-xs text-gray-500 uppercase">Result</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                setCompletedResult(null);
                setShowQuiz(true);
              }}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors"
            >
              Retake Quiz
            </button>
            <button
              onClick={() => {
                setCompletedResult(null);
                setSelectedQuizId('');
              }}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition-colors"
            >
              Choose Different Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showQuiz && selectedQuiz) {
    return (
      <div className="min-h-screen bg-gray-950 py-8 px-4">
        <AssessmentFlow
          quizBank={selectedQuiz}
          onComplete={handleComplete}
          onAbandon={handleAbandon}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Quiz Engine Demo</h1>
          <p className="text-gray-400">Select a quiz to test the new assessment engine</p>
        </div>

        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <label className="block text-sm font-medium text-gray-400 mb-3">
            Available Quizzes ({availableQuizzes.length})
          </label>
          
          <select
            value={selectedQuizId}
            onChange={(e) => setSelectedQuizId(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none mb-6"
          >
            <option value="">Select a quiz...</option>
            {availableQuizzes.map((id) => {
              const quiz = loadQuizBank(id);
              return (
                <option key={id} value={id}>
                  {quiz?.title || id} ({quiz?.totalQuestions} questions)
                </option>
              );
            })}
          </select>

          {selectedQuiz && (
            <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-white mb-2">{selectedQuiz.title}</h3>
              <p className="text-sm text-gray-400 mb-4">{selectedQuiz.description}</p>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <span className="text-gray-500">Questions:</span>
                  <span className="text-white ml-2">{selectedQuiz.totalQuestions}</span>
                </div>
                <div>
                  <span className="text-gray-500">Passing:</span>
                  <span className="text-white ml-2">{selectedQuiz.passingScore}%</span>
                </div>
                <div>
                  <span className="text-gray-500">Type:</span>
                  <span className="text-white ml-2 capitalize">{selectedQuiz.assessmentType.replace('_', ' ')}</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleStart}
              disabled={!selectedQuiz}
              className="flex-1 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
            >
              Start Quiz
            </button>
          </div>
        </div>

        {/* Feature List */}
        <div className="mt-8 grid md:grid-cols-2 gap-4">
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <h3 className="font-semibold text-white mb-2">Question Types</h3>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>✓ Multiple Choice</li>
              <li>✓ Multi-Select</li>
              <li>✓ True/False</li>
              <li>✓ Matching</li>
              <li>✓ Fill-in-the-Blank</li>
              <li>✓ Scenario/Branching</li>
              <li>✓ Calculation</li>
            </ul>
          </div>
          
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <h3 className="font-semibold text-white mb-2">Features</h3>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>✓ 3-Level Hint System</li>
              <li>✓ Timer & Progress</li>
              <li>✓ Question Flagging</li>
              <li>✓ Detailed Analytics</li>
              <li>✓ Spaced Repetition</li>
              <li>✓ Result Breakdown</li>
              <li>✓ Recommendations</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
