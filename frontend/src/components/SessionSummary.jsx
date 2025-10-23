import React from "react";

function getMessage(percentage) {
  if (percentage >= 90) return "¡Eres una estrella de las matemáticas!";
  if (percentage >= 70) return "¡Gran trabajo, sigue practicando!";
  if (percentage >= 40) return "Cada intento te hace más fuerte.";
  return "¡No te rindas! Mañana será aún mejor.";
}

export default function SessionSummary({ results, onRestart, settings }) {
  const total = results.length;
  const correct = results.filter(Boolean).length;
  const wrong = Math.max(0, total - correct);
  const percentage = total ? Math.round((correct / total) * 100) : 0;
  const message = getMessage(percentage);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-100 via-sky-100 to-rose-100 px-6 py-12">
      <div className="pointer-events-none absolute -top-32 right-10 h-80 w-80 rounded-full bg-emerald-200 opacity-40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 -translate-x-1/3 translate-y-1/3 rounded-full bg-sky-200 opacity-40 blur-3xl" />

      <div className="relative w-full max-w-3xl rounded-[2.5rem] bg-white/90 p-10 text-center shadow-2xl shadow-emerald-200 backdrop-blur">
        <h1 className="text-4xl font-black text-emerald-800">¡Sesión completada! 🎉</h1>
        <p className="mt-2 text-base text-emerald-700">
          {settings?.mode === "mix"
            ? "Hoy domaste sumas y restas como un verdadero explorador."
            : settings?.mode === "sum"
            ? "Las sumas ya no tienen secretos para ti."
            : "¡Las restas se rinden ante tus habilidades!"}
        </p>

        <div className="mt-8 grid gap-6 rounded-3xl bg-emerald-50 p-6 sm:grid-cols-3">
          <div className="rounded-2xl bg-white p-4 shadow">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">Correctas</p>
            <p className="mt-2 text-3xl font-black text-emerald-700">{correct}</p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow">
            <p className="text-sm font-semibold uppercase tracking-wide text-rose-500">Por mejorar</p>
            <p className="mt-2 text-3xl font-black text-rose-500">{wrong}</p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow">
            <p className="text-sm font-semibold uppercase tracking-wide text-sky-500">Tu puntaje</p>
            <p className="mt-2 text-4xl font-black text-sky-600">{percentage}%</p>
          </div>
        </div>

        <p className="mt-6 text-xl font-semibold text-emerald-700">{message}</p>

        <button
          onClick={onRestart}
          className="mt-8 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-400 to-sky-400 px-8 py-4 text-lg font-extrabold text-white shadow-xl transition-transform duration-200 hover:scale-[1.03] focus:outline-none focus:ring-4 focus:ring-emerald-200"
        >
          Jugar otra vez
        </button>
      </div>
    </div>
  );
}

