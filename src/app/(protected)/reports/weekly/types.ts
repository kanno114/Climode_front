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

export interface DailyLogByDay {
  date: string;
  sleep_hours: number | null;
  mood: number | null;
  fatigue_level: number | null;
}

export interface WeeklyReportDaily {
  avg_sleep_hours: number | null;
  avg_mood: number | null;
  avg_fatigue_level: number | null;
  by_day: DailyLogByDay[];
}

export interface FeedbackByDay {
  date: string;
  has_feedback: boolean;
  helpfulness: boolean | null;
  self_score: number | null;
}

export interface WeeklyReportFeedback {
  helpfulness_rate: number | null;
  helpfulness_count: {
    helpful: number;
    not_helpful: number;
  };
  avg_self_score: number | null;
  self_score_distribution: {
    1: number;
    2: number;
    3: number;
  };
  by_day: FeedbackByDay[];
}

export interface Statistics {
  mean: number | null;
  median: number | null;
  std_dev: number | null;
  min: number | null;
  max: number | null;
  q1: number | null;
  q2: number | null;
  q3: number | null;
  coefficient_of_variation: number | null;
}

export interface HealthMetrics {
  sleep_hours: Statistics;
  mood: Statistics;
  fatigue_level: Statistics;
}

export interface WeatherMetrics {
  temperature_c: Statistics;
  humidity_pct: Statistics;
  pressure_hpa: Statistics;
  pressure_drop_6h: Statistics;
  pressure_drop_24h: Statistics;
}

export interface WeeklyComparison {
  score_diff?: number | null;
  score_change_rate?: number | null;
  current_avg?: number | null;
  previous_avg?: number | null;
}

export interface WeeklyStatistics {
  health_metrics: HealthMetrics;
  weather_metrics: WeatherMetrics;
  weekly_comparison: WeeklyComparison | null;
}

export interface WeatherHealthCorrelations {
  [key: string]: number | null;
}

export interface HealthHealthCorrelations {
  mood_fatigue: number | null;
  sleep_mood: number | null;
}

export interface ConditionalAverages {
  low_mood_fatigue: number | null;
  [key: string]: number | null | undefined;
}

export interface SignalHealthAnalysis {
  with_signals_avg: number | null;
  without_signals_avg: number | null;
  signal_count: number;
}

export interface Correlations {
  weather_health_correlations: WeatherHealthCorrelations;
  health_health_correlations: HealthHealthCorrelations;
  conditional_averages: ConditionalAverages;
  signal_health_analysis: SignalHealthAnalysis;
}

export interface WeekdayStats {
  avg_sleep_hours: number | null;
  avg_mood: number | null;
  count: number;
}

export interface WeekHalfComparison {
  first_half_avg: number;
  second_half_avg: number;
  score_diff: number;
}

export interface WeeklyPatterns {
  weekday_stats: Record<number, WeekdayStats>;
  week_half_comparison: WeekHalfComparison | null;
}

export interface WeeklyReport {
  range: WeeklyReportRange;
  signals: WeeklyReportSignals;
  daily: WeeklyReportDaily;
  feedback: WeeklyReportFeedback;
  insight: string;
  statistics: WeeklyStatistics;
  correlations: Correlations;
  patterns: WeeklyPatterns;
}
