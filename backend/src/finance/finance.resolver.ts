import { Resolver, Query, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import { FinanceService } from './finance.service';
import { FinanceOverview } from './dto/finance-overview.type';

@Resolver()
export class FinanceResolver {
    constructor(private readonly financeService: FinanceService) { }

    @Query(() => FinanceOverview)
    @UseGuards(JwtAuthGuard)
    async getFinanceDashboard(@Context() context): Promise<FinanceOverview> {
        const userPublicId = context.req.user.public_id;
        return this.financeService.getFinanceDashboard(userPublicId);
    }
}
