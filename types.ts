export enum TeamName {
  RedBull = "Red Bull Racing",
  Mercedes = "Mercedes-AMG PETRONAS",
  Ferrari = "Scuderia Ferrari",
  McLaren = "McLaren F1 Team",
  AstonMartin = "Aston Martin Aramco",
  Alpine = "BWT Alpine F1 Team",
  Williams = "Williams Racing",
  Haas = "MoneyGram Haas F1 Team",
  Sauber = "Sauber Motorsport (Audi)",
  RB = "Visa Cash App RB"
}

export interface JobPosting {
  id: string;
  title: string;
  team: string;
  location: string;
  department: string;
  datePosted: string; // YYYY-MM-DD
  dateClosing?: string; // YYYY-MM-DD
  isNew: boolean;
  descriptionShort: string;
  applyUrl?: string; // Link to the real job posting
}

export interface JobResponse {
  jobs: JobPosting[];
}