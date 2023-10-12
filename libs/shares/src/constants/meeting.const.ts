export enum UserMeetingStatusEnum {
    PARTICIPATE = 'participate',
    ABSENCE = 'absence',
}

export enum MeetingFileType {
    MEETING_INVITATION = 'invitations',
    MEETING_MINUTES = 'minutes',
    REPORTS = 'reports',
}
export enum MeetingType {
    FUTURE = 'future',
    PASS = 'pass',
}

export enum StatusMeeting {
    NOT_HAPPEN = '0',
    HAPPENING = '1',
    HAPPENED = '2',
    CANCELED = '3',
    DELAYED = '4',
}

export enum MeetingRole {
    HOST = 'host',
    CONTROL_BOARD = 'control_board',
    DIRECTOR = 'director',
    ADMINISTRATIVE_COUNCIL = 'administrative_council',
    SHAREHOLDER = 'shareholder',
}

export enum UserJoinMeetingStatusEnum {
    USER_JOIN_WHEN_MEETING_IS_NOT_START = 0,
    USER_JOIN_MEETING_WHEN_MEETING_START_A_LITTLE = 1,
    MEETING_WAS_CANCEL = 2,
    MEETING_WAS_DELAYED = 3,
}
