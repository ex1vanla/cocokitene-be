// import { Controller, Inject, forwardRef, Get, Post, UseGuards, HttpCode, HttpStatus, Query, Body  } from "@nestjs/common";
// import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
// import { BoardMeetingService } from "./board-meeting.service";
// import { EmailService } from "../emails/email.service";
// import { JwtAuthGuard } from "@shares/guards/jwt-auth.guard";
// import { PermissionEnum } from "@shares/constants";
// import { Permission } from "@shares/decorators/permission.decorator";

// @Controller('board-meetings')
// @ApiTags('board-meetings')
// export class BoardMeetingController {
//     constructor(
//         private readonly boardMeetingService: BoardMeetingService,
//         @Inject(forwardRef(() => EmailService))
//         private readonly emailService: EmailService,
//     ){}

//     @Post('')
//     @UseGuards(JwtAuthGuard)
//     @HttpCode(HttpStatus.CREATED)
//     @ApiBearerAuth()
//     @Permission(PermissionEnum.CREATE_BOARD_MEETING)
//     async createBoardMeeting() {
//         @Body() createMeetingDto:
//     }

// }
