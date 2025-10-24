import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import OperationCard from "./components/OperationCard";
import SettingsModal from "./components/SettingsModal";
import SessionSummary from "./components/SessionSummary";
import LanguageSelector from "./components/LanguageSelector";
import {
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  getTranslations,
  translations,
} from "./i18n";
import { calculateAggregateStats, formatDuration } from "./utils/stats";

const LANGUAGE_KEY = "mathcards_language";
const STATS_KEY = "mathcards_stats";

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
  const [lastResult, setLastResult] = useState(null);
  const [language, setLanguage] = useState(() => {
    if (typeof window === "undefined") return DEFAULT_LANGUAGE;
    return localStorage.getItem(LANGUAGE_KEY) || DEFAULT_LANGUAGE;
  });
  const [stats, setStats] = useState(() => {
    if (typeof window === "undefined") return { sessions: [] };
    try {
      const stored = localStorage.getItem(STATS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed?.sessions)) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn("Unable to parse stored stats", err);
    }
    return { sessions: [] };
  });
  const [statsErrorKey, setStatsErrorKey] = useState(null);
  const sessionStartRef = useRef(null);

  const t = useMemo(() => getTranslations(language), [language]);
  const durationFormatter = t?.common?.formatDuration;

  const statsSummary = useMemo(() => {
    const aggregate = calculateAggregateStats(stats?.sessions);
    return {
      ...aggregate,
      averageDurationFormatted:
        aggregate.averageDurationSeconds != null
          ? formatDuration(aggregate.averageDurationSeconds, durationFormatter)
          : null,
      bestDurationFormatted:
        aggregate.bestDurationSeconds != null
          ? formatDuration(aggregate.bestDurationSeconds, durationFormatter)
          : null,
      lastDurationFormatted:
        aggregate.lastDurationSeconds != null
          ? formatDuration(aggregate.lastDurationSeconds, durationFormatter)
          : null,
    };
  }, [durationFormatter, stats?.sessions]);

  const languageOptions = useMemo(
    () =>
      SUPPORTED_LANGUAGES.map((code) => ({
        value: code,
        label:
          t.languageNames?.[code] || translations[code]?.languageName || code,
      })),
    [t]
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(LANGUAGE_KEY, language);
    }
  }, [language]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    }
  }, [stats]);

  const recordSession = (sessionResults, totalOperations) => {
    if (!sessionResults?.length || !settings) return;
    const correctCount = sessionResults.filter((result) =>
      typeof result === "boolean" ? result : Boolean(result?.correct)
    ).length;
    const duration = sessionStartRef.current
      ? Date.now() - sessionStartRef.current
      : null;
    const entry = {
      id: sessionId,
      timestamp: new Date().toISOString(),
      settings,
      total: totalOperations || sessionResults.length,
      correct: correctCount,
      wrong: sessionResults.length - correctCount,
      percentage: sessionResults.length
        ? Math.round((correctCount / sessionResults.length) * 100)
        : 0,
      results: sessionResults,
      durationMs: typeof duration === "number" && duration >= 0 ? duration : null,
    };

    setStats((prev) => {
      const sessions = Array.isArray(prev?.sessions) ? prev.sessions : [];
      return {
        sessions: [...sessions, entry],
      };
    });
    sessionStartRef.current = null;
  };

  const startSession = async (userSettings) => {
    try {
      setIsLoading(true);
      setError(null);
      setStatsErrorKey(null);
      const res = await axios.post("/api/start", userSettings);
      setSettings(userSettings);
      setSessionId(res.data.session_id);
      setTotal(res.data.total);
      setResults([]);
      setFinished(false);
      setIndex(0);
      setLastResult(null);
      sessionStartRef.current = Date.now();
      await getNext(res.data.session_id);
    } catch (err) {
      setError(t.errors.startSession);
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
      if (Array.isArray(res.data.results)) {
        setResults(res.data.results);
      }
      if (res.data.last_result) {
        setLastResult(res.data.last_result);
      } else {
        setLastResult(null);
      }
      if (res.data.finished) {
        setFinished(true);
        recordSession(res.data.results, res.data.total);
      } else {
        setOperation(res.data.operation);
        setIndex(res.data.index);
        setTotal(res.data.total);
        setFinished(false);
      }
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(detail || t.errors.nextOperation);
    } finally {
      setIsLoading(false);
    }
  };

  const submit = async (answer) => {
    if (!sessionId) return;
    try {
      setIsLoading(true);
      const res = await axios.post(`/api/answer/${sessionId}`, { answer });
      if (Array.isArray(res.data.results)) {
        setResults(res.data.results);
      }
      if (res.data.last_result) {
        setLastResult(res.data.last_result);
      } else {
        setLastResult(null);
      }
      if (res.data.finished) {
        setFinished(true);
        recordSession(res.data.results, res.data.total);
      } else {
        setOperation(res.data.operation);
        setIndex(res.data.index);
        setTotal(res.data.total);
      }
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(detail || t.errors.submitAnswer);
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
    setLastResult(null);
    sessionStartRef.current = null;
  };

  const handleDownloadStats = () => {
    const data = JSON.stringify(stats, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "mathcards_stats.json";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const handleUploadStats = async (file) => {
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (!Array.isArray(parsed?.sessions)) {
        throw new Error("Invalid stats structure");
      }
      setStats({ sessions: parsed.sessions });
      setStatsErrorKey(null);
    } catch (err) {
      console.error("Failed to load stats", err);
      setStatsErrorKey("statsUpload");
    }
  };

  const helperMessage = useMemo(() => {
    if (!sessionId || !operation) return "";
    if (index <= Math.ceil(total / 3)) {
      return t.app.helperEarly;
    }
    if (index > (total * 2) / 3) {
      return t.app.helperLate;
    }
    return t.app.helperDefault;
  }, [index, operation, sessionId, t, total]);

  const commonLanguageSelectorProps = {
    language,
    onChange: setLanguage,
    options: languageOptions,
    label: t.languageLabel,
  };

  if (!sessionId)
    return (
      <SettingsModal
        onStart={startSession}
        isLoading={isLoading}
        error={error}
        languageSelector={
          <LanguageSelector
            {...commonLanguageSelectorProps}
            helperText={t.settingsModal.languageHelper}
          />
        }
        translations={t}
        stats={stats}
        statsSummary={statsSummary}
        language={language}
      />
    );
  if (finished)
    return (
      <SessionSummary
        results={results}
        onRestart={reset}
        settings={settings}
        translations={t}
        languageSelector={
          <LanguageSelector
            {...commonLanguageSelectorProps}
            className="items-center text-emerald-700"
          />
        }
        stats={stats}
        statsSummary={statsSummary}
        onDownloadStats={handleDownloadStats}
        onUploadStats={handleUploadStats}
        statsErrorKey={statsErrorKey}
        language={language}
      />
    );

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-100 via-rose-100 to-amber-100 px-6 py-10">
      <div className="absolute right-6 top-6 z-10">
        <LanguageSelector {...commonLanguageSelectorProps} />
      </div>
      <div className="pointer-events-none absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-pink-200 opacity-40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 -translate-x-1/2 translate-y-1/2 rounded-full bg-sky-200 opacity-40 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 right-0 h-56 w-56 translate-x-1/3 -translate-y-1/2 rounded-full bg-amber-200 opacity-30 blur-3xl" />

      <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm font-semibold uppercase tracking-wider text-sky-700">
            {t.app.headerBadge}
          </span>
          <h1 className="text-4xl font-black text-sky-900 sm:text-5xl">
            {t.app.headerTitle}
          </h1>
          <p className="max-w-xl text-lg text-sky-800">{t.app.headerDescription}</p>
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
            onSubmit={submit}
            helperMessage={helperMessage}
            isLoading={isLoading}
            results={results}
            lastResult={lastResult}
            translations={t}
          />
        )}
      </div>
    </div>
  );
}

