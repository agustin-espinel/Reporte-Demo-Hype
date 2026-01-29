
import { CampaignSummary, DailyReport, Verification } from './types';

export const CAMPAIGN_SUMMARY: CampaignSummary = {
  agencyName: "Hypeads Agency Solutions",
  clientName: "Global Tech Corp",
  campaignName: "Lanzamiento Verano 2025 - Premium",
  format: "Rich Media",
  startDate: "12/10/2025",
  endDate: "12/19/2025",
  target: "Ambos de 30 a 50 años",
  investment: 5000,
  geo: "ES",
  objectiveImpressions: 1351351,
  cpm: 3.70,
  consumedBudget: 2701.05,
  servedImpressions: 730013,
  totalClicks: 4897,
  totalCtr: 0.67,
  totalViewability: 65.61
};

// Start with empty verifications as requested
export const VERIFICATIONS: Verification[] = [];

export const DAILY_BREAKDOWN: DailyReport[] = [
  { date: "10 dic", impressions: 4744, clicks: 52, ctr: 1.43, viewability: 64.30, investment: 17.55 },
  { date: "11 dic", impressions: 47150, clicks: 291, ctr: 0.80, viewability: 65.60, investment: 174.46 },
  { date: "12 dic", impressions: 88420, clicks: 619, ctr: 0.91, viewability: 65.90, investment: 327.15 },
  { date: "13 dic", impressions: 88386, clicks: 607, ctr: 0.89, viewability: 65.70, investment: 327.03 },
  { date: "14 dic", impressions: 88404, clicks: 603, ctr: 0.89, viewability: 65.70, investment: 327.09 },
  { date: "15 dic", impressions: 88391, clicks: 486, ctr: 0.71, viewability: 64.80, investment: 327.05 },
  { date: "16 dic", impressions: 88414, clicks: 506, ctr: 0.74, viewability: 65.00, investment: 327.13 },
  { date: "17 dic", impressions: 88438, clicks: 535, ctr: 0.79, viewability: 65.30, investment: 327.22 },
  { date: "18 dic", impressions: 88292, clicks: 730, ctr: 1.07, viewability: 67.20, investment: 326.68 },
  { date: "19 dic", impressions: 59374, clicks: 468, ctr: 1.02, viewability: 66.60, investment: 219.68 }
];
