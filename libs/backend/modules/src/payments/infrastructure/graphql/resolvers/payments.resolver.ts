import { prisma } from '@snake-rescue/database';
import type { GraphQLContext } from '@snake-rescue/core';
import {
  PayoutService,
  type PayoutPaymentMethod,
} from '../../../../finance/application/payout.service';
import { PaymentIntentService } from '../../../payment-intent.service';
import { createConfiguredPaymentProviderService } from '../../../configured-payment-provider.service';
import { PaymentsService } from '../../../payments.service';
import {
  type PaymentProviderName,
  type StripeConnectionStatus,
} from '../../../payments.types';

interface PaymentIntentInput {
  rescueChargeId?: string;
  donationId?: string;
  provider: PaymentProviderName;
  amount: string;
  currency?: string;
  idempotencyKey: string;
}

interface InitiatePaymentInput extends PaymentIntentInput {
  returnUrl?: string;
}

interface ConfirmPaymentInput {
  paymentIntentId?: string;
  providerReference: string;
}

interface CreatePayoutInput {
  settlementId: string;
  paymentMethod?: PayoutPaymentMethod;
  idempotencyKey: string;
}

interface TransitionPayoutInput {
  payoutId: string;
  status:
    | 'PROCESSING'
    | 'PAID'
    | 'FAILED'
    | 'REJECTED'
    | 'CANCELLED'
    | 'APPROVED';
  externalReference?: string;
  failureReason?: string;
}

interface RefundPaymentInput {
  paymentIntentId: string;
  amount: string;
  idempotencyKey: string;
}

type PayoutWithCitizen = {
  rescuerId: string;
  settlement?: {
    rescueCharge?: {
      rescue?: {
        name: string;
        user?: { name: string } | null;
      } | null;
    } | null;
  } | null;
};

async function enrichPayout<T extends PayoutWithCitizen>(payout: T) {
  const rescuer = await prisma.volunteer.findUnique({
    where: { id: payout.rescuerId },
    select: { name: true },
  });
  return {
    ...payout,
    rescuerName: rescuer?.name || 'Unknown rescuer',
    citizenName:
      payout.settlement?.rescueCharge?.rescue?.user?.name ||
      payout.settlement?.rescueCharge?.rescue?.name ||
      'Unknown citizen',
  };
}

async function enrichPayouts<T extends PayoutWithCitizen>(payouts: T[]) {
  const rescuers = await prisma.volunteer.findMany({
    where: { id: { in: payouts.map((payout) => payout.rescuerId) } },
    select: { id: true, name: true },
  });
  const names = new Map(rescuers.map((rescuer) => [rescuer.id, rescuer.name]));
  return payouts.map((payout) => ({
    ...payout,
    rescuerName: names.get(payout.rescuerId) || 'Unknown rescuer',
    citizenName:
      payout.settlement?.rescueCharge?.rescue?.user?.name ||
      payout.settlement?.rescueCharge?.rescue?.name ||
      'Unknown citizen',
  }));
}

interface StartPaymentInput {
  paymentIntentId: string;
  amount?: string;
  returnUrl?: string;
}

/**
 * PaymentsResolver
 * GraphQL resolver for Stripe development testing
 * DEVELOPMENT ONLY - Does not expose payment operations
 */
export class PaymentsResolver {
  constructor(private readonly paymentsService: PaymentsService) {}

  /**
   * Query to check Stripe connection status
   * Only available in development mode
   */
  async stripeConnectionStatus(): Promise<StripeConnectionStatus> {
    // Double-check that development testing is enabled
    if (!this.paymentsService.isDevTestingEnabled()) {
      return {
        connected: false,
        mode: 'unknown',
        livemode: false,
        message: 'Development diagnostics are disabled',
      };
    }

    return this.paymentsService.getStripeAccountStatus();
  }
}

