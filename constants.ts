import { TeamName } from './types';

export const TEAM_COLORS: Record<string, string> = {
  [TeamName.RedBull]: "#121F45", // Dark Blue
  [TeamName.Mercedes]: "#00D2BE", // Petronas Cyan
  [TeamName.Ferrari]: "#EF1A2D", // Ferrari Red
  [TeamName.McLaren]: "#FF8000", // Papaya Orange
  [TeamName.AstonMartin]: "#006F62", // British Racing Green
  [TeamName.Alpine]: "#0090FF", // Alpine Blue
  [TeamName.Williams]: "#005AFF", // Williams Blue
  [TeamName.Haas]: "#B6BABD", // White/Grey
  [TeamName.Sauber]: "#52E252", // Kick Green / Audi placeholder
  [TeamName.RB]: "#1634CB", // RB Blue
  "Cadillac": "#FFD700", // Cadillac Gold placeholder
  "General": "#64748b" // Slate for generic
};

export const TEAM_BORDER_COLORS: Record<string, string> = {
  [TeamName.RedBull]: "border-blue-900",
  [TeamName.Mercedes]: "border-teal-400",
  [TeamName.Ferrari]: "border-red-600",
  [TeamName.McLaren]: "border-orange-500",
  [TeamName.AstonMartin]: "border-emerald-700",
  [TeamName.Alpine]: "border-blue-500",
  [TeamName.Williams]: "border-blue-700",
  [TeamName.Haas]: "border-gray-400",
  [TeamName.Sauber]: "border-green-400",
  [TeamName.RB]: "border-indigo-600",
  "Cadillac": "border-yellow-600",
  "General": "border-slate-600"
};

export interface TeamConfig {
  name: string;
  url: string;
  id: string;
}

export const TEAMS_CONFIG: TeamConfig[] = [
  { name: TeamName.RedBull, url: "https://www.redbullracing.com/int-en/careers", id: "rb" },
  { name: TeamName.Mercedes, url: "https://www.mercedesamgf1.com/careers/vacancies", id: "merc" },
  { name: TeamName.Ferrari, url: "https://jobs.ferrari.com/", id: "ferrari" },
  { name: TeamName.McLaren, url: "https://racingcareers.mclaren.com/", id: "mcl" },
  { name: TeamName.AstonMartin, url: "https://www.astonmartinf1.com/en-GB/careers/#job-openings-listing", id: "am" },
  { name: TeamName.Alpine, url: "https://alliancewd.wd3.myworkdayjobs.com/en-US/alpine-racing-careers", id: "alp" },
  { name: TeamName.Williams, url: "https://careers.williamsf1.com/", id: "wil" },
  { name: TeamName.Haas, url: "https://www.haasf1team.com/united-kingdom", id: "haas" },
  { name: TeamName.Sauber, url: "https://www.sauber-group.com/corporate/careers", id: "sauber" },
  { name: TeamName.RB, url: "https://www.visacashapprb.com/en/careers", id: "vcarb" },
  { name: "Cadillac F1", url: "https://opportunities.cadillacf1team.com/", id: "cad" }
];

// Keep for backward compatibility if needed, though strictly we use TEAMS_CONFIG now
export const OFFICIAL_CAREER_URLS = TEAMS_CONFIG.map(t => t.url);