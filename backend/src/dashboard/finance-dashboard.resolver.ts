import { Resolver, Query, Subscription, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { GraphQLContext } from '../auth/types/auth.types';
import { FinanceDashboardService } from './finance-dashboard.service';
import { FinanceDashboard } from '../entities/finance-dashboard.entity';

@Resolver()
export class FinanceDashboardResolver {
  constructor(
    private readonly financeDashboardService: FinanceDashboardService,
  ) {}

  @Query(() => FinanceDashboard)
  @UseGuards(JwtAuthGuard)
  async getFinanceDashboard(
    @Context() context: GraphQLContext,
  ): Promise<FinanceDashboard> {
    const user = context.req.user;
    return await this.financeDashboardService.getFinanceDashboard(
      user.public_id,
    );
  }

  @Subscription(() => FinanceDashboard, {
    name: 'financeDashboardUpdated',
    filter: (payload: any, _variables: any, context: any) => {
      // Only send updates to the user who owns the dashboard
      if (!context.req?.user?.public_id) return false;
      return payload.userPublicId === context.req.user.public_id;
    },
    resolve: (payload: any) => payload.financeDashboardUpdated,
  })
  financeDashboardUpdated() {
    return this.financeDashboardService.getFinanceDashboardSubscription();
  }
}
