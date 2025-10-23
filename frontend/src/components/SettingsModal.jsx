import React, { useState } from "react";

export default function SettingsModal({ onStart }) {
  const [mode, setMode] = useState("mix");
  const [difficulty, setDifficulty] = useState(1);
  const [count, setCount] = useState(10);

  const start = () => {
    onStart({
      mode,
      difficulty: parseInt(difficulty),
      total_operations: parseInt(count),
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-blue-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-80 text-center">
        <h1 className="text-2xl font-bold mb-4">Configuración</h1>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Modo</label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="border rounded-md p-2 w-full"
          >
            <option value="sum">Solo sumas</option>
            <option value="sub">Solo restas</option>
            <option value="mix">Mixto</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Dificultad</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="border rounded-md p-2 w-full"
          >
            <option value="1">1 cifra</option>
            <option value="2">2 cifras (1 + 2)</option>
            <option value="3">2 cifras (2 + 2)</option>
            <option value="4">3 y 2 cifras</option>
            <option value="5">3 cifras</option>
            <option value="6">4 y 3 cifras</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-semibold">Número de operaciones</label>
          <select
            value={count}
            onChange={(e) => setCount(e.target.value)}
            className="border rounded-md p-2 w-full"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
            <option value="40">40</option>
            <option value="50">50</option>
          </select>
        </div>

        <button
          onClick={start}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md w-full font-semibold"
        >
          Iniciar sesión
        </button>
      </div>
    </div>
  );
}

