'use client';

// PDF Viewer has been deprecated - content is now delivered through interactive modules
// This component is kept for backward compatibility but redirects to ModuleViewer

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface PDFViewerProps {
  pdfPath: string;
  title?: string;
  courseId?: string;
  moduleId?: string;
}

export default function PDFViewer({ pdfPath, title, courseId, moduleId }: PDFViewerProps) {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the interactive module if course/module IDs are provided
    if (courseId && moduleId) {
      router.push(`/courses/${courseId}/${moduleId}`);
    }
  }, [courseId, moduleId, router]);

  return (
    <div className="w-full h-full flex flex-col bg-gray-950 rounded-xl overflow-hidden border border-gray-800 p-8">
      <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
        <span className="text-5xl">📚</span>
        <div>
          <p className="text-white font-medium mb-2">Interactive Learning Module</p>
          <p className="text-gray-400 text-sm mb-4 max-w-md">
            {title || 'This content is now delivered through interactive modules.'}
          </p>
          <p className="text-gray-500 text-xs">
            PDF Path (reference): {pdfPath}
          </p>
          {courseId && moduleId && (
            <button
              onClick={() => router.push(`/courses/${courseId}/${moduleId}`)}
              className="mt-4 inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
            >
              Launch Interactive Module →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
