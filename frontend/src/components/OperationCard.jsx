import React from "react";

export default function OperationCard({
  operation,
  index,
  total,
  onCorrect,
  onIncorrect,
  helperMessage,
  isLoading,
  results,
}) {
  const progress = total ? Math.min(100, Math.round((index / total) * 100)) : 0;
  const earnedStars = results.filter(Boolean).length;

  return (
    <div className="w-full max-w-xl rounded-[2.5rem] bg-white/90 p-8 shadow-2xl shadow-rose-200 backdrop-blur">
      <div className="flex items-center justify-between gap-3 rounded-3xl bg-sky-50 px-5 py-3 text-sky-700">
        <span className="text-sm font-semibold uppercase tracking-wide">
          Reto {index} de {total}
        </span>
        <div className="flex items-center gap-2 text-sm font-semibold">
          <span role="img" aria-hidden>⭐</span>
          {earnedStars} estrellas
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center gap-4 text-center text-sky-900">
        <span className="text-6xl font-black drop-shadow-sm">
          {operation.a} {operation.operator} {operation.b}
        </span>
        <div className="rounded-full bg-sky-100 px-5 py-2 text-lg font-semibold text-sky-700">
          ¿Lo resolviste bien?
        </div>
        {helperMessage && (
          <p className="max-w-sm text-base text-sky-600">{helperMessage}</p>
        )}
      </div>

      <div className="mt-6 h-3 w-full overflow-hidden rounded-full bg-sky-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-sky-400 via-purple-400 to-rose-400 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-2 text-sm font-semibold text-sky-600">
        Progreso: {progress}%
      </p>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
        <button
          type="button"
          disabled={isLoading}
          onClick={onCorrect}
          className="flex-1 rounded-2xl bg-gradient-to-r from-emerald-400 to-emerald-500 px-6 py-4 text-lg font-bold text-white shadow-lg transition-transform duration-200 hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-emerald-200 disabled:cursor-wait disabled:opacity-70"
        >
          <span role="img" aria-hidden className="mr-2">
            🎉
          </span>
          ¡Lo hice bien!
        </button>
        <button
          type="button"
          disabled={isLoading}
          onClick={onIncorrect}
          className="flex-1 rounded-2xl bg-gradient-to-r from-amber-400 to-rose-400 px-6 py-4 text-lg font-bold text-white shadow-lg transition-transform duration-200 hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-rose-200 disabled:cursor-wait disabled:opacity-70"
        >
          <span role="img" aria-hidden className="mr-2">
            🤔
          </span>
          Necesito practicar
        </button>
      </div>
    </div>
  );
}

