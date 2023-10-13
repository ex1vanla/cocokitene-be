import {
    Controller,
    Delete,
    HttpCode,
    HttpStatus,
    Param,
    Query,
    UseGuards,
} from '@nestjs/common'
import { MeetingFileService } from '@api/modules/meeting-files/meeting-file.service'
import { JwtAuthGuard } from '@shares/guards/jwt-auth.guard'
import { Permission } from '@shares/decorators/permission.decorator'
import { PermissionEnum } from '@shares/constants'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { UserScope } from '@shares/decorators/user.decorator'
import { User } from '@entities/user.entity'
import { TypeMeetingFileDto } from '@dtos/meeting-file.dto'

@Controller('meeting-files')
@ApiTags('meeting-files')
export class MeetingFileController {
    constructor(private readonly meetingFileService: MeetingFileService) {}
    @Delete('/delete/:meetingFileId')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @Permission(PermissionEnum.DELETE_PROPOSAL)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    async deleteFile(
        @Param('meetingFileId') meetingFileId: number,
        @Query() typeMeetingFileDto: TypeMeetingFileDto,
        @UserScope() user: User,
    ) {
        const userId = user?.id,
            companyId = user?.companyId
        const result = await this.meetingFileService.deleteMeetingFile(
            userId,
            companyId,
            meetingFileId,
            typeMeetingFileDto,
        )
        return result
    }
}
