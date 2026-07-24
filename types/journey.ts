export type JourneyExperience = {
    role: string;
    company: string;
    period: string;
    tags: string[];
    workDetails?: string[];
};

export type JourneyAchievement = {
    icon: string;
    label: string;
    date?: string;
};

export type JourneyMilestone = {
    year: string;
    title: string;
    description: string;
    highlights: string[];
    experiences?: JourneyExperience[];
    achievements?: JourneyAchievement[];
    tech?: string[];
    funNote?: string;
};
