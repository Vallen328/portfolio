export type LeetCodeDifficulty = {
    easy: number;
    medium: number;
    hard: number;
};

export type LeetCodeStats = {
    username: string;
    profileUrl: string;
    solved: number;
    difficulties: LeetCodeDifficulty;
    streak: number;
    ranking: number | null;
    contestRating: number | null;
    contests: number;
    badge: string | null;
    heatmap: Record<string, number>;
    fetchedAt: string;
};
