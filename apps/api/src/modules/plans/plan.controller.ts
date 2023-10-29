import { Controller } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

@Controller('plans')
@ApiTags('plans')
export class PlanController {}
