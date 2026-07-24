"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { BadgeCheck, CalendarDays, ExternalLink, Flame, Medal, Trophy } from "lucide-react";
import { BlurReveal } from "@/components/effects/blur-reveal";
import type { LeetCodeStats } from "@/lib/leetcode";
import { useLanguage } from "@/providers/language-provider";

const levels = ["bg-border/40", "bg-emerald-500/25", "bg-emerald-500/45", "bg-emerald-500/70", "bg-emerald-500"];
let browserDate: Date | null = null;
const subscribe = () => () => undefined;
const getBrowserDate = () => browserDate || (browserDate = new Date());
const getServerDate = () => null;

export default function LeetCode() {
    const { content, dict } = useLanguage();
    const leetcode = content.leetcode;
    const [stats, setStats] = useState<LeetCodeStats | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        fetch("/api/leetcode", { signal: controller.signal })
            .then((response) => response.ok ? response.json() : Promise.reject())
            .then((data: LeetCodeStats) => setStats(data))
            .catch(() => undefined);
        return () => controller.abort();
    }, []);

    const primaryStats = [
        { value: stats ? stats.solved.toLocaleString() : leetcode.stats[0].value, label: "Problems solved", icon: Trophy },
        { value: stats ? `${stats.streak} days` : leetcode.stats[1].value, label: "Current streak", icon: Flame },
        { value: stats?.contestRating ? Math.round(stats.contestRating).toLocaleString() : leetcode.stats[2].value, label: "Contest rating", icon: Medal },
    ];

    return <section className="relative overflow-hidden border-y border-border/50 bg-secondary/15 py-16 md:py-24 lg:py-32 xl:py-40">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_20%,rgba(255,161,22,0.14),transparent_28%),radial-gradient(circle_at_92%_80%,rgba(255,161,22,0.08),transparent_24%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] [background-size:32px_32px]" />
        <div className="container relative mx-auto px-container">
            <div className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
                <div className="max-w-2xl space-y-4">
                    <BlurReveal><span className="title-counter">[003]</span></BlurReveal>
                    <BlurReveal><h2 className="title">{dict.title.leetcode}</h2></BlurReveal>
                    <BlurReveal><p className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">{dict.leetcodeDescription}</p></BlurReveal>
                </div>
                <BlurReveal><a href={stats?.profileUrl || leetcode.profile} target="_blank" rel="noreferrer" className="group inline-flex w-fit items-center gap-2 rounded-full border border-border/70 bg-background/70 px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-foreground shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-[#ffa116]/60 hover:shadow-lg">@{leetcode.username}<ExternalLink className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></a></BlurReveal>
            </div>

            <BlurReveal><div className="relative overflow-hidden border border-border/60 bg-background/80 p-5 shadow-2xl backdrop-blur-sm sm:p-8 lg:p-10">
                <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#ffa116]/10 blur-3xl" />
                <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)] lg:gap-12">
                    <div className="flex flex-col justify-between gap-8">
                        <div className="flex items-start gap-4 sm:gap-6">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#ffa116]/35 bg-[#ffa116]/10 text-2xl font-black leading-none text-[#e89000] dark:text-[#ffb13b] sm:h-16 sm:w-16">&lt;/&gt;</div>
                            <div><p className="mb-1 font-mono text-[10px] uppercase tracking-[0.24em] text-[#d88100] dark:text-[#ffb13b]">Live problem solving log</p><h3 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Consistency, one problem at a time.</h3></div>
                        </div>
                        <div className="grid grid-cols-1 gap-px overflow-hidden border border-border/60 bg-border/60 sm:grid-cols-3">
                            {primaryStats.map((stat, index) => {
                                const Icon = stat.icon;
                                return <motion.div key={stat.label} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.35 }} transition={{ delay: index * 0.08, duration: 0.45 }} className="group bg-background p-5 transition-colors duration-300 hover:bg-secondary/60 sm:p-6"><Icon className="mb-7 h-4 w-4 text-muted-foreground transition-colors duration-300 group-hover:text-[#e89000] dark:group-hover:text-[#ffb13b]" /><p className="text-3xl font-bold tracking-tighter text-foreground sm:text-4xl">{stat.value}</p><p className="mt-1.5 text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">{stat.label}</p></motion.div>;
                            })}
                        </div>
                        {stats && <div className="flex flex-wrap gap-2 text-[10px] font-mono uppercase tracking-[0.14em] text-muted-foreground"><span className="border border-border/60 px-2.5 py-1.5">Easy {stats.difficulties.easy}</span><span className="border border-border/60 px-2.5 py-1.5">Medium {stats.difficulties.medium}</span><span className="border border-border/60 px-2.5 py-1.5">Hard {stats.difficulties.hard}</span>{stats.ranking && <span className="border border-border/60 px-2.5 py-1.5">Global Rank #{stats.ranking.toLocaleString()}</span>}</div>}
                    </div>
                    <motion.div initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="relative flex min-h-72 flex-col justify-between overflow-hidden border border-[#ffa116]/30 bg-linear-to-br from-[#ffa116]/14 via-[#ffa116]/5 to-transparent p-6 sm:p-8">
                        <div className="absolute -bottom-16 -right-12 select-none text-[13rem] font-black leading-none tracking-tighter text-[#ffa116]/[0.08]">LC</div>
                        <div className="relative flex items-center justify-between"><span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#d88100] dark:text-[#ffb13b]">Competitive programming</span><BadgeCheck className="h-5 w-5 text-[#e89000] dark:text-[#ffb13b]" /></div>
                        <div className="relative"><div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-[#ffa116]/45 bg-[#ffa116]/15 text-[#e89000] shadow-[0_0_35px_rgba(255,161,22,0.16)] dark:text-[#ffb13b]"><Trophy className="h-7 w-7" /></div><p className="text-4xl font-bold tracking-tighter text-foreground sm:text-5xl">{stats?.badge || leetcode.badge.title}</p><p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">{stats?.contests ? `${stats.contests} contests attended · current statistics refresh automatically.` : leetcode.badge.description}</p></div>
                    </motion.div>
                </div>
                <Heatmap stats={stats} />
            </div></BlurReveal>
        </div>
    </section>;
}

function Heatmap({ stats }: { stats: LeetCodeStats | null }) {
    const currentDate = useSyncExternalStore(subscribe, getBrowserDate, getServerDate);
    const days = useMemo(() => currentDate ? buildDays(stats?.heatmap || {}, currentDate) : [], [stats, currentDate]);

    return <div className="relative mt-8 border-t border-border/60 pt-7 sm:mt-10 sm:pt-8">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-emerald-500" /><p className="text-sm font-semibold text-foreground">Submission activity</p><span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">This year</span></div><div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.12em] text-muted-foreground"><span>Less</span>{levels.map((level) => <i key={level} className={`h-2.5 w-2.5 ${level}`} />)}<span>More</span></div></div>
        <div className="w-full"><div className="grid w-full grid-flow-col grid-rows-7 gap-1 sm:gap-1.5" style={{ gridTemplateColumns: `repeat(${Math.ceil(days.length / 7)}, minmax(0, 1fr))` }}>{days.map((day) => <span key={day.timestamp} title={`${day.label}: ${day.count} submission${day.count === 1 ? "" : "s"}`} aria-label={`${day.label}: ${day.count} submissions`} className={`aspect-[1.12] w-full ${levels[levelFor(day.count)]}`} />)}</div></div>
        <p className="mt-4 text-xs text-muted-foreground">{stats ? `Live data refreshed ${new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(new Date(stats.fetchedAt))}.` : "Refreshing public LeetCode activity…"}</p>
    </div>;
}

function buildDays(heatmap: Record<string, number>, currentDate: Date) {
    const today = new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate()));
    const start = new Date(Date.UTC(today.getUTCFullYear(), 0, 1));
    const dayCount = Math.floor((today.getTime() - start.getTime()) / 86_400_000) + 1;
    return Array.from({ length: dayCount }, (_, index) => {
        const date = new Date(start); date.setUTCDate(start.getUTCDate() + index);
        const timestamp = Math.floor(date.getTime() / 1000).toString();
        return { timestamp, count: heatmap[timestamp] || 0, label: formatDate(date) };
    });
}

function levelFor(count: number) { return !count ? 0 : count < 2 ? 1 : count < 4 ? 2 : count < 7 ? 3 : 4; }

function formatDate(date: Date) {
    const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][date.getUTCMonth()];
    return `${month} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;
}
