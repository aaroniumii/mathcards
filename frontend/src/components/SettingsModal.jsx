import React, { useMemo, useState } from "react";
import { calculateAggregateStats, formatDuration } from "../utils/stats";

const COUNT_OPTIONS = [10, 15, 20, 30, 40, 50];

export default function SettingsModal({
  onStart,
  isLoading,
  error,
  languageSelector,
  translations,
  stats,
  statsSummary,
  language,
}) {
  const [mode, setMode] = useState("mix");
  const [difficulty, setDifficulty] = useState(1);
  const [count, setCount] = useState(10);

  const t = translations?.settingsModal;
  const modeOptions = useMemo(
    () => [
      { value: "sum", label: t?.modeOptions?.sum, emoji: "➕" },
      { value: "sub", label: t?.modeOptions?.sub, emoji: "➖" },
      { value: "mix", label: t?.modeOptions?.mix, emoji: "🔀" },
    ],
    [t]
  );

  const start = () => {
    onStart({
      mode,
      difficulty: parseInt(difficulty),
      total_operations: parseInt(count),
    });
  };

  const sessions = Array.isArray(stats?.sessions) ? stats.sessions : [];
  const computedSummary = useMemo(() => {
    if (statsSummary) return statsSummary;
    const aggregate = calculateAggregateStats(sessions);
    const formatter = translations?.common?.formatDuration;
    return {
      ...aggregate,
      averageDurationFormatted:
        aggregate.averageDurationSeconds != null
          ? formatDuration(aggregate.averageDurationSeconds, formatter)
          : null,
      bestDurationFormatted:
        aggregate.bestDurationSeconds != null
          ? formatDuration(aggregate.bestDurationSeconds, formatter)
          : null,
      lastDurationFormatted:
        aggregate.lastDurationSeconds != null
          ? formatDuration(aggregate.lastDurationSeconds, formatter)
          : null,
    };
  }, [sessions, statsSummary, translations?.common?.formatDuration]);

  const totalSessions = computedSummary?.totalSessions ?? sessions.length;
  const averageScore = computedSummary?.averageScore ?? null;
  const bestScore = computedSummary?.bestScore ?? null;
  const lastSession = computedSummary?.lastSession || sessions[totalSessions - 1];
  const lastScore =
    typeof lastSession?.percentage === "number" ? lastSession.percentage : null;
  const averageDuration = computedSummary?.averageDurationFormatted || null;
  const lastDuration = computedSummary?.lastDurationFormatted || null;
  const formattedLastSession = useMemo(() => {
    if (!lastSession?.timestamp) return null;
    try {
      return new Intl.DateTimeFormat(language || "es", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(lastSession.timestamp));
    } catch (err) {
      return new Date(lastSession.timestamp).toLocaleString();
    }
  }, [language, lastSession?.timestamp]);

  const statsPreviewLines = useMemo(() => {
    if (!t) return [];
    const lines = [];
    if (totalSessions)
      lines.push(
        t.statsPreviewSessions
          ? t.statsPreviewSessions(totalSessions)
          : `${totalSessions}`
      );
    if (typeof averageScore === "number") {
      lines.push(
        t.statsPreviewAverageScore
          ? t.statsPreviewAverageScore(averageScore)
          : `${averageScore}%`
      );
    }
    if (typeof bestScore === "number") {
      lines.push(
        t.statsPreviewBestScore
          ? t.statsPreviewBestScore(bestScore)
          : `${bestScore}%`
      );
    }
    if (averageDuration) {
      lines.push(
        t.statsPreviewAverageDuration
          ? t.statsPreviewAverageDuration(averageDuration)
          : averageDuration
      );
    }
    if (typeof lastScore === "number") {
      lines.push(
        t.statsPreviewLastScore
          ? t.statsPreviewLastScore(lastScore)
          : `${lastScore}%`
      );
    }
    if (lastDuration) {
      lines.push(
        t.statsPreviewLastDuration
          ? t.statsPreviewLastDuration(lastDuration)
          : lastDuration
      );
    }
    if (formattedLastSession) {
      lines.push(
        t.statsPreviewLastUpdated
          ? t.statsPreviewLastUpdated(formattedLastSession)
          : formattedLastSession
      );
    }
    return lines.filter(Boolean);
  }, [
    t,
    totalSessions,
    averageScore,
    bestScore,
    averageDuration,
    lastScore,
    lastDuration,
    formattedLastSession,
  ]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-sky-100 via-rose-100 to-amber-100 px-6 py-10">
      <div className="pointer-events-none absolute -top-32 left-1/4 h-80 w-80 -translate-x-1/2 rounded-full bg-sky-200 opacity-40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 translate-x-1/3 translate-y-1/3 rounded-full bg-rose-200 opacity-40 blur-3xl" />

      <div className="relative w-full max-w-xl rounded-[2.5rem] bg-white/90 p-8 text-center shadow-2xl shadow-rose-200 backdrop-blur">
        {languageSelector && <div className="absolute right-6 top-6">{languageSelector}</div>}
        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold uppercase tracking-wider text-sky-600">
            {t?.welcomeBadge}
          </span>
          <h1 className="text-4xl font-black text-sky-900">{t?.title}</h1>
          <p className="text-base text-sky-700">{t?.description}</p>
        </div>

        <div className="mt-6 grid gap-4 text-left">
          <div className="rounded-3xl bg-sky-50 p-4">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-sky-700">{t?.modeLabel}</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {modeOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setMode(option.value)}
                  className={`rounded-2xl border-2 px-4 py-3 text-center text-sm font-bold transition-all ${
                    mode === option.value
                      ? "border-sky-400 bg-white text-sky-700 shadow-md"
                      : "border-transparent bg-sky-100/70 text-sky-600 hover:bg-sky-100"
                  }`}
                >
                  <span className="mb-1 block text-2xl">{option.emoji}</span>
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-rose-50 p-4">
            <label className="mb-3 block text-sm font-semibold uppercase tracking-wide text-rose-700">
              {t?.difficultyLabel}
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full rounded-2xl border-2 border-rose-200 bg-white px-4 py-3 text-base font-semibold text-rose-700 shadow-inner focus:border-rose-400 focus:outline-none"
            >
              {t?.difficultyOptions?.map((label, idx) => (
                <option key={label} value={idx + 1}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-3xl bg-amber-50 p-4">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-amber-700">
              {t?.countLabel}
            </p>
            <div className="flex flex-wrap gap-3">
              {COUNT_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setCount(option)}
                  className={`flex-1 rounded-2xl px-4 py-3 text-base font-bold transition-all sm:flex-none ${
                    parseInt(count) === option
                      ? "bg-white text-amber-700 shadow-md"
                      : "bg-amber-100/80 text-amber-600 hover:bg-amber-100"
                  }`}
                >
                  {t?.countOptionLabel ? t.countOptionLabel(option) : option}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <p className="mt-4 rounded-2xl border-2 border-rose-300 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
            {error}
          </p>
        )}

        {t?.statsPreviewTitle && (
          <div className="mt-6 rounded-3xl bg-white/80 p-5 text-left text-sky-800 shadow-inner">
            <h2 className="text-lg font-bold text-sky-700">{t.statsPreviewTitle}</h2>
            {statsPreviewLines.length ? (
              <ul className="mt-4 grid gap-2 text-sm font-semibold text-sky-700">
                {statsPreviewLines.map((line) => (
                  <li key={line} className="rounded-2xl bg-sky-50/80 px-4 py-2 shadow-sm">
                    {line}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm font-medium text-sky-600">
                {t?.statsPreviewEmpty}
              </p>
            )}
          </div>
        )}

        <button
          onClick={start}
          disabled={isLoading}
          className="mt-8 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-400 to-purple-400 px-8 py-4 text-lg font-extrabold text-white shadow-xl transition-transform duration-200 hover:scale-[1.03] focus:outline-none focus:ring-4 focus:ring-purple-200 disabled:cursor-wait disabled:opacity-70"
        >
          {isLoading ? t?.loadingButton : t?.startButton}
        </button>
      </div>
    </div>
  );
}

