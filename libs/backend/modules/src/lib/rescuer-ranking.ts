const GLOBAL_RATING_AVERAGE = 4.5;
const RATING_CONFIDENCE_THRESHOLD = 20;

export interface RescuerRatingSnapshot {
  rating: number | null | undefined;
  totalRatings: number;
}

export function calculateRescuerRankingScore({
  rating,
  totalRatings,
}: RescuerRatingSnapshot): number {
  const reviewCount = Math.max(0, totalRatings);
  const averageRating = rating ?? GLOBAL_RATING_AVERAGE;
  const weightedReviews =
    reviewCount / (reviewCount + RATING_CONFIDENCE_THRESHOLD);
  const weightedBaseline = 1 - weightedReviews;

  return (
    weightedReviews * averageRating + weightedBaseline * GLOBAL_RATING_AVERAGE
  );
}
