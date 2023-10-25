import { ApiTags } from '@nestjs/swagger'
import { Controller } from '@nestjs/common'

@Controller('company-status')
@ApiTags('company-status')
export class CompanyStatusController {}
