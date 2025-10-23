import React, { useMemo, useState } from "react";
import axios from "axios";
import OperationCard from "./components/OperationCard";
import SettingsModal from "./components/SettingsModal";
import SessionSummary from "./components/SessionSummary";

export default function App() {
  const [settings, setSettings] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [operation, setOperation] = useState(null);
  const [finished, setFinished] = useState(false);
  const [results, setResults] = useState([]);
  const [index, setIndex] = useState(0);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const startSession = async (userSettings) => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await axios.post("/api/start", userSettings);
      setSettings(userSettings);
      setSessionId(res.data.session_id);
      setTotal(res.data.total);
      setResults([]);
      setFinished(false);
      setIndex(0);
      await getNext(res.data.session_id);
    } catch (err) {
      setError("Ups, no pudimos iniciar la sesión. Inténtalo de nuevo.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getNext = async (id) => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await axios.get(`/api/next/${id}`);
      if (res.data.finished) {
        setFinished(true);
        setResults(res.data.results);
      } else {
        setOperation(res.data.operation);
        setIndex(res.data.index);
        setTotal(res.data.total);
        setFinished(false);
      }
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(detail || "No pudimos cargar la siguiente operación.");
    } finally {
      setIsLoading(false);
    }
  };

  const submit = async (correct) => {
    if (!sessionId) return;
    try {
      setIsLoading(true);
      const res = await axios.post(`/api/answer/${sessionId}`, { correct });
      if (res.data.finished) {
        setFinished(true);
        setResults(res.data.results);
      } else {
        setOperation(res.data.operation);
        setIndex(res.data.index);
        setTotal(res.data.total);
      }
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(detail || "No pudimos guardar tu respuesta. Intenta otra vez.");
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setSessionId(null);
    setOperation(null);
    setFinished(false);
    setResults([]);
    setIndex(0);
    setError(null);
  };

  const helperMessage = useMemo(() => {
    if (!sessionId || !operation) return "";
    if (index <= Math.ceil(total / 3)) {
      return "Respira profundo y piensa paso a paso.";
    }
    if (index > (total * 2) / 3) {
      return "¡Ya casi terminas!";
    }
    return "Suma o resta con calma, ¡tú puedes!";
  }, [index, operation, sessionId, total]);

  if (!sessionId)
    return <SettingsModal onStart={startSession} isLoading={isLoading} error={error} />;
  if (finished)
    return (
      <SessionSummary
        results={results}
        onRestart={reset}
        settings={settings}
      />
    );

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-100 via-rose-100 to-amber-100 px-6 py-10">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-pink-200 opacity-40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 -translate-x-1/2 translate-y-1/2 rounded-full bg-sky-200 opacity-40 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 right-0 h-56 w-56 translate-x-1/3 -translate-y-1/2 rounded-full bg-amber-200 opacity-30 blur-3xl" />

      <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm font-semibold uppercase tracking-wider text-sky-700">
            ¡Aprendamos jugando!
          </span>
          <h1 className="text-4xl font-black text-sky-900 sm:text-5xl">
            Práctica de Sumas y Restas
          </h1>
          <p className="max-w-xl text-lg text-sky-800">
            Resuelve cada reto, marca si lo hiciste bien y gana estrellas mientras avanzas.
          </p>
        </div>

        {error && (
          <div className="w-full max-w-xl rounded-2xl border-2 border-rose-300 bg-rose-50 px-4 py-3 text-base text-rose-700 shadow-md">
            {error}
          </div>
        )}

        {operation && (
          <OperationCard
            operation={operation}
            index={index}
            total={total}
            onCorrect={() => submit(true)}
            onIncorrect={() => submit(false)}
            helperMessage={helperMessage}
            isLoading={isLoading}
            results={results}
          />
        )}
      </div>
    </div>
  );
}

