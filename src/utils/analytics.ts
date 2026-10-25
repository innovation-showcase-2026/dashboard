import { Participant, SummitKPIs, BoothStats, LobStats, SUMMIT_BOOTHS } from '../types';

/**
 * Computes top-level executive summit KPIs
 */
export function computeKPIs(participants: Participant[]): SummitKPIs {
  const totalRegistered = participants.length;
  let totalSubmissions = 0;
  let prizeEligibleCount = 0;
  let totalScoreSum = 0;
  let totalAccuracySum = 0;

  participants.forEach((p) => {
    totalSubmissions += p.totalTestsAppeared || 0;
    if (p.isPrizeEligible || (p.totalTestsAppeared && p.totalTestsAppeared >= 4)) {
      prizeEligibleCount++;
    }
    totalScoreSum += p.totalScore || 0;
    totalAccuracySum += p.overallAccuracy || 0;
  });

  const averageAccuracy = totalRegistered > 0 ? Math.round((totalAccuracySum / totalRegistered) * 10) / 10 : 0;
  const averageScore = totalRegistered > 0 ? Math.round(totalScoreSum / totalRegistered) : 0;

  return {
    totalRegistered,
    totalSubmissions,
    prizeEligibleCount,
    averageAccuracy,
    averageScore,
    totalScoreSum
  };
}

/**
 * Computes individual booth statistics across all participants
 */
export function computeBoothStats(participants: Participant[]): BoothStats[] {
  return SUMMIT_BOOTHS.map((booth) => {
    let totalAttempts = 0;
    let scoreSum = 0;
    let accuracySum = 0;
    let timeSum = 0;
    let topPerformer: BoothStats['topPerformer'] = undefined;
    let topScore = -1;
    let topTime = 999999;

    participants.forEach((p) => {
      if (!p.tests || !Array.isArray(p.tests)) return;

      // Find if this participant completed this booth
      const boothTest = p.tests.find(
        (t) => t.boothNumber === booth.number || 
               t.boothId === booth.id || 
               (t.boothTitle && t.boothTitle.toLowerCase().includes(booth.shortTitle.toLowerCase()))
      );

      if (boothTest) {
        totalAttempts++;
        scoreSum += boothTest.score || 0;
        accuracySum += boothTest.percentage || 0;
        timeSum += boothTest.timeTakenSeconds || 0;

        // Check if top performer (higher score, or tie-break on lower time)
        const score = boothTest.score || 0;
        const time = boothTest.timeTakenSeconds || 0;
        if (score > topScore || (score === topScore && time < topTime)) {
          topScore = score;
          topTime = time;
          topPerformer = {
            name: p.name,
            entId: p.entId,
            score,
            timeTakenSeconds: time
          };
        }
      }
    });

    return {
      boothNumber: booth.number,
      boothTitle: booth.title,
      totalAttempts,
      averageScore: totalAttempts > 0 ? Math.round((scoreSum / totalAttempts) * 10) / 10 : 0,
      averageAccuracy: totalAttempts > 0 ? Math.round((accuracySum / totalAttempts) * 10) / 10 : 0,
      averageTimeSeconds: totalAttempts > 0 ? Math.round(timeSum / totalAttempts) : 0,
      topPerformer
    };
  });
}

/**
 * Computes participation and performance grouped by Line of Business (LOB)
 */
export function computeLobStats(participants: Participant[]): LobStats[] {
  const lobMap = new Map<string, {
    count: number;
    totalScore: number;
    accuracySum: number;
    boothsCompleted: number;
    prizeEligibleCount: number;
  }>();

  participants.forEach((p) => {
    const lobName = p.lob?.trim() || 'General Enterprise';
    const entry = lobMap.get(lobName) || {
      count: 0,
      totalScore: 0,
      accuracySum: 0,
      boothsCompleted: 0,
      prizeEligibleCount: 0
    };

    entry.count += 1;
    entry.totalScore += p.totalScore || 0;
    entry.accuracySum += p.overallAccuracy || 0;
    entry.boothsCompleted += p.totalTestsAppeared || 0;
    if (p.isPrizeEligible || (p.totalTestsAppeared && p.totalTestsAppeared >= 4)) {
      entry.prizeEligibleCount += 1;
    }

    lobMap.set(lobName, entry);
  });

  const list: LobStats[] = [];
  lobMap.forEach((val, lob) => {
    list.push({
      lob,
      participantCount: val.count,
      totalScore: val.totalScore,
      averageScore: Math.round(val.totalScore / val.count),
      averageAccuracy: Math.round((val.accuracySum / val.count) * 10) / 10,
      boothsCompleted: val.boothsCompleted,
      prizeEligibleCount: val.prizeEligibleCount
    });
  });

  // Sort by total score descending
  return list.sort((a, b) => b.totalScore - a.totalScore);
}

/**
 * Exports current participant leaderboard data into a downloadable CSV
 */
export function exportParticipantsToCSV(participants: Participant[]): void {
  if (!participants || participants.length === 0) {
    alert("No participant records available to export.");
    return;
  }

  const headers = [
    "Rank",
    "Enterprise ID",
    "Full Name",
    "Line of Business (LOB)",
    "Booths Completed",
    "Total Score",
    "Total Questions",
    "Overall Accuracy (%)",
    "Prize Eligible (>= 4 booths)",
    "Last Active Timestamp"
  ];

  const rows = participants.map((p, idx) => [
    p.rank ?? (idx + 1),
    `"${p.entId}"`,
    `"${p.name.replace(/"/g, '""')}"`,
    `"${p.lob.replace(/"/g, '""')}"`,
    p.totalTestsAppeared,
    p.totalScore,
    p.totalQuestions,
    `${p.overallAccuracy}%`,
    p.isPrizeEligible ? "YES" : "NO",
    `"${p.lastUpdated || p.registeredAt || 'N/A'}"`
  ]);

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);

  link.setAttribute("href", url);
  link.setAttribute("download", `WellsFargo_Summit_2026_Leaderboard_${timestamp}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
