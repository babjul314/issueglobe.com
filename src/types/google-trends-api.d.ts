declare module "google-trends-api" {
  interface TrendOptions {
    geo?: string;
    trendDate?: Date;
    hl?: string;
    category?: number;
    ns?: number;
  }

  function dailyTrends(options: TrendOptions): Promise<string>;
  function realTimeTrends(options: TrendOptions): Promise<string>;
  function interestOverTime(options: TrendOptions): Promise<string>;
  function interestByRegion(options: TrendOptions): Promise<string>;
  function relatedTopics(options: TrendOptions): Promise<string>;
  function relatedQueries(options: TrendOptions): Promise<string>;

  export default {
    dailyTrends,
    realTimeTrends,
    interestOverTime,
    interestByRegion,
    relatedTopics,
    relatedQueries,
  };
}
