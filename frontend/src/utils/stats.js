export function calculateAggregateStats(rawSessions = []) {
  const sessions = Array.isArray(rawSessions) ? rawSessions : [];
  const totalSessions = sessions.length;

  const scoreValues = sessions
    .map((session) =>
      typeof session?.percentage === "number" ? session.percentage : null
    )
    .filter((value) => value !== null);

  const durationValues = sessions
    .map((session) =>
      typeof session?.durationMs === "number" && session.durationMs >= 0
        ? session.durationMs
        : null
    )
    .filter((value) => value !== null);

  const bestScore = scoreValues.length ? Math.max(...scoreValues) : 0;
  const averageScore = scoreValues.length
    ? Math.round(
        scoreValues.reduce((sum, value) => sum + value, 0) / scoreValues.length
      )
    : 0;

  const averageDurationMs = durationValues.length
    ? Math.round(
        durationValues.reduce((sum, value) => sum + value, 0) /
          durationValues.length
      )
    : null;

  const bestDurationMs = durationValues.length
    ? Math.min(...durationValues)
    : null;

  const lastSession = sessions[totalSessions - 1] || null;

  return {
    totalSessions,
    bestScore,
    averageScore,
    averageDurationSeconds:
      typeof averageDurationMs === "number"
        ? Math.round(averageDurationMs / 1000)
        : null,
    bestDurationSeconds:
      typeof bestDurationMs === "number"
        ? Math.round(bestDurationMs / 1000)
        : null,
    lastSession,
    lastDurationSeconds:
      typeof lastSession?.durationMs === "number"
        ? Math.round(lastSession.durationMs / 1000)
        : null,
  };
}

export function formatDuration(seconds, formatter) {
  if (typeof formatter === "function") {
    return formatter(seconds);
  }
  if (typeof seconds !== "number" || seconds < 0) {
    return "-";
  }
  const totalSeconds = Math.round(seconds);
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;
  if (minutes <= 0) {
    return `${remainingSeconds}s`;
  }
  return `${minutes}m ${remainingSeconds.toString().padStart(2, "0")}s`;
}
