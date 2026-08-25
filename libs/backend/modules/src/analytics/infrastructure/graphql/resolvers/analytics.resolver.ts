/**
 * Analytics Resolvers
 * Dashboard statistics and metrics
 */

import { GraphQLContext } from '@snake-rescue/core';
import { prisma } from '@snake-rescue/database';

export const analyticsResolvers = {
  Query: {
    /**
     * Get dashboard statistics for admin dashboard
     */
    dashboardStats: async (
      _parent: any,
      args: { period?: string },
      context: GraphQLContext,
    ) => {
      // Require admin role
      context.requireAuth();
      context.requireRole(['ADMIN', 'SUPER_ADMIN', 'DISTRICT_COORDINATOR']);

      // Calculate date range based on period
      const now = new Date();
      const startDate = new Date();

      switch (args.period) {
        case 'TODAY':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'WEEK':
        case 'LAST_7_DAYS':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'MONTH':
        case 'LAST_30_DAYS':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'THIS_MONTH':
          startDate.setDate(1);
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'LAST_90_DAYS':
          startDate.setDate(now.getDate() - 90);
          break;
        case 'YEAR':
        case 'THIS_YEAR':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
        case 'YESTERDAY':
          startDate.setDate(now.getDate() - 1);
          startDate.setHours(0, 0, 0, 0);
          now.setHours(0, 0, 0, 0);
          break;
        case 'LAST_MONTH':
          startDate.setMonth(now.getMonth() - 1, 1);
          startDate.setHours(0, 0, 0, 0);
          now.setDate(1);
          now.setHours(0, 0, 0, 0);
          break;
        case 'LAST_YEAR':
          startDate.setFullYear(now.getFullYear() - 1, 0, 1);
          startDate.setHours(0, 0, 0, 0);
          now.setFullYear(now.getFullYear(), 0, 1);
          now.setHours(0, 0, 0, 0);
          break;
        default:
          startDate.setMonth(now.getMonth() - 1); // Default to MONTH
      }

      // Get rescue metrics
      const [
        totalRescues,
        activeRescues,
        completedRescues,
        previousPeriodCompleted,
      ] = await Promise.all([
        prisma.rescueRequest.count(),
        prisma.rescueRequest.count({
          where: {
            status: { in: ['PENDING', 'ASSIGNED', 'ACCEPTED', 'IN_PROGRESS'] },
          },
        }),
        prisma.rescueRequest.count({
          where: {
            status: 'COMPLETED',
            completedAt: { gte: startDate },
          },
        }),
        prisma.rescueRequest.count({
          where: {
            status: 'COMPLETED',
            completedAt: {
              gte: new Date(
                startDate.getTime() - (now.getTime() - startDate.getTime()),
              ),
              lt: startDate,
            },
          },
        }),
      ]);

      const completionRate =
        totalRescues > 0 ? (completedRescues / totalRescues) * 100 : 0;

      // Calculate average response time (seconds)
      const completedWithTiming = await prisma.rescueRequest.findMany({
        where: {
          status: 'COMPLETED',
        },
        select: {
          createdAt: true,
          acceptedAt: true,
        },
      });

      // Filter out records with null dates and calculate average
      const validTimings = completedWithTiming.filter(
        (rescue) => rescue.acceptedAt && rescue.createdAt,
      );

      const avgResponseTime =
        validTimings.length > 0
          ? validTimings.reduce((sum, rescue) => {
              const diff =
                rescue.acceptedAt!.getTime() - rescue.createdAt.getTime();
              return sum + diff / 1000; // Convert to seconds
            }, 0) / validTimings.length
          : 0;

      const recentRescues = await prisma.rescueRequest.findMany({
        where: { createdAt: { gte: startDate, lt: now } },
        orderBy: { createdAt: 'desc' },
        take: 50,
        select: {
          id: true,
          name: true,
          municipality: true,
          status: true,
          priority: true,
          createdAt: true,
        },
      });

      // Get volunteer metrics
      const [
        totalVolunteers,
        activeVolunteers,
        verifiedRescuers,
        previousPeriodVolunteers,
      ] = await Promise.all([
        prisma.volunteer.count(),
        prisma.volunteer.count({
          where: { isAvailableNow: true },
        }),
        prisma.volunteer.count({
          where: { status: 'VERIFIED' },
        }),
        prisma.volunteer.count({
          where: {
            createdAt: {
              gte: new Date(
                startDate.getTime() - (now.getTime() - startDate.getTime()),
              ),
              lt: startDate,
            },
          },
        }),
      ]);

      // Get species metrics
      const [totalSpecies, venomousCount] = await Promise.all([
        prisma.snakeSpecies.count(),
        prisma.snakeSpecies.count({ where: { venomous: true } }),
      ]);

      // Get community metrics
      const [totalUsers, donationsData] = await Promise.all([
        prisma.user.count(),
        prisma.donation.aggregate({
          _count: true,
          _sum: { amount: true },
          where: {
            status: 'COMPLETED',
            paidAt: { gte: startDate },
          },
        }),
      ]);

      const [previousDonations] = await Promise.all([
        prisma.donation.aggregate({
          _count: true,
          where: {
            status: 'COMPLETED',
            paidAt: {
              gte: new Date(
                startDate.getTime() - (now.getTime() - startDate.getTime()),
              ),
              lt: startDate,
            },
          },
        }),
      ]);

      // Calculate trends
      const rescueTrend = {
        current: completedRescues,
        previous: previousPeriodCompleted,
        change:
          previousPeriodCompleted > 0
            ? ((completedRescues - previousPeriodCompleted) /
                previousPeriodCompleted) *
              100
            : 0,
        direction:
          completedRescues > previousPeriodCompleted
            ? 'UP'
            : completedRescues < previousPeriodCompleted
              ? 'DOWN'
              : 'STABLE',
        data: [], // TODO: Implement time series data
      };

      const volunteerTrend = {
        current: totalVolunteers,
        previous: previousPeriodVolunteers,
        change:
          previousPeriodVolunteers > 0
            ? ((totalVolunteers - previousPeriodVolunteers) /
                previousPeriodVolunteers) *
              100
            : 0,
        direction:
          totalVolunteers > previousPeriodVolunteers
            ? 'UP'
            : totalVolunteers < previousPeriodVolunteers
              ? 'DOWN'
              : 'STABLE',
        data: [],
      };

      const donationTrend = {
        current: donationsData._count || 0,
        previous: previousDonations._count || 0,
        change:
          previousDonations._count > 0
            ? ((donationsData._count - previousDonations._count) /
                previousDonations._count) *
              100
            : 0,
        direction:
          donationsData._count > previousDonations._count
            ? 'UP'
            : donationsData._count < previousDonations._count
              ? 'DOWN'
              : 'STABLE',
        data: [],
      };

      return {
        // Rescue Metrics
        totalRescues,
        activeRescues,
        completedRescues,
        completionRate,
        averageResponseTime: Math.round(avgResponseTime / 60),

        // Volunteer Metrics
        totalVolunteers,
        activeVolunteers,
        verifiedRescuers,

        // Species Metrics
        totalSpecies,
        venomousEncounters: venomousCount,

        // Community Metrics
        totalUsers,
        totalDonations: donationsData._count || 0,
        totalDonationAmount: donationsData._sum.amount || 0,

        // Recent Activity (TODO: Implement actual recent data)
        recentRescues,
        recentDonations: [],

        // Trends
        rescueTrend,
        volunteerTrend,
        donationTrend,
      };
    },
  },
};
