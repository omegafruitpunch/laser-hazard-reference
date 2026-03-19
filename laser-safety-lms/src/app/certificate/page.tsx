'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { courses } from '@/data/courses';
import { getCourseProgress, getUserName, setUserName } from '@/lib/progress';
import Link from 'next/link';
import { Download, Award, ChevronRight, User } from 'lucide-react';
import dynamic from 'next/dynamic';

const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then(m => m.PDFDownloadLink),
  { ssr: false }
);
import CertificateDocument from '@/components/certificate/CertificateDocument';

function CertificateContent() {
  const searchParams = useSearchParams();
  const preselectedCourseId = searchParams.get('courseId');

  const [name, setName] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [showNamePrompt, setShowNamePrompt] = useState(false);

  useEffect(() => {
    const saved = getUserName();
    if (saved) setName(saved);
    else setShowNamePrompt(true);
  }, []);

  const passedCourses = courses.filter(c => {
    const p = getCourseProgress(c.id);
    return p.quizPassed;
  });

  const handleSetName = () => {
    if (!nameInput.trim()) return;
    const trimmed = nameInput.trim();
    setUserName(trimmed);
    setName(trimmed);
    setShowNamePrompt(false);
  };

  if (showNamePrompt) {
    return (
      <div className="max-w-md mx-auto mt-20 text-center space-y-6">
        <div className="w-16 h-16 bg-yellow-500/20 border border-yellow-500/30 rounded-full flex items-center justify-center mx-auto">
          <User size={28} className="text-yellow-400" />
        </div>
        <div>
          <h2 className="text-white text-2xl font-bold mb-2">Your Name for Certificates</h2>
          <p className="text-gray-500 text-sm">This name will appear on all your certificates.</p>
        </div>
        <div className="space-y-3">
          <input
            type="text"
            value={nameInput}
            onChange={e => setNameInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSetName()}
            placeholder="Enter your full name"
            className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-yellow-500 transition-colors text-center text-lg"
            autoFocus
          />
          <button
            onClick={handleSetName}
            className="w-full py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-xl transition-colors"
          >
            Save Name
          </button>
        </div>
      </div>
    );
  }

  if (passedCourses.length === 0) {
    return (
      <div className="max-w-md mx-auto mt-20 text-center space-y-6">
        <div className="w-16 h-16 bg-gray-800 border border-gray-700 rounded-full flex items-center justify-center mx-auto">
          <Award size={28} className="text-gray-500" />
        </div>
        <div>
          <h2 className="text-white text-2xl font-bold mb-2">No Certificates Yet</h2>
          <p className="text-gray-500">Complete a course and pass the quiz to earn your first certificate.</p>
        </div>
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          Browse Courses
          <ChevronRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Certificates</h1>
          <p className="text-gray-500">{passedCourses.length} certificate{passedCourses.length !== 1 ? 's' : ''} earned · {name}</p>
        </div>
        <button
          onClick={() => { setShowNamePrompt(true); setNameInput(name); }}
          className="text-sm text-gray-500 hover:text-white transition-colors flex items-center gap-1"
        >
          <User size={13} />
          Change name
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {passedCourses.map(course => {
          const progress = getCourseProgress(course.id);
          const completedAt = progress.completedAt ?? new Date().toISOString();

          return (
            <div
              key={course.id}
              className={`relative overflow-hidden bg-gradient-to-br ${course.coverColor} rounded-2xl p-6`}
            >
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_50%,white,transparent_60%)]" />
              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-4xl">{course.icon}</span>
                  <div className="bg-white/20 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                    <Award size={12} className="text-white" />
                    <span className="text-white text-xs">Certified</span>
                  </div>
                </div>

                <p className="text-white/70 text-xs uppercase tracking-wider mb-1">{course.category}</p>
                <h3 className="text-white font-bold text-lg mb-1">{course.title}</h3>
                <p className="text-white/70 text-sm mb-1">{name}</p>
                {progress.quizScore !== undefined && (
                  <p className="text-white/60 text-xs mb-4">
                    Score: {progress.quizScore}/{getQuizLength(course.id)} · {new Date(completedAt).toLocaleDateString()}
                  </p>
                )}

                <Suspense fallback={
                  <button className="flex items-center gap-2 bg-white/20 text-white text-sm px-4 py-2 rounded-xl opacity-50 cursor-wait">
                    <Download size={14} />
                    Preparing...
                  </button>
                }>
                  <PDFDownloadLink
                    document={
                      <CertificateDocument
                        name={name}
                        courseTitle={course.title}
                        completedAt={completedAt}
                        score={progress.quizScore}
                        total={getQuizLength(course.id)}
                      />
                    }
                    fileName={`certificate-${course.id}-${name.replace(/\s+/g, '-').toLowerCase()}.pdf`}
                  >
                    {({ loading }) => (
                      <button className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-sm px-4 py-2 rounded-xl transition-colors">
                        <Download size={14} />
                        {loading ? 'Preparing...' : 'Download Certificate'}
                      </button>
                    )}
                  </PDFDownloadLink>
                </Suspense>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function getQuizLength(courseId: string): number {
  const lengths: Record<string, number> = {
    'course-1': 8, 'course-2': 8, 'course-3': 8, 'course-4': 10,
    'course-5': 6, 'course-6': 5, 'course-7': 6, 'course-8': 5,
  };
  return lengths[courseId] ?? 8;
}

export default function CertificatePage() {
  return (
    <Suspense fallback={<div className="text-gray-500 text-center mt-20">Loading...</div>}>
      <CertificateContent />
    </Suspense>
  );
}
