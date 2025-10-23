import React from "react";

export default function SessionSummary({ results, onRestart }) {
  const total = results.length;
  const correct = results.filter((r) => r).length;
  const wrong = total - correct;
  const percentage = ((correct / total) * 100).toFixed(1);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
        <h1 className="text-3xl font-bold mb-4">Resumen de la sesión</h1>
        <p className="text-xl mb-2">✅ Correctas: {correct}</p>
        <p className="text-xl mb-2">❌ Incorrectas: {wrong}</p>
        <p className="text-2xl font-semibold mb-4">Puntaje: {percentage}%</p>
        <button
          onClick={onRestart}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-semibold"
        >
          Nueva sesión
        </button>
      </div>
    </div>
  );
}

