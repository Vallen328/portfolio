import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";
import type { LeetCodeStats } from "@/lib/leetcode";

const username = "sc1n4ZJ45W";
const query = `query PortfolioLeetCodeStats($username: String!) {
  matchedUser(username: $username) {
    username profile { ranking }
    submitStatsGlobal { acSubmissionNum { difficulty count } }
    userCalendar { streak submissionCalendar }
  }
  userContestRanking(username: $username) {
    rating globalRanking attendedContestsCount badge { name }
  }
}`;

type GraphQLResponse = {
    data?: {
        matchedUser?: {
            username: string;
            profile?: { ranking?: number };
            submitStatsGlobal?: { acSubmissionNum?: Array<{ difficulty: string; count: number }> };
            userCalendar?: { streak?: number; submissionCalendar?: string };
        };
        userContestRanking?: { rating?: number; globalRanking?: number; attendedContestsCount?: number; badge?: { name?: string } };
    };
    errors?: Array<{ message: string }>;
};

async function fetchLeetCodeStats(): Promise<LeetCodeStats> {
    const response = await fetch("https://leetcode.com/graphql/", {
        method: "POST",
        headers: { "Content-Type": "application/json", Referer: "https://leetcode.com/" },
        body: JSON.stringify({ query, variables: { username } }),
        cache: "no-store",
    });

    if (!response.ok) throw new Error(`LeetCode responded with ${response.status}`);

    const result = await response.json() as GraphQLResponse;
    const user = result.data?.matchedUser;
    if (!user || result.errors?.length) throw new Error(result.errors?.[0]?.message || "LeetCode profile was not found");

    const counts = user.submitStatsGlobal?.acSubmissionNum || [];
    const countFor = (difficulty: string) => counts.find((item) => item.difficulty === difficulty)?.count || 0;
    const contest = result.data?.userContestRanking;

    return {
        username: user.username,
        profileUrl: `https://leetcode.com/u/${user.username}`,
        solved: countFor("All"),
        difficulties: { easy: countFor("Easy"), medium: countFor("Medium"), hard: countFor("Hard") },
        streak: user.userCalendar?.streak || 0,
        ranking: contest?.globalRanking || user.profile?.ranking || null,
        contestRating: contest?.rating || null,
        contests: contest?.attendedContestsCount || 0,
        badge: contest?.badge?.name || null,
        heatmap: user.userCalendar?.submissionCalendar ? JSON.parse(user.userCalendar.submissionCalendar) as Record<string, number> : {},
        fetchedAt: new Date().toISOString(),
    };
}

const getCachedLeetCodeStats = unstable_cache(fetchLeetCodeStats, ["portfolio-leetcode-stats"], { revalidate: 3600 });

export async function GET() {
    try {
        const stats = await getCachedLeetCodeStats();
        return NextResponse.json(stats, { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } });
    } catch {
        return NextResponse.json({ error: "Unable to refresh LeetCode statistics." }, { status: 503 });
    }
}
