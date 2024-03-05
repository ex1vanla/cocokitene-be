import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { RegisterCompanyDto } from '@dtos/company.dto'
import { EmailService } from '@api/modules/emails/email.service'

@Controller('companys')
@ApiTags('companys')
export class CompanyController {
    constructor(private readonly emailService: EmailService) {}

    @Post('/register-company')
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    async sendEmailRegisterCompany(
        @Body() registerCompanyDto: RegisterCompanyDto,
    ) {
        await this.emailService.sendEmailRegisterCompany(registerCompanyDto)
        return 'Emails  register information company send to system admin successfully'
    }
}
