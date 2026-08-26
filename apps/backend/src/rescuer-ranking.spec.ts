import { calculateRescuerRankingScore } from '../../../libs/backend/modules/src/lib/rescuer-ranking';

describe('calculateRescuerRankingScore', () => {
  it('uses the global baseline when a rescuer has no ratings', () => {
    expect(
      calculateRescuerRankingScore({ rating: null, totalRatings: 0 }),
    ).toBe(4.5);
  });

  it('favors a strong high-volume rating over a perfect low-volume rating', () => {
    const lowVolumeScore = calculateRescuerRankingScore({
      rating: 5,
      totalRatings: 2,
    });
    const highVolumeScore = calculateRescuerRankingScore({
      rating: 4.8,
      totalRatings: 500,
    });

    expect(highVolumeScore).toBeGreaterThan(lowVolumeScore);
  });
});
