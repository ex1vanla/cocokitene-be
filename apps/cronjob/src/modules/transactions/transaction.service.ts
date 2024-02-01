import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import {
    ListFileOfProposal,
    MeetingEnded,
    participant,
    ResultVoteProposal,
} from '../cronjob/cronjob.interface'
import {
    MeetingRole,
    StatusMeeting,
    UserMeetingStatusEnum,
} from '@shares/constants/meeting.const'
import { enumToArray } from '@shares/utils/enum'
import { MeetingRepository } from '@repositories/meeting.repository'
import { UserMeetingRepository } from '@repositories/user-meeting.repository'
import { ProposalRepository } from '@repositories/proposal.repository'
import { ProposalFileRepository } from '@repositories/proposal-file.repository'
import { TransactionRepository } from '@repositories/transaction.repository'
import { SupportedChainId } from '@shares/constants'
import { httpErrors } from '@shares/exception-filter'
import { ParticipantMeetingTransactionRepository } from '@repositories/participant-meeting-transaction.repository'
import { ProposalTransactionRepository } from '@repositories/proposal-transaction.repository'
import { FileOfProposalTransactionRepository } from '@repositories/file-of-proposal-transaction.repository'
import { Transaction } from '@entities/transaction.entity'

@Injectable()
export class TransactionService {
    constructor(
        private readonly meetingRepository: MeetingRepository,
        private readonly userMeetingRepository: UserMeetingRepository,
        private readonly proposalRepository: ProposalRepository,
        private readonly proposalFileRepository: ProposalFileRepository,
        private readonly transactionRepository: TransactionRepository,
        private readonly participantMeetingTransactionRepository: ParticipantMeetingTransactionRepository,
        private readonly proposalTransactionRepository: ProposalTransactionRepository,
        private readonly fileOfProposalTransactionRepository: FileOfProposalTransactionRepository,
    ) {}
    async handleAllEndedMeeting(): Promise<void> {
        const meetingIdsAppearedInTransaction =
            await this.transactionRepository.getMeetingIdsWithTransactions()
        const listMeetingEnd =
            await this.meetingRepository.findMeetingByStatusAndEndTimeVoting(
                StatusMeeting.HAPPENED,
                meetingIdsAppearedInTransaction,
            )
        console.log(listMeetingEnd.length)
        if (!listMeetingEnd || listMeetingEnd.length == 0) {
            console.log('No meeting ends found: ' + new Date())
            return
        }
        await Promise.all([
            ...listMeetingEnd.map(async (meeting) => {
                const companyId = meeting.companyId
                const listProposal =
                    await this.proposalRepository.getInternalListProposalByMeetingId(
                        meeting.id,
                    )

                const listResultProposalFiles: ListFileOfProposal[] = [],
                    listResultProposals: ResultVoteProposal[] = []

                await Promise.all([
                    ...listProposal.map(async (proposal) => {
                        const votedQuantity = proposal.votedQuantity,
                            unVotedQuantity = proposal.unVotedQuantity,
                            notVoteYetQuantity = proposal.notVoteYetQuantity,
                            proposalId = proposal.id

                        listResultProposals.push({
                            proposalId,
                            votedQuantity,
                            unVotedQuantity,
                            notVoteYetQuantity,
                        })

                        const listProposalFile =
                            await this.proposalFileRepository.getInternalListProposalFileByProposalId(
                                proposal.id,
                            )
                        await Promise.all([
                            ...listProposalFile.map((item) => {
                                const proposalFileId = item.id,
                                    proposalId = item.proposalId,
                                    url = item.url
                                listResultProposalFiles.push({
                                    proposalFileId: proposalFileId,
                                    proposalId: proposalId,
                                    url: url,
                                })
                            }),
                        ])
                    }),
                ])

                const [
                    hosts,
                    controlBoards,
                    directors,
                    administrativeCouncils,
                    shareholders,
                ] = await Promise.all(
                    enumToArray(MeetingRole).map((role) =>
                        this.userMeetingRepository.getUserMeetingByMeetingIdAndRole(
                            meeting.id,
                            role,
                        ),
                    ),
                )
                const shareholdersTotal = shareholders.length
                const shareholdersJoined = shareholders.reduce(
                    (accumulator, currentValue) => {
                        accumulator =
                            currentValue.status ===
                            UserMeetingStatusEnum.PARTICIPATE
                                ? accumulator + 1
                                : accumulator
                        return accumulator
                    },
                    0,
                )
                const totalMeetingShares = shareholders.reduce(
                    (accumulator, currentValue) => {
                        accumulator += Number(currentValue.user.shareQuantity)
                        return accumulator
                    },
                    0,
                )

                const joinedMeetingShares = shareholders.reduce(
                    (accumulator, currentValue) => {
                        accumulator =
                            currentValue.status ===
                            UserMeetingStatusEnum.PARTICIPATE
                                ? accumulator +
                                  Number(currentValue.user.shareQuantity)
                                : accumulator
                        return accumulator
                    },
                    0,
                )

                const participants: participant[] = []
                await Promise.all([
                    ...hosts.map((host) =>
                        participants.push({
                            userId: host.user.id,
                            username: host.user.username,
                            role: MeetingRole.HOST,
                            status: host.status,
                        }),
                    ),
                    ...controlBoards.map((controlBoard) =>
                        participants.push({
                            userId: controlBoard.user.id,
                            username: controlBoard.user.username,
                            role: MeetingRole.CONTROL_BOARD,
                            status: controlBoard.status,
                        }),
                    ),
                    ...directors.map((director) =>
                        participants.push({
                            userId: director.user.id,
                            username: director.user.username,
                            role: MeetingRole.DIRECTOR,
                            status: director.status,
                        }),
                    ),
                    ...administrativeCouncils.map((administrativeCouncil) =>
                        participants.push({
                            userId: administrativeCouncil.user.id,
                            username: administrativeCouncil.user.username,
                            role: MeetingRole.ADMINISTRATIVE_COUNCIL,
                            status: administrativeCouncil.status,
                        }),
                    ),
                    ...shareholders.map((shareholder) =>
                        participants.push({
                            userId: shareholder.user.id,
                            username: shareholder.user.username,
                            role: MeetingRole.SHAREHOLDER,
                            status: shareholder.status,
                        }),
                    ),
                ])
                const meetingEnd: MeetingEnded = {
                    id: meeting.id,
                    companyId: companyId,
                    titleMeeting: meeting.title,
                    participants: participants,
                    listResultProposals: listResultProposals,
                    listResultProposalFiles: listResultProposalFiles,
                    shareholdersTotal: shareholdersTotal,
                    shareholdersJoined: shareholdersJoined,
                    joinedMeetingShares: joinedMeetingShares,
                    totalMeetingShares: totalMeetingShares,
                }
                let createdTransaction: Transaction
                try {
                    createdTransaction =
                        await this.transactionRepository.createTransaction({
                            meetingId: meetingEnd.id,
                            titleMeeting: meetingEnd.titleMeeting,
                            totalMeetingShares: meetingEnd.totalMeetingShares,
                            joinedMeetingShares: meetingEnd.joinedMeetingShares,
                            shareholdersTotal: meetingEnd.shareholdersTotal,
                            shareholdersJoined: meetingEnd.shareholdersJoined,
                            companyId: meetingEnd.companyId,
                            chainId: SupportedChainId.SEPOLIA,
                        })
                } catch (error) {
                    throw new HttpException(
                        httpErrors.TRANSACTION_CREATE_FAILED,
                        HttpStatus.INTERNAL_SERVER_ERROR,
                    )
                }
                try {
                    await Promise.all([
                        ...meetingEnd.participants.map((participant) =>
                            this.participantMeetingTransactionRepository.createParticipantMeetingTransaction(
                                {
                                    userId: participant.userId,
                                    username: participant.username,
                                    status: participant.status,
                                    role: participant.role,
                                },
                            ),
                        ),
                        ...meetingEnd.listResultProposals.map(
                            (listResultProposal) =>
                                this.proposalTransactionRepository.createProposalTransaction(
                                    {
                                        proposalId:
                                            listResultProposal.proposalId,
                                        transactionId: createdTransaction.id,
                                        votedQuantity:
                                            listResultProposal.votedQuantity ??
                                            0,
                                        unVotedQuantity:
                                            listResultProposal.unVotedQuantity ??
                                            0,
                                        notVoteYetQuantity:
                                            listResultProposal.notVoteYetQuantity ??
                                            0,
                                    },
                                ),
                        ),
                        ...meetingEnd.listResultProposalFiles.map(
                            (listResultProposalFile) =>
                                this.fileOfProposalTransactionRepository.createFileOfProposalTransaction(
                                    {
                                        url: listResultProposalFile.url,
                                        transactionId: createdTransaction.id,
                                        proposalId:
                                            listResultProposalFile.proposalId,
                                        proposalFileId:
                                            listResultProposalFile.proposalFileId,
                                    },
                                ),
                        ),
                    ])
                } catch (error) {
                    throw new HttpException(
                        { message: error.message },
                        HttpStatus.INTERNAL_SERVER_ERROR,
                    )
                }
            }),
        ])
    }
}
