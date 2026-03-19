'use client';

import { useState } from 'react';

interface PDFViewerProps {
  pdfPath: string;
  title?: string;
}

export default function PDFViewer({ pdfPath, title }: PDFViewerProps) {
  const [error, setError] = useState(false);

  return (
    <div className="w-full h-full flex flex-col bg-gray-950 rounded-xl overflow-hidden border border-gray-800">
      {title && (
        <div className="flex items-center justify-between px-4 py-2.5 bg-gray-900 border-b border-gray-800">
          <span className="text-sm text-gray-300 font-medium truncate">{title}</span>
          <a
            href={pdfPath}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-red-400 hover:text-red-300 transition-colors flex-shrink-0 ml-4"
          >
            Open in new tab ↗
          </a>
        </div>
      )}

      {error ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
          <span className="text-5xl">📄</span>
          <div>
            <p className="text-white font-medium mb-1">PDF Preview Unavailable</p>
            <p className="text-gray-500 text-sm mb-4">
              The PDF file hasn&apos;t been added to the docs folder yet.
            </p>
            <a
              href={pdfPath}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
            >
              Try Opening PDF ↗
            </a>
          </div>
        </div>
      ) : (
        <iframe
          src={pdfPath}
          className="flex-1 w-full"
          style={{ minHeight: '600px' }}
          title={title}
          onError={() => setError(true)}
        />
      )}
    </div>
  );
}
