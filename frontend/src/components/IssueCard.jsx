import React from 'react'

const SEVERITY_STYLES = {
  CRITICAL: { bar: 'bg-danger', text: 'text-danger', label: 'CRITICAL' },
  HIGH: { bar: 'bg-danger/70', text: 'text-danger', label: 'HIGH' },
  MEDIUM: { bar: 'bg-warn', text: 'text-warn', label: 'MEDIUM' },
  LOW: { bar: 'bg-accent2', text: 'text-accent2', label: 'LOW' },
}

const CATEGORY_ICON = {
  BUG: '🐛', SECURITY: '🔐', PERFORMANCE: '⚡',
  CODE_SMELL: '🧹', MAINTAINABILITY: '📦', DOCUMENTATION: '📝',
}

export default function IssueCard({ issue }) {
  const sev = SEVERITY_STYLES[issue.severity] || SEVERITY_STYLES.LOW

  return (
    <div className="flex border border-line rounded-lg bg-panel overflow-hidden">
      <div className={`w-1.5 ${sev.bar}`} />
      <div className="flex-1 p-4">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
          <div className="flex items-center gap-2 font-display text-sm">
            <span>{CATEGORY_ICON[issue.category] || '•'}</span>
            <span className="text-muted">{issue.fileName}</span>
            {issue.lineNumber && <span className="text-muted">: line {issue.lineNumber}</span>}
          </div>
          <span className={`text-xs font-display font-bold px-2 py-0.5 rounded border border-line ${sev.text}`}>
            {sev.label}
          </span>
        </div>
        <p className="text-sm text-gray-200 mb-2">{issue.description}</p>
        {issue.suggestion && (
          <div className="text-sm bg-ink border border-line rounded p-3 mb-2">
            <span className="text-accent font-display text-xs">SUGGESTED FIX</span>
            <p className="text-gray-300 mt-1">{issue.suggestion}</p>
          </div>
        )}
        {issue.correctedCode && (
          <div className="text-sm bg-ink border border-line rounded p-3 mb-2">
            <span className="text-accent2 font-display text-xs">CORRECTED CODE</span>
            <pre className="text-gray-300 mt-1 overflow-x-auto font-mono text-xs whitespace-pre-wrap">{issue.correctedCode}</pre>
          </div>
        )}
        <div className="flex gap-4 text-xs text-muted font-display">
          {issue.complexity && <span>Complexity: {issue.complexity}</span>}
          {issue.confidence != null && <span>Confidence: {Math.round(issue.confidence * 100)}%</span>}
        </div>
      </div>
    </div>
  )
}
