import React, { useMemo, useRef } from "react";
import { calculateAggregateStats, formatDuration } from "../utils/stats";

export default function SessionSummary({
  results,
  onRestart,
  settings,
  translations,
  languageSelector,
  stats,
  statsSummary,
  onDownloadStats,
  onUploadStats,
  statsErrorKey,
  language,
}) {
  const total = results.length;
  const correct = results.reduce(
    (count, value) => (value?.correct || value === true ? count + 1 : count),
    0
  );
  const wrong = Math.max(0, total - correct);
  const percentage = total ? Math.round((correct / total) * 100) : 0;
  const summaryT = translations?.sessionSummary;
  const encouragement = summaryT?.encouragement;
  const message = useMemo(() => {
    if (!encouragement) return "";
    if (percentage >= 90) return encouragement.top;
    if (percentage >= 70) return encouragement.high;
    if (percentage >= 40) return encouragement.mid;
    return encouragement.low;
  }, [encouragement, percentage]);
  const modeMessage = summaryT?.modeMessages?.[settings?.mode || "mix"];
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
  const bestScore = computedSummary?.bestScore ?? 0;
  const averageScore = computedSummary?.averageScore ?? 0;
  const lastSession = computedSummary?.lastSession || sessions[totalSessions - 1];
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
  const statsErrorMessage = statsErrorKey
    ? summaryT?.statsError?.(translations?.errors?.[statsErrorKey])
    : null;
  const fileInputRef = useRef(null);

  const triggerUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      onUploadStats?.(file);
    }
    event.target.value = "";
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-100 via-sky-100 to-rose-100 px-6 py-12">
      <div className="pointer-events-none absolute -top-32 right-10 h-80 w-80 rounded-full bg-emerald-200 opacity-40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 -translate-x-1/3 translate-y-1/3 rounded-full bg-sky-200 opacity-40 blur-3xl" />

      <div className="relative w-full max-w-3xl rounded-[2.5rem] bg-white/90 p-10 text-center shadow-2xl shadow-emerald-200 backdrop-blur">
        {languageSelector && <div className="absolute right-8 top-8">{languageSelector}</div>}
        <h1 className="text-4xl font-black text-emerald-800">{summaryT?.title}</h1>
        {modeMessage && (
          <p className="mt-2 text-base text-emerald-700">{modeMessage}</p>
        )}

        <div className="mt-8 grid gap-6 rounded-3xl bg-emerald-50 p-6 sm:grid-cols-2 md:grid-cols-4">
          <div className="rounded-2xl bg-white p-4 shadow">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
              {summaryT?.cards?.correct}
            </p>
            <p className="mt-2 text-3xl font-black text-emerald-700">{correct}</p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow">
            <p className="text-sm font-semibold uppercase tracking-wide text-rose-500">
              {summaryT?.cards?.wrong}
            </p>
            <p className="mt-2 text-3xl font-black text-rose-500">{wrong}</p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow">
            <p className="text-sm font-semibold uppercase tracking-wide text-sky-500">
              {summaryT?.cards?.score}
            </p>
            <p className="mt-2 text-4xl font-black text-sky-600">{percentage}%</p>
          </div>
          {summaryT?.cards?.duration && computedSummary?.lastDurationFormatted && (
            <div className="rounded-2xl bg-white p-4 shadow">
              <p className="text-sm font-semibold uppercase tracking-wide text-amber-500">
                {summaryT.cards.duration}
              </p>
              <p className="mt-2 text-2xl font-black text-amber-600">
                {computedSummary.lastDurationFormatted}
              </p>
            </div>
          )}
        </div>

        {message && (
          <p className="mt-6 text-xl font-semibold text-emerald-700">{message}</p>
        )}

        <div className="mt-8 rounded-3xl bg-emerald-50 p-6 text-left text-emerald-800 shadow-inner">
          <h2 className="text-lg font-bold text-emerald-700">{summaryT?.statsTitle}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-white/80 p-4 text-sm font-semibold text-emerald-700 shadow">
              {summaryT?.totalSessions ? summaryT.totalSessions(totalSessions) : totalSessions}
            </div>
            <div className="rounded-2xl bg-white/80 p-4 text-sm font-semibold text-emerald-700 shadow">
              {summaryT?.bestScore ? summaryT.bestScore(bestScore) : bestScore}
            </div>
            <div className="rounded-2xl bg-white/80 p-4 text-sm font-semibold text-emerald-700 shadow">
              {summaryT?.averageScore ? summaryT.averageScore(averageScore) : averageScore}
            </div>
            {summaryT?.averageDuration && computedSummary?.averageDurationFormatted && (
              <div className="rounded-2xl bg-white/80 p-4 text-sm font-semibold text-emerald-700 shadow">
                {summaryT.averageDuration(computedSummary.averageDurationFormatted)}
              </div>
            )}
            {summaryT?.bestDuration && computedSummary?.bestDurationFormatted && (
              <div className="rounded-2xl bg-white/80 p-4 text-sm font-semibold text-emerald-700 shadow">
                {summaryT.bestDuration(computedSummary.bestDurationFormatted)}
              </div>
            )}
            {summaryT?.lastUpdated && formattedLastSession && (
              <div className="rounded-2xl bg-white/80 p-4 text-sm font-semibold text-emerald-700 shadow">
                {summaryT.lastUpdated(formattedLastSession)}
              </div>
            )}
            {summaryT?.lastDuration && computedSummary?.lastDurationFormatted && (
              <div className="rounded-2xl bg-white/80 p-4 text-sm font-semibold text-emerald-700 shadow">
                {summaryT.lastDuration(computedSummary.lastDurationFormatted)}
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => onDownloadStats?.()}
              className="flex-1 rounded-full bg-emerald-500 px-4 py-2 text-sm font-bold text-white shadow hover:bg-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-200"
            >
              {summaryT?.download}
            </button>
            <button
              type="button"
              onClick={triggerUpload}
              className="flex-1 rounded-full bg-sky-500 px-4 py-2 text-sm font-bold text-white shadow hover:bg-sky-600 focus:outline-none focus:ring-4 focus:ring-sky-200"
            >
              {summaryT?.upload}
            </button>
          </div>
          <p className="mt-2 text-xs font-medium text-emerald-700">{summaryT?.uploadHint}</p>
          {statsErrorMessage && (
            <p className="mt-2 rounded-2xl border-2 border-rose-200 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-500">
              {statsErrorMessage}
            </p>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <button
          onClick={onRestart}
          className="mt-8 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-400 to-sky-400 px-8 py-4 text-lg font-extrabold text-white shadow-xl transition-transform duration-200 hover:scale-[1.03] focus:outline-none focus:ring-4 focus:ring-emerald-200"
        >
          {summaryT?.restart}
        </button>
      </div>
    </div>
  );
}

