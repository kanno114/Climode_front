export interface WeeklyReportRange {
  start: string;
  end: string;
}

export interface WeeklyReportSignalByTrigger {
  trigger_key: string;
  count: number;
  strong: number;
  attention: number;
  warning: number;
}

export interface WeeklyReportSignalByDay {
  date: string;
  count: number;
}

export interface WeeklyReportSignals {
  total: number;
  by_trigger: WeeklyReportSignalByTrigger[];
  by_day: WeeklyReportSignalByDay[];
}

export interface WeeklyReportDaily {
  avg_sleep_hours: number | null;
  avg_mood: number | null;
  avg_fatigue_level: number | null;
}

export interface WeeklyReportFeedback {
  helpfulness_rate: number | null;
  helpfulness_count: {
    helpful: number;
    not_helpful: number;
  };
}

export interface WeeklyReport {
  range: WeeklyReportRange;
  signals: WeeklyReportSignals;
  daily: WeeklyReportDaily;
  feedback: WeeklyReportFeedback;
  insight: string;
}
