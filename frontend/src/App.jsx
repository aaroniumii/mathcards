import React, { useState } from "react";
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

  const startSession = async (userSettings) => {
    const res = await axios.post("/api/start", userSettings);
    setSettings(userSettings);
    setSessionId(res.data.session_id);
    setTotal(res.data.total);
    getNext(res.data.session_id);
  };

  const getNext = async (id) => {
    const res = await axios.get(`/api/next/${id}`);
    if (res.data.finished) {
      setFinished(true);
      setResults(res.data.results);
    } else {
      setOperation(res.data.operation);
      setIndex(res.data.index);
      setFinished(false);
    }
  };

  const submit = async (correct) => {
    const res = await axios.post(`/api/answer/${sessionId}`, { correct });
    if (res.data.finished) {
      setFinished(true);
      setResults(res.data.results);
    } else {
      setOperation(res.data.operation);
      setIndex(index + 1);
    }
  };

  const reset = () => {
    setSessionId(null);
    setOperation(null);
    setFinished(false);
    setResults([]);
    setIndex(0);
  };

  if (!sessionId) return <SettingsModal onStart={startSession} />;
  if (finished) return <SessionSummary results={results} onRestart={reset} />;

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Práctica de Sumas y Restas</h1>
      {operation && (
        <OperationCard
          operation={operation}
          index={index}
          total={total}
          onCorrect={() => submit(true)}
          onIncorrect={() => submit(false)}
        />
      )}
    </div>
  );
}

