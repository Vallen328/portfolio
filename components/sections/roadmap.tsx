"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { BlurReveal } from "@/components/effects/blur-reveal";
import { useLanguage } from "@/providers/language-provider";
import { ArrowUpRight, ChevronDown, Briefcase, Sparkles } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import type { JourneyMilestone, JourneyExperience, JourneyAchievement } from "@/types/journey";

export default function Roadmap() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { content, dict } = useLanguage();

    const journeyItems: JourneyMilestone[] = (content as Record<string, unknown>).journey as JourneyMilestone[] || [];

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start center", "end center"]
    });

    const scaleY = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const yBackground = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

    return (
        <section ref={containerRef} className="relative container-void overflow-hidden py-32 xl:py-48 border-t border-border/50">
            {/* Ambient glow effects */}
            <div className="absolute top-1/4 left-0 w-full max-w-lg h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -translate-x-1/2" />
            <div className="absolute bottom-1/4 right-0 w-full max-w-lg h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none translate-x-1/2" />

            {/* Parallax background text */}
            <motion.div
                style={{ y: yBackground }}
                className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none flex items-center justify-center opacity-[0.02] z-0 overflow-hidden"
            >
                <div className="text-[20vw] font-black tracking-tighter uppercase whitespace-nowrap">
                    Journey
                </div>
            </motion.div>

            <div className="container mx-auto px-container max-w-6xl relative z-10">

                {/* Section header */}
                <div className="flex flex-col md:items-center mb-24 md:mb-40 gap-4 text-center">
                    <BlurReveal>
                        <span className="title-counter">
                            [005]
                        </span>
                    </BlurReveal>

                    <BlurReveal>
                        <h2 className="title">
                            {dict.title.roadmap}
                        </h2>
                    </BlurReveal>

                    <BlurReveal>
                        <p className="text-lg mt-3 max-w-xl italic font-medium tracking-tight text-foreground/60">
                            {dict.roadmapDescription}
                        </p>
                    </BlurReveal>
                </div>

                {/* Timeline */}
                <div className="relative">
                    {/* Static background line */}
                    <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-border/40 -translate-x-1/2" />

                    {/* Animated progress line */}
                    <motion.div
                        style={{ scaleY, originY: 0 }}
                        className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[2px] bg-linear-to-b from-primary via-primary to-transparent shadow-[0_0_10px_rgba(var(--primary),0.5)] -translate-x-1/2 z-10"
                    />

                    {/* Milestones */}
                    <div className="flex flex-col w-full gap-16 md:gap-32 relative z-20">
                        {journeyItems.map((item: JourneyMilestone, index: number) => (
                            <MilestoneNode
                                key={item.year}
                                item={item}
                                isEven={index % 2 === 0}
                                index={index}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ──────────────────────────────────────────────────────────────────
   MILESTONE NODE
   ────────────────────────────────────────────────────────────────── */

const MilestoneNode = ({ item, isEven, index }: { item: JourneyMilestone; isEven: boolean; index: number }) => {
    const hasExpandableContent = (item.experiences && item.experiences.length > 0) ||
        (item.achievements && item.achievements.length > 0) ||
        item.funNote;

    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <div className={cn(
            "relative flex items-start justify-between w-full",
            isEven ? "flex-row" : "flex-row-reverse"
        )}>

            {/* Spacer for the other side */}
            <div className="w-[calc(50%-3rem)] hidden md:block" />

            {/* Center dot on timeline */}
            <div className="absolute left-6 md:left-1/2 -translate-x-1/2 z-30 flex flex-col items-center">
                {/* Year badge */}
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: false, margin: "-40px" }}
                    transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: index * 0.05 }}
                    className="relative flex items-center justify-center"
                >
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-border/50 bg-background z-20 flex items-center justify-center shadow-lg transition-colors duration-500 hover:border-primary/50">
                        <div className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-full bg-primary shadow-[0_0_12px_rgba(var(--primary),0.8)]" />
                    </div>
                </motion.div>
            </div>

            {/* Card */}
            <div className={cn(
                "w-full md:w-[calc(50%-3rem)] pl-16 md:pl-0 relative group",
            )}>
                <BlurReveal delay={index * 0.06}>
                    <div className={cn(
                        "relative p-8 md:p-10 border border-border/50 bg-secondary/5 backdrop-blur-md overflow-hidden transition-all duration-700 ease-out",
                        "hover:bg-secondary/20 hover:border-border hover:shadow-2xl",
                    )}>
                        {/* Ghost watermark year */}
                        <div className={cn(
                            "absolute top-1/2 -translate-y-1/2 text-[10rem] font-black italic text-foreground/3 select-none pointer-events-none transition-all duration-700 leading-none",
                            isEven ? "-left-8 md:-left-12" : "-right-8 md:-right-12 text-right"
                        )}>
                            {item.year.slice(2)}
                        </div>

                        {/* Content */}
                        <div className="flex flex-col gap-4 relative z-10">

                            {/* Year label (mobile) + Year (desktop) */}
                            <div className={cn(
                                "flex flex-col gap-1",
                                isEven ? "md:items-end md:text-right" : "md:items-start md:text-left"
                            )}>
                                <span className={cn(
                                    "text-xs font-mono tracking-widest text-muted-foreground/60 uppercase"
                                )}>
                                    Chapter {String(index + 1).padStart(2, "0")}
                                </span>

                                <h3 className="text-5xl md:text-6xl lg:text-7xl tracking-tighter font-serif italic font-semibold text-foreground uppercase group-hover:text-primary transition-colors duration-500 leading-[0.85]">
                                    {item.year}
                                </h3>
                            </div>

                            {/* Title */}
                            <h4 className={cn(
                                "text-xl md:text-2xl font-bold tracking-tight text-foreground mt-2",
                                isEven ? "md:text-right" : "md:text-left"
                            )}>
                                {item.title}
                            </h4>

                            {/* Description */}
                            <p className={cn(
                                "text-muted-foreground text-sm md:text-base leading-relaxed max-w-md",
                                isEven ? "md:ml-auto md:text-right" : "md:mr-auto md:text-left"
                            )}>
                                {item.description}
                            </p>

                            {/* Highlights */}
                            {item.highlights && item.highlights.length > 0 && (
                                <div className={cn(
                                    "flex flex-wrap gap-2 mt-2",
                                    isEven ? "md:justify-end" : "md:justify-start"
                                )}>
                                    {item.highlights.map((highlight: string) => (
                                        <span
                                            key={highlight}
                                            className="text-[11px] uppercase tracking-wider text-foreground/70 font-medium px-3 py-1.5 rounded-full border border-border/40 bg-background/50 shadow-sm transition-all duration-300 hover:border-primary/30 hover:text-foreground"
                                        >
                                            {highlight}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Tech stack pills */}
                            {item.tech && item.tech.length > 0 && (
                                <div className={cn(
                                    "flex flex-wrap gap-1.5 mt-2",
                                    isEven ? "md:justify-end" : "md:justify-start"
                                )}>
                                    {item.tech.map((t: string) => (
                                        <span
                                            key={t}
                                            className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-mono px-2.5 py-1 bg-primary/5 border border-primary/10 rounded-full transition-all duration-300 hover:bg-primary/10 hover:text-foreground"
                                        >
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Expandable toggle */}
                            {hasExpandableContent && (
                                <div className={cn(
                                    "mt-4",
                                    isEven ? "md:text-right" : "md:text-left"
                                )}>
                                    <button
                                        onClick={() => setIsExpanded(!isExpanded)}
                                        className={cn(
                                            "inline-flex items-center gap-1.5 text-xs font-mono tracking-widest uppercase text-muted-foreground/60 hover:text-foreground transition-colors duration-300 cursor-pointer",
                                            isEven ? "md:flex-row-reverse" : ""
                                        )}
                                    >
                                        <span>{isExpanded ? "Less" : "Details"}</span>
                                        <motion.div
                                            animate={{ rotate: isExpanded ? 180 : 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <ChevronDown className="w-3.5 h-3.5" />
                                        </motion.div>
                                    </button>
                                </div>
                            )}

                            {/* Expandable content */}
                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                                        className="overflow-hidden"
                                    >
                                        <div className="flex flex-col gap-6 pt-4 border-t border-border/30 mt-2">

                                            {/* Professional Experiences */}
                                            {item.experiences && item.experiences.length > 0 && (
                                                <div className={cn(
                                                    "flex flex-col gap-4",
                                                    isEven ? "md:items-end" : "md:items-start"
                                                )}>
                                                    <span className={cn(
                                                        "text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground/50 flex items-center gap-2",
                                                        isEven ? "md:flex-row-reverse" : ""
                                                    )}>
                                                        <Briefcase className="w-3 h-3" />
                                                        Experience
                                                    </span>
                                                    {item.experiences.map((exp: JourneyExperience) => (
                                                        <ExperienceBlock key={`${exp.company}-${exp.role}`} experience={exp} isEven={isEven} />
                                                    ))}
                                                </div>
                                            )}

                                            {/* Achievements */}
                                            {item.achievements && item.achievements.length > 0 && (
                                                <div className={cn(
                                                    "flex flex-col gap-3",
                                                    isEven ? "md:items-end" : "md:items-start"
                                                )}>
                                                    <span className={cn(
                                                        "text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground/50 flex items-center gap-2",
                                                        isEven ? "md:flex-row-reverse" : ""
                                                    )}>
                                                        <Sparkles className="w-3 h-3" />
                                                        Achievements
                                                    </span>
                                                    {item.achievements.map((ach: JourneyAchievement) => (
                                                        <AchievementBadge key={ach.label} achievement={ach} isEven={isEven} />
                                                    ))}
                                                </div>
                                            )}

                                            {/* Fun note */}
                                            {item.funNote && (
                                                <div className={cn(
                                                    "flex items-start gap-2 max-w-sm",
                                                    isEven ? "md:ml-auto md:text-right md:flex-row-reverse" : ""
                                                )}>
                                                    <span className="text-lg shrink-0 mt-0.5">✨</span>
                                                    <p className="text-sm italic text-muted-foreground/70 leading-relaxed">
                                                        {item.funNote}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                    </div>
                </BlurReveal>
            </div>
        </div>
    );
};

/* ──────────────────────────────────────────────────────────────────
   EXPERIENCE BLOCK
   ────────────────────────────────────────────────────────────────── */

const ExperienceBlock = ({ experience, isEven }: { experience: JourneyExperience; isEven: boolean }) => {
    return (
        <div className={cn(
            "w-full max-w-sm p-4 border border-border/30 bg-background/30 backdrop-blur-sm transition-all duration-500 hover:border-border/60 hover:bg-background/50 group/exp",
            isEven ? "md:text-right" : "md:text-left"
        )}>
            <div className={cn(
                "flex flex-col gap-1",
                isEven ? "md:items-end" : "md:items-start"
            )}>
                <h5 className="text-sm font-bold tracking-tight text-foreground group-hover/exp:text-primary transition-colors duration-300">
                    {experience.role}
                </h5>
                <span className="text-xs text-muted-foreground font-medium">
                    {experience.company}
                </span>
                <span className="text-[10px] font-mono tracking-widest text-muted-foreground/50 uppercase">
                    {experience.period}
                </span>
            </div>

            {experience.tags && experience.tags.length > 0 && (
                <div className={cn(
                    "flex flex-wrap gap-1 mt-3",
                    isEven ? "md:justify-end" : "md:justify-start"
                )}>
                    {experience.tags.map((tag: string) => (
                        <span
                            key={tag}
                            className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground/60 font-mono px-2 py-0.5 bg-primary/5 rounded-full border border-primary/10"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            )}

            {experience.workDetails && experience.workDetails.length > 0 && (
                <HoverCard openDelay={150} closeDelay={120}>
                    <HoverCardTrigger asChild>
                        <button
                            type="button"
                            className={cn(
                                "mt-4 inline-flex items-center gap-2 border border-primary/25 bg-primary/5 px-3 py-2 text-[10px] font-mono font-semibold uppercase tracking-[0.16em] text-foreground transition-all duration-300 hover:border-primary/60 hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                                isEven ? "md:ml-auto" : ""
                            )}
                        >
                            View work dossier
                            <ArrowUpRight className="h-3 w-3" />
                        </button>
                    </HoverCardTrigger>
                    <HoverCardContent
                        side="top"
                        align={isEven ? "end" : "start"}
                        className="z-[120] w-[min(25rem,calc(100vw-2rem))] overflow-hidden rounded-none border-border/70 bg-background/95 p-0 shadow-2xl backdrop-blur-xl"
                    >
                        <div className="border-b border-border/60 bg-primary/5 px-5 py-4">
                            <p className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-primary">Work dossier · {experience.company}</p>
                            <h6 className="mt-1 text-base font-bold tracking-tight text-foreground">What I worked on</h6>
                        </div>
                        <ul className="space-y-3 p-5">
                            {experience.workDetails.map((detail) => (
                                <li key={detail} className="flex gap-3 text-xs leading-relaxed text-muted-foreground">
                                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                                    {detail}
                                </li>
                            ))}
                        </ul>
                        <div className="border-t border-border/60 px-5 py-3 text-[9px] font-mono uppercase tracking-[0.18em] text-muted-foreground/70">
                            Hover or focus to inspect
                        </div>
                    </HoverCardContent>
                </HoverCard>
            )}
        </div>
    );
};

/* ──────────────────────────────────────────────────────────────────
   ACHIEVEMENT BADGE
   ────────────────────────────────────────────────────────────────── */

const AchievementBadge = ({ achievement, isEven }: { achievement: JourneyAchievement; isEven: boolean }) => {
    return (
        <div className={cn(
            "flex items-center gap-3 px-4 py-2.5 border border-border/30 bg-background/20 backdrop-blur-sm rounded-full transition-all duration-500 hover:border-primary/30 hover:shadow-[0_0_20px_rgba(var(--primary),0.08)]",
            isEven ? "md:flex-row-reverse" : ""
        )}>
            <span className="text-lg shrink-0">{achievement.icon}</span>
            <div className={cn(
                "flex flex-col",
                isEven ? "md:items-end" : "md:items-start"
            )}>
                <span className="text-xs font-semibold tracking-tight text-foreground">
                    {achievement.label}
                </span>
                {achievement.date && (
                    <span className="text-[10px] font-mono tracking-widest text-muted-foreground/50 uppercase">
                        {achievement.date}
                    </span>
                )}
            </div>
        </div>
    );
};
