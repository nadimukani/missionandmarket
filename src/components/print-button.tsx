'use client'

export function PrintButton() {
  return (
    <button type="button" onClick={() => window.print()} className="btn btn-solid min-h-11 cursor-pointer">
      Print / Save as PDF
    </button>
  )
}