// Export resolver object for Apollo Server
export const paymentsResolvers = {
  Query: {
    paymentIntent: async (
      _parent: unknown,
      args: { id: string },
      context: GraphQLContext,
    ) => {
      context.requireAuth();
      context.requireRole(['ADMIN', 'SUPER_ADMIN']);
      return new PaymentIntentService(prisma).findById(args.id);
    },
    settlement: async (
      _parent: unknown,
      args: { id: string },
      context: GraphQLContext,
    ) => {
      context.requireAuth();
      context.requireRole(['ADMIN', 'SUPER_ADMIN']);
      return prisma.settlement.findUnique({
        where: { id: args.id },
        include: {
          rescuer: true,
          rescueCharge: { include: { rescue: { include: { user: true } } } },
        },
      });
    },
    payout: async (
      _parent: unknown,
      args: { id: string },
      context: GraphQLContext,
    ) => {
      context.requireAuth();
      context.requireRole(['ADMIN', 'SUPER_ADMIN']);
      const payout = await prisma.payout.findUnique({
        where: { id: args.id },
        include: {
          settlement: {
            include: {
              rescueCharge: {
                include: { rescue: { include: { user: true } } },
              },
            },
          },
        },
      });
      return payout ? enrichPayout(payout) : null;
    },
    settlements: async (
      _parent: unknown,
      args: { status?: string },
      context: GraphQLContext,
    ) => {
      context.requireAuth();
      context.requireRole(['ADMIN', 'SUPER_ADMIN']);
      return prisma.settlement.findMany({
        where: args.status ? { status: args.status as never } : undefined,
        include: {
          rescuer: true,
          rescueCharge: { include: { rescue: { include: { user: true } } } },
        },
        orderBy: { createdAt: 'desc' },
      });
    },
    payouts: async (
      _parent: unknown,
      args: { status?: string },
      context: GraphQLContext,
    ) => {
      context.requireAuth();
      context.requireRole(['ADMIN', 'SUPER_ADMIN']);
      const payouts = await prisma.payout.findMany({
        where: args.status ? { status: args.status as never } : undefined,
        include: {
          settlement: {
            include: {
              rescueCharge: {
                include: { rescue: { include: { user: true } } },
              },
            },
          },
        },
        orderBy: { requestedAt: 'desc' },
      });
      return enrichPayouts(payouts);
    },
    mySettlements: async (
      _parent: unknown,
      args: { pagination?: { limit?: number; page?: number } },
      context: GraphQLContext,
    ) => {
      context.requireAuth();
      const limit = args.pagination?.limit || 10;
      const page = args.pagination?.page || 1;
      const skip = (page - 1) * limit;
      const where = { rescuer: { userId: context.user.id } };
      const [settlements, totalCount] = await Promise.all([
        prisma.settlement.findMany({
          where,
          take: limit,
          skip,
          include: {
            rescuer: true,
            rescueCharge: { include: { rescue: { include: { user: true } } } },
          },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.settlement.count({ where }),
      ]);
      return {
        edges: settlements.map((settlement) => ({
          node: settlement,
          cursor: settlement.id,
        })),
        pageInfo: {
          hasNextPage: skip + limit < totalCount,
          hasPreviousPage: page > 1,
          startCursor: settlements[0]?.id || null,
          endCursor: settlements.at(-1)?.id || null,
        },
        totalCount,
      };
    },
    myPayouts: async (
      _parent: unknown,
      args: { pagination?: { limit?: number; page?: number } },
      context: GraphQLContext,
    ) => {
      context.requireAuth();
      const limit = args.pagination?.limit || 10;
      const page = args.pagination?.page || 1;
      const skip = (page - 1) * limit;
      const rescuer = await prisma.volunteer.findUnique({
        where: { userId: context.user.id },
      });
      if (!rescuer) {
        return {
          edges: [],
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: null,
            endCursor: null,
          },
          totalCount: 0,
        };
      }
      const where = { rescuerId: rescuer.id };
      const [payouts, totalCount] = await Promise.all([
        prisma.payout.findMany({
          where,
          take: limit,
          skip,
          include: {
            settlement: {
              include: {
                rescueCharge: {
                  include: { rescue: { include: { user: true } } },
                },
              },
            },
          },
          orderBy: { requestedAt: 'desc' },
        }),
        prisma.payout.count({ where }),
      ]);
      const enrichedPayouts = await enrichPayouts(payouts);
      return {
        edges: enrichedPayouts.map((payout) => ({
          node: payout,
          cursor: payout.id,
        })),
        pageInfo: {
          hasNextPage: skip + limit < totalCount,
          hasPreviousPage: page > 1,
          startCursor: payouts[0]?.id || null,
          endCursor: payouts.at(-1)?.id || null,
        },
        totalCount,
      };
    },
    myRescuePaymentIntent: async (
      _parent: unknown,
      args: { rescueId: string },
      context: GraphQLContext,
    ) => {
      context.requireAuth();
      const paymentIntent = await prisma.paymentIntent.findFirst({
        where: {
          rescueCharge: {
            rescueId: args.rescueId,
            rescue: { userId: context.user.id },
          },
        },
        include: { rescueCharge: { select: { rescueId: true } } },
      });
      if (
        process.env.PAYMENT_DEMO_MODE === 'true' &&
        process.env.NODE_ENV !== 'production' &&
        paymentIntent?.status === 'SUCCEEDED' &&
        paymentIntent.rescueCharge
      ) {
        const completed = await prisma.rescueRequest.updateMany({
          where: {
            id: paymentIntent.rescueCharge.rescueId,
            status: { not: 'COMPLETED' },
          },
          data: {
            status: 'COMPLETED',
            completedAt: new Date(),
            outcome: 'RESCUED_RELOCATED',
          },
        });
        if (completed.count > 0) {
          await prisma.rescueTimeline.create({
            data: {
              rescueId: paymentIntent.rescueCharge.rescueId,
              event: 'RESCUE_COMPLETED',
              description: 'Demo rescue completed after demo payment',
              userId: context.user.id,
              metadata: { demo: true },
            },
          });
        }
      }
      return paymentIntent;
    },
    assignedRescuePaymentIntent: async (
      _parent: unknown,
      args: { rescueId: string },
      context: GraphQLContext,
    ) => {
      context.requireAuth();
      context.requireRole([
        'VOLUNTEER',
        'VERIFIED_RESCUER',
        'DISTRICT_COORDINATOR',
      ]);
      return prisma.paymentIntent.findFirst({
        where: {
          rescueCharge: {
            rescueId: args.rescueId,
            rescue: {
              assignedVolunteer: { userId: context.user.id },
            },
          },
        },
      });
    },
    stripeConnectionStatus: async (
      ...[, ,]: [unknown, unknown, GraphQLContext]
    ) => {
      const service = new PaymentsService();
      const resolver = new PaymentsResolver(service);
      return resolver.stripeConnectionStatus();
    },
  },
  Settlement: {
    rescuerName: (settlement: { rescuer?: { name: string } | null }) =>
      settlement.rescuer?.name || 'Unknown rescuer',
    citizenName: (settlement: {
      rescueCharge?: {
        rescue?: { user?: { name: string } | null; name: string } | null;
      } | null;
    }) =>
      settlement.rescueCharge?.rescue?.user?.name ||
      settlement.rescueCharge?.rescue?.name ||
      'Unknown citizen',
    grossAmount: (settlement: {
      rescueCharge?: { grossAmount: unknown } | null;
    }) => String(settlement.rescueCharge?.grossAmount || '0'),
    commissionRate: (settlement: {
      rescueCharge?: { platformCommissionRate: unknown } | null;
    }) => String(settlement.rescueCharge?.platformCommissionRate || '0'),
    commissionAmount: (settlement: {
      rescueCharge?: { platformCommissionAmount: unknown } | null;
    }) => String(settlement.rescueCharge?.platformCommissionAmount || '0'),
    rescuerAmount: (settlement: {
      rescueCharge?: { rescuerAmount: unknown } | null;
    }) => String(settlement.rescueCharge?.rescuerAmount || '0'),
  },
  Payout: {
    rescuerName: (payout: { rescuerName?: string }) =>
      payout.rescuerName || 'Unknown rescuer',
    citizenName: (payout: {
      settlement?: {
        rescueCharge?: {
          rescue?: { user?: { name: string } | null; name: string } | null;
        } | null;
      } | null;
    }) =>
      payout.settlement?.rescueCharge?.rescue?.user?.name ||
      payout.settlement?.rescueCharge?.rescue?.name ||
      'Unknown citizen',
  },
  Mutation: {
    startPayment: async (
      _parent: unknown,
      args: { input: StartPaymentInput },
      context: GraphQLContext,
    ) => {
      context.requireAuth();
      const paymentIntents = new PaymentIntentService(prisma);
      const intent = await paymentIntents.findById(args.input.paymentIntentId);
      if (!intent) throw new Error('Payment intent not found');
      const demoMode =
        process.env.PAYMENT_DEMO_MODE === 'true' &&
        process.env.NODE_ENV !== 'production';
      if (args.input.amount && !(demoMode && intent.status === 'SUCCEEDED')) {
        await paymentIntents.updateRescueAmount(
          intent.id,
          args.input.amount,
          context.user.id,
        );
      }
      const updatedIntent = args.input.amount
        ? await paymentIntents.findById(intent.id)
        : intent;
      if (demoMode) {
        const demoProviderReference = `demo_${updatedIntent!.id}`;
        if (updatedIntent!.status === 'CREATED') {
          await paymentIntents.transition(
            updatedIntent!.id,
            'REQUIRES_ACTION',
            context.user.id,
            demoProviderReference,
          );
        }
        const demoIntent = await paymentIntents.transition(
          updatedIntent!.id,
          'SUCCEEDED',
          context.user.id,
          demoProviderReference,
        );
        await paymentIntents.finalizeSuccessfulPayment(
          updatedIntent!.id,
          demoProviderReference,
        );
        if (updatedIntent!.rescueChargeId) {
          const rescueCharge = await prisma.rescueCharge.findUnique({
            where: { id: updatedIntent!.rescueChargeId },
            select: { rescueId: true },
          });
          if (rescueCharge) {
            const rescue = await prisma.rescueRequest.findUnique({
              where: { id: rescueCharge.rescueId },
              select: { id: true, status: true },
            });
            if (rescue && rescue.status !== 'COMPLETED') {
              await prisma.rescueRequest.update({
                where: { id: rescue.id },
                data: {
                  status: 'COMPLETED',
                  completedAt: new Date(),
                  outcome: 'RESCUED_RELOCATED',
                },
              });
              await prisma.rescueTimeline.create({
                data: {
                  rescueId: rescue.id,
                  event: 'RESCUE_COMPLETED',
                  description: 'Demo rescue completed after demo payment',
                  userId: context.user.id,
                  metadata: { demo: true },
                },
              });
            }
          }
        }
        return {
          paymentIntent: demoIntent,
          providerReference: demoProviderReference,
          checkoutUrl: null,
        };
      }
      const result = await createConfiguredPaymentProviderService(
        paymentIntents,
      ).initiatePayment(
        updatedIntent!.id,
        updatedIntent!.provider as PaymentProviderName,
        {
          amount: updatedIntent!.amount.toString(),
          currency: updatedIntent!.currency,
          returnUrl: args.input.returnUrl,
        },
        context.user.id,
      );
      return {
        paymentIntent: result.intent,
        providerReference: result.providerReference,
        checkoutUrl: result.checkoutUrl,
      };
    },
    refundPayment: async (
      _parent: unknown,
      args: { input: RefundPaymentInput },
      context: GraphQLContext,
    ) => {
      context.requireAuth();
      context.requireRole(['ADMIN', 'SUPER_ADMIN']);
      const result =
        await createConfiguredPaymentProviderService().refundPayment(
          args.input.paymentIntentId,
          args.input.amount,
          args.input.idempotencyKey,
          context.user.id,
        );
      return result.refund;
    },
    createPayout: async (
      _parent: unknown,
      args: { input: CreatePayoutInput },
      context: GraphQLContext,
    ) => {
      context.requireAuth();
      if (!context.hasRole('ADMIN') && !context.hasRole('SUPER_ADMIN')) {
        const rescuer = await prisma.volunteer.findUnique({
          where: { userId: context.user.id },
          select: { id: true },
        });
        const settlement = rescuer
          ? await prisma.settlement.findFirst({
              where: { id: args.input.settlementId, rescuerId: rescuer.id },
              select: { id: true },
            })
          : null;
        if (!settlement) {
          throw new Error(
            'You can only request payout for your own settlement',
          );
        }
      }
      return new PayoutService(prisma).create({
        ...args.input,
        actorId: context.user.id,
      });
    },
    transitionPayout: async (
      _parent: unknown,
      args: { input: TransitionPayoutInput },
      context: GraphQLContext,
    ) => {
      context.requireAuth();
      context.requireRole(['ADMIN', 'SUPER_ADMIN']);
      return new PayoutService(prisma).transition(
        args.input.payoutId,
        args.input.status,
        context.user.id,
        args.input.externalReference,
        args.input.failureReason,
      );
    },
    createPaymentIntent: async (
      _parent: unknown,
      args: { input: PaymentIntentInput },
      context: GraphQLContext,
    ) => {
      context.requireAuth();
      return new PaymentIntentService(prisma).create({
        ...args.input,
        provider: args.input.provider as PaymentProviderName,
        actorId: context.user.id,
      });
    },
    initiatePayment: async (
      _parent: unknown,
      args: { input: InitiatePaymentInput },
      context: GraphQLContext,
    ) => {
      context.requireAuth();
      const input = args.input;
      const paymentIntents = new PaymentIntentService(prisma);
      const service = createConfiguredPaymentProviderService(paymentIntents);
      const intent = await paymentIntents.create({
        rescueChargeId: input.rescueChargeId,
        donationId: input.donationId,
        provider: input.provider as PaymentProviderName,
        amount: input.amount,
        currency: input.currency,
        idempotencyKey: input.idempotencyKey,
        actorId: context.user.id,
      });
      const result = await service.initiatePayment(
        intent.id,
        input.provider as PaymentProviderName,
        {
          amount: input.amount,
          currency: input.currency || intent.currency,
          returnUrl: input.returnUrl,
        },
        context.user.id,
      );
      return {
        paymentIntent: result.intent,
        providerReference: result.providerReference,
        checkoutUrl: result.checkoutUrl,
      };
    },
    confirmPayment: async (
      _parent: unknown,
      args: { input: ConfirmPaymentInput },
      context: GraphQLContext,
    ) => {
      context.requireAuth();
      const service = createConfiguredPaymentProviderService();
      const result = args.input.paymentIntentId
        ? await service.confirmPayment(
            args.input.paymentIntentId,
            args.input.providerReference,
            context.user.id,
          )
        : await service.confirmPaymentByProviderReference(
            args.input.providerReference,
            context.user.id,
          );
      return result.intent;
    },
  },
};
