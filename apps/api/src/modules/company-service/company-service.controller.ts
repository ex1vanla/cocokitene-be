import { User } from '@entities/user.entity'
import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { PermissionEnum } from '@shares/constants'
import { Permission } from '@shares/decorators/permission.decorator'
import { UserScope } from '@shares/decorators/user.decorator'
import { JwtAuthGuard } from '@shares/guards/jwt-auth.guard'
import { ServicePlanOfCompanyService } from './company-service.service'
import { SubscriptionServiceDto } from '@dtos/service-subscription.dto'

@Controller('company-service')
@ApiTags('company-service')
export class CompanyServiceController {
    constructor(
        private readonly servicePlanOfCompanyService: ServicePlanOfCompanyService,
    ) {}

    @Get('/')
    @UseGuards(JwtAuthGuard)
    @Permission(PermissionEnum.SUPER_ADMIN_PERMISSION)
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    async getCompanyServicePlanByCompanyId(@UserScope() user: User) {
        const companyId = user.companyId

        const servicePlanOfCompany =
            await this.servicePlanOfCompanyService.getServicePlanOfCompany(
                companyId,
            )

        return servicePlanOfCompany
    }

    @Post('/subscription')
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Permission(PermissionEnum.SUPER_ADMIN_PERMISSION)
    async subscriptionServicePlanForCompany(
        @Body() subscriptionServicePlanDto: SubscriptionServiceDto,
    ) {
        const subscriptionServicePlan =
            await this.servicePlanOfCompanyService.subscriptionServicePlanForCompany(
                subscriptionServicePlanDto,
            )

        return subscriptionServicePlan
    }
}
