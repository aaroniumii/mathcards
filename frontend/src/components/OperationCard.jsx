import React from "react";

export default function OperationCard({ operation, index, total, onCorrect, onIncorrect }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
      <h2 className="text-2xl font-semibold mb-4">
        Operación {index} de {total}
      </h2>
      <div className="text-5xl font-bold mb-8">
        {operation.a} {operation.operator} {operation.b} = ?
      </div>
      <div className="flex justify-center gap-6">
        <button
          onClick={onCorrect}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold"
        >
          ✅ Correcto
        </button>
        <button
          onClick={onIncorrect}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold"
        >
          ❌ Incorrecto
        </button>
      </div>
    </div>
  );
}

