import { Resolver, Query, Subscription, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { DashboardService } from './dashboard.service';
import { DashboardStatsType } from './dto/dashboard-stats.type';
import { InvoiceChartData } from './dto/invoice-chart.type';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

const pubSub = new PubSub();

@Resolver(() => DashboardStatsType)
export class DashboardResolver {
  // Static reference to access service in subscription resolve (decorator context)
  static dashboardServiceStatic: DashboardService;

  constructor(private readonly dashboardService: DashboardService) {
    DashboardResolver.dashboardServiceStatic = dashboardService;
    void this.startStatsStreaming();
  }

  @Query(() => DashboardStatsType)
  @UseGuards(JwtAuthGuard)
  async dashboardStats(@Context() context) {
    const userPublicId = context.req.user.public_id;
    return this.dashboardService.getUserStats(userPublicId);
  }

  @Query(() => InvoiceChartData)
  @UseGuards(JwtAuthGuard)
  async invoiceCharts(@Context() context) {
    const userPublicId = context.req.user.public_id;
    return this.dashboardService.getInvoiceCharts(userPublicId);
  }

  @Subscription(() => DashboardStatsType, {
    resolve: async (payload, args, context) => {
      const service = DashboardResolver.dashboardServiceStatic;
      // JwtAuthGuard for subscription puts user in context.req or context.connection.context
      // We need to check both or handle depending on how guard attaches it
      const user = context.req?.user || context.connection?.context?.user || context.user;

      if (service && user?.public_id) {
        return await service.getUserStats(user.public_id);
      }
      return payload.dashboardStatsUpdated;
    },
  })
  @UseGuards(JwtAuthGuard)
  dashboardStatsUpdated() {
    return pubSub.asyncIterableIterator('dashboardStatsUpdated');
  }

  private startStatsStreaming() {
    setInterval(() => {
      // Trigger update for all subscribers
      void pubSub.publish('dashboardStatsUpdated', {
        dashboardStatsUpdated: { id: 'trigger', timestamp: new Date() },
      });
    }, 3000);
  }
}
