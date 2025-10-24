import React, { useEffect, useMemo, useRef, useState } from "react";

const isResultCorrect = (value) => {
  if (typeof value === "boolean") return value;
  if (value && typeof value === "object") return Boolean(value.correct);
  return false;
};

export default function OperationCard({
  operation,
  index,
  total,
  onSubmit,
  helperMessage,
  isLoading,
  results,
  lastResult,
  translations,
}) {
  const [answer, setAnswer] = useState("");
  const [inputError, setInputError] = useState("");
  const inputRef = useRef(null);

  const t = translations?.operationCard || {};

  const progress = total ? Math.min(100, Math.round((index / total) * 100)) : 0;
  const earnedStars = Array.isArray(results)
    ? results.reduce((count, value) => (isResultCorrect(value) ? count + 1 : count), 0)
    : 0;

  useEffect(() => {
    setAnswer("");
    setInputError("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [operation?.a, operation?.b, operation?.operator]);

  const feedbackMessage = useMemo(() => {
    if (!lastResult) return "";
    if (lastResult.correct) {
      return t?.feedback?.correct || "¡Respuesta correcta!";
    }
    const expected = lastResult.expected;
    if (t?.feedback?.incorrect) {
      return t.feedback.incorrect(expected);
    }
    return expected !== undefined
      ? `La respuesta correcta era ${expected}.`
      : "Vuelve a intentarlo.";
  }, [lastResult, t]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isLoading) return;

    const trimmed = answer.trim();
    if (!trimmed) {
      setInputError(t?.errors?.required || "Escribe tu respuesta antes de continuar.");
      return;
    }

    if (!/^[-+]?\d+$/.test(trimmed)) {
      setInputError(t?.errors?.invalid || "Introduce solo números enteros.");
      return;
    }

    setInputError("");
    const value = Number.parseInt(trimmed, 10);
    onSubmit?.(value);
  };

  return (
    <div className="w-full max-w-xl rounded-[2.5rem] bg-white/90 p-8 shadow-2xl shadow-rose-200 backdrop-blur">
      <div className="flex items-center justify-between gap-3 rounded-3xl bg-sky-50 px-5 py-3 text-sky-700">
        <span className="text-sm font-semibold uppercase tracking-wide">
          {t?.challengeLabel ? t.challengeLabel(index, total) : `${index} / ${total}`}
        </span>
        <div className="flex items-center gap-2 text-sm font-semibold">
          <span role="img" aria-hidden>
            ⭐
          </span>
          {t?.starsEarned ? t.starsEarned(earnedStars) : earnedStars}
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center gap-4 text-center text-sky-900">
        <span className="text-6xl font-black drop-shadow-sm">
          {operation.a} {operation.operator} {operation.b}
        </span>
        <div className="rounded-full bg-sky-100 px-5 py-2 text-lg font-semibold text-sky-700">
          {t?.question || "¿Cuál es el resultado?"}
        </div>
        {helperMessage && (
          <p className="max-w-sm text-base text-sky-600">{helperMessage}</p>
        )}
        {feedbackMessage && (
          <div className="w-full max-w-sm rounded-3xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 shadow-inner">
            {feedbackMessage}
          </div>
        )}
      </div>

      <div className="mt-6 h-3 w-full overflow-hidden rounded-full bg-sky-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-sky-400 via-purple-400 to-rose-400 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-2 text-sm font-semibold text-sky-600">
        {t?.progressLabel ? t.progressLabel(progress) : `${progress}%`}
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <label className="flex flex-col gap-2 text-left">
          <span className="text-sm font-semibold uppercase tracking-wide text-sky-600">
            {t?.answerLabel || "Tu respuesta"}
          </span>
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            disabled={isLoading}
            className="w-full rounded-2xl border-2 border-sky-200 bg-white px-5 py-3 text-lg font-semibold text-sky-900 shadow-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100 disabled:cursor-wait disabled:opacity-70"
            placeholder={t?.answerPlaceholder || "Escribe el resultado"}
          />
        </label>
        {inputError && (
          <p className="text-sm font-semibold text-rose-600">{inputError}</p>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-2xl bg-gradient-to-r from-emerald-400 to-sky-400 px-6 py-4 text-lg font-bold text-white shadow-lg transition-transform duration-200 hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-emerald-200 disabled:cursor-wait disabled:opacity-70"
        >
          <span role="img" aria-hidden className="mr-2">
            🚀
          </span>
          {t?.submitButton || "Comprobar respuesta"}
        </button>
      </form>
    </div>
  );
}

