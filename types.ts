
export interface DailyReport {
  date: string;
  impressions: number;
  clicks: number;
  ctr: number;
  viewability: number;
  investment: number;
}

export interface Verification {
  id: string;
  title: string;
  url: string;
  site: string;
  timestamp: string;
  imageUrl: string;
  device?: string;
  format?: string;
}

export interface CampaignSummary {
  agencyName: string;
  clientName: string;
  campaignName: string;
  format: string;
  startDate: string;
  endDate: string;
  target: string;
  investment: number;
  geo: string;
  objectiveImpressions: number;
  cpm: number;
  consumedBudget: number;
  servedImpressions: number;
  totalClicks: number;
  totalCtr: number;
  totalViewability: number;
}
