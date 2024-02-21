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
import {
    CONTRACT_TYPE,
    SupportedChainId,
    TRANSACTION_STATUS,
    TRANSACTION_TYPE,
} from '@shares/constants'
import { httpErrors } from '@shares/exception-filter'
import { ParticipantMeetingTransactionRepository } from '@repositories/participant-meeting-transaction.repository'
import { ProposalTransactionRepository } from '@repositories/proposal-transaction.repository'
import { FileOfProposalTransactionRepository } from '@repositories/file-of-proposal-transaction.repository'
import configuration from '@shares/config/configuration'
import {
    dateTimeToEpochTime,
    getChainId,
    getContractAddress,
    groupObject,
    sendCreateMeetingTransaction,
    sendUpdateFileMeetingTransaction,
    sendUpdateParticipantMeetingTransaction,
    sendUpdateProposalMeetingTransaction,
} from '@shares/utils'
import { TransactionResponseData } from '@dtos/mapper.dto'

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
        if (!listMeetingEnd || listMeetingEnd?.length == 0) {
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
                            proposalId = proposal.id,
                            titleProposal = proposal.title

                        listResultProposals.push({
                            meetingId: meeting.id,
                            titleProposal: titleProposal,
                            proposalId: proposalId,
                            votedQuantity: votedQuantity,
                            unVotedQuantity: unVotedQuantity,
                            notVoteYetQuantity: notVoteYetQuantity,
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
                                    meetingId: meeting.id,
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
                            meetingId: meeting.id,
                            userId: host.user.id,
                            username: host.user.username,
                            role: MeetingRole.HOST,
                            status: host.status,
                        }),
                    ),
                    ...controlBoards.map((controlBoard) =>
                        participants.push({
                            meetingId: meeting.id,

                            userId: controlBoard.user.id,
                            username: controlBoard.user.username,
                            role: MeetingRole.CONTROL_BOARD,
                            status: controlBoard.status,
                        }),
                    ),
                    ...directors.map((director) =>
                        participants.push({
                            meetingId: meeting.id,

                            userId: director.user.id,
                            username: director.user.username,
                            role: MeetingRole.DIRECTOR,
                            status: director.status,
                        }),
                    ),
                    ...administrativeCouncils.map((administrativeCouncil) =>
                        participants.push({
                            meetingId: meeting.id,
                            userId: administrativeCouncil.user.id,
                            username: administrativeCouncil.user.username,
                            role: MeetingRole.ADMINISTRATIVE_COUNCIL,
                            status: administrativeCouncil.status,
                        }),
                    ),
                    ...shareholders.map((shareholder) =>
                        participants.push({
                            meetingId: meeting.id,
                            userId: shareholder.user.id,
                            username: shareholder.user.username,
                            role: MeetingRole.SHAREHOLDER,
                            status: shareholder.status,
                        }),
                    ),
                ])
                const meetingEnd: MeetingEnded = {
                    meetingId: meeting.id,
                    companyId: companyId,
                    titleMeeting: meeting.title,
                    meetingLink: meeting.meetingLink,
                    startTimeMeeting: dateTimeToEpochTime(meeting.startTime),
                    endTimeMeeting: dateTimeToEpochTime(meeting.endTime),
                    participants: participants,
                    listResultProposals: listResultProposals,
                    listResultProposalFiles: listResultProposalFiles,
                    shareholdersTotal: shareholdersTotal,
                    shareholdersJoined: shareholdersJoined,
                    joinedMeetingShares: joinedMeetingShares,
                    totalMeetingShares: totalMeetingShares,
                }
                // get current chain Id
                const currentChainId = getChainId()
                try {
                    await this.transactionRepository.createTransaction({
                        meetingId: meetingEnd.meetingId,
                        titleMeeting: meetingEnd.titleMeeting,
                        meetingLink: meetingEnd.meetingLink,
                        totalMeetingShares: meetingEnd.totalMeetingShares,
                        joinedMeetingShares: meetingEnd.joinedMeetingShares,
                        shareholdersTotal: meetingEnd.shareholdersTotal,
                        shareholdersJoined: meetingEnd.shareholdersJoined,
                        startTimeMeeting: meetingEnd.startTimeMeeting,
                        endTimeMeeting: meetingEnd.endTimeMeeting,
                        companyId: meetingEnd.companyId,
                        chainId: currentChainId,
                        type: TRANSACTION_TYPE.CREATE_MEETING,
                        contractAddress: getContractAddress({
                            type: CONTRACT_TYPE.MEETING,
                            chainId: currentChainId,
                        }),
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
                                    meetingId: participant.meetingId,
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
                                        meetingId: meetingEnd.meetingId,
                                        titleProposal:
                                            listResultProposal.titleProposal,
                                        title: listResultProposal.titleProposal,
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
                                        meetingId: meetingEnd.meetingId,
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

    async handleDataAfterEventSuccessfulCreatedMeeting() {
        const transactionsCreateMeetingSuccessful =
            await this.transactionRepository.getTransactionsCreateMeetingSuccessful()

        if (
            !transactionsCreateMeetingSuccessful ||
            transactionsCreateMeetingSuccessful?.length == 0
        ) {
            console.log(
                'No meeting creation event has been successful: ' + new Date(),
            )
            return
        }

        const maximumNumberTransactionCallFuncBlockchain =
                configuration().transaction
                    .maximumNumberTransactionPerCallFuncBlockchain,
            currentChainId = getChainId()
        await Promise.all([
            ...transactionsCreateMeetingSuccessful.map(async (transaction) => {
                const [proposals, fileOfProposals, participants] =
                    await Promise.all([
                        this.proposalTransactionRepository.getProposalTransactionsByMeetingId(
                            transaction.meetingId,
                        ),
                        this.fileOfProposalTransactionRepository.getFileOfProposalTransactionsByMeetingId(
                            transaction.meetingId,
                        ),
                        this.participantMeetingTransactionRepository.getParticipantsMeetingTransactionsByMeetingId(
                            transaction.meetingId,
                        ),
                    ])

                const countCallFuncAddProposals = Math.ceil(
                        proposals.length /
                            maximumNumberTransactionCallFuncBlockchain,
                    ),
                    countCallFuncFileOfProposal = Math.ceil(
                        fileOfProposals.length /
                            maximumNumberTransactionCallFuncBlockchain,
                    ),
                    countCallFuncParticipant = Math.ceil(
                        participants.length /
                            maximumNumberTransactionCallFuncBlockchain,
                    )
                const addProposalsPromises = []
                const fileOfProposalPromises = []
                const participantPromises = []
                for (let i = 0; i < countCallFuncAddProposals; i++) {
                    addProposalsPromises.push(
                        this.createTransactionSecondaryAndUpdate(
                            TRANSACTION_TYPE.UPDATE_PROPOSAL_MEETING,
                            transaction,
                            currentChainId,
                        ),
                    )
                }
                for (let i = 0; i < countCallFuncFileOfProposal; i++) {
                    fileOfProposalPromises.push(
                        this.createTransactionSecondaryAndUpdate(
                            TRANSACTION_TYPE.UPDATE_FILE_PROPOSAL_MEETING,
                            transaction,
                            currentChainId,
                        ),
                    )
                }
                for (let i = 0; i < countCallFuncParticipant; i++) {
                    participantPromises.push(
                        this.createTransactionSecondaryAndUpdate(
                            TRANSACTION_TYPE.UPDATE_USER_PARTICIPATE_MEETING,
                            transaction,
                            currentChainId,
                        ),
                    )
                }
                await Promise.all([
                    ...addProposalsPromises,
                    ...fileOfProposalPromises,
                    ...participantPromises,
                ])
            }),
        ])
    }

    async createTransactionSecondaryAndUpdate(
        type: TRANSACTION_TYPE,
        transaction: TransactionResponseData,
        chainId: SupportedChainId,
    ) {
        try {
            await this.transactionRepository.createTransaction({
                meetingId: transaction.meetingId,
                titleMeeting: transaction.titleMeeting,
                meetingLink: transaction.meetingLink,
                totalMeetingShares: transaction.totalMeetingShares,
                joinedMeetingShares: transaction.joinedMeetingShares,
                shareholdersTotal: transaction.shareholdersTotal,
                shareholdersJoined: transaction.shareholdersJoined,
                startTimeMeeting: transaction.startTimeMeeting,
                endTimeMeeting: transaction.endTimeMeeting,
                companyId: transaction.companyId,
                chainId: chainId,
                type: type,
                contractAddress: getContractAddress({
                    type: CONTRACT_TYPE.MEETING,
                    chainId: chainId,
                }),
            })
        } catch (error) {
            switch (type) {
                case TRANSACTION_TYPE.UPDATE_PROPOSAL_MEETING:
                    throw new HttpException(
                        httpErrors.TRANSACTION_CREATE_PROPOSAL_FAILED,
                        HttpStatus.INTERNAL_SERVER_ERROR,
                    )
                    break
                case TRANSACTION_TYPE.UPDATE_USER_PARTICIPATE_MEETING:
                    throw new HttpException(
                        httpErrors.TRANSACTION_CREATE_PARTICIPANT_MEETING_FAILED,
                        HttpStatus.INTERNAL_SERVER_ERROR,
                    )
                    break
                case TRANSACTION_TYPE.UPDATE_FILE_PROPOSAL_MEETING:
                    throw new HttpException(
                        httpErrors.TRANSACTION_CREATE_FILE_OF_PROPOSAL_FAILED,
                        HttpStatus.INTERNAL_SERVER_ERROR,
                    )
                    break
                default:
                    throw new HttpException(
                        {
                            message: error.message,
                        },
                        HttpStatus.INTERNAL_SERVER_ERROR,
                    )
            }
        }
    }
    async handleCheckTransaction() {
        const transactionsList =
            await this.transactionRepository.findTransactionByStatus(
                TRANSACTION_STATUS.PENDING,
            )
        if (!transactionsList || transactionsList?.length === 0) {
            console.log('No transactions found: ' + new Date())
            return
        }
        //get current chainId

        const maximumNumberTransactionCallFuncBlockchain =
            configuration().transaction
                .maximumNumberTransactionPerCallFuncBlockchain
        const txPromises = []
        for (const transaction of transactionsList) {
            if (transaction.type === TRANSACTION_TYPE.CREATE_MEETING) {
                txPromises.push(
                    sendCreateMeetingTransaction({
                        meetingId: transaction.meetingId,
                        titleMeeting: transaction.titleMeeting,
                        startTimeMeeting: transaction.startTimeMeeting,
                        endTimeMeeting: transaction.endTimeMeeting,
                        meetingLink: transaction.meetingLink,
                        companyId: transaction.companyId,
                        chainId: transaction.chainId,
                        shareholdersJoined: transaction.shareholdersJoined,
                        shareholdersTotal: transaction.shareholdersTotal,
                        joinedMeetingShares: transaction.joinedMeetingShares,
                        totalMeetingShares: transaction.totalMeetingShares,
                        contractAddress: transaction.contractAddress,
                    }),
                )
            }
            if (transaction.type === TRANSACTION_TYPE.UPDATE_PROPOSAL_MEETING) {
                const proposals =
                    await this.proposalTransactionRepository.getProposalTransactionsByMeetingId(
                        transaction.meetingId,
                    )
                const groupedProposals = groupObject(
                    proposals,
                    maximumNumberTransactionCallFuncBlockchain,
                )
                const countCallFuncAddProposals = Math.ceil(
                    proposals.length /
                        maximumNumberTransactionCallFuncBlockchain,
                )
                for (let i = 1; i <= countCallFuncAddProposals; i++) {
                    txPromises.push(
                        sendUpdateProposalMeetingTransaction({
                            meetingId: transaction.meetingId,
                            chainId: transaction.chainId,
                            contractAddress: transaction.contractAddress,
                            newProposalData: groupedProposals[i - 1],
                            countProcessNumber: i,
                        }),
                    )
                }
            }
            if (
                transaction.type ===
                TRANSACTION_TYPE.UPDATE_FILE_PROPOSAL_MEETING
            ) {
                const fileOfProposals =
                    await this.fileOfProposalTransactionRepository.getFileOfProposalTransactionsByMeetingId(
                        transaction.meetingId,
                    )
                const groupedFileOfProposals = groupObject(
                    fileOfProposals,
                    maximumNumberTransactionCallFuncBlockchain,
                )
                const countCallFuncFileOfProposal = Math.ceil(
                    fileOfProposals.length /
                        maximumNumberTransactionCallFuncBlockchain,
                )
                for (let i = 1; i <= countCallFuncFileOfProposal; i++) {
                    txPromises.push(
                        sendUpdateFileMeetingTransaction({
                            meetingId: transaction.meetingId,
                            chainId: transaction.chainId,
                            contractAddress: transaction.contractAddress,
                            newFileOfProposalData:
                                groupedFileOfProposals[i - 1],
                            countProcessNumber: i,
                        }),
                    )
                }
            }
            if (
                transaction.type ===
                TRANSACTION_TYPE.UPDATE_USER_PARTICIPATE_MEETING
            ) {
                const participantMeetingTransactions =
                    await this.participantMeetingTransactionRepository.getParticipantsMeetingTransactionsByMeetingId(
                        transaction.meetingId,
                    )
                const groupedParticipantMeetings = groupObject(
                    participantMeetingTransactions,
                    maximumNumberTransactionCallFuncBlockchain,
                )
                const countCallFuncParticipant = Math.ceil(
                    participantMeetingTransactions.length /
                        maximumNumberTransactionCallFuncBlockchain,
                )
                for (let i = 1; i <= countCallFuncParticipant; i++) {
                    txPromises.push(
                        sendUpdateParticipantMeetingTransaction({
                            meetingId: transaction.meetingId,
                            chainId: transaction.chainId,
                            contractAddress: transaction.contractAddress,
                            newUserParticipateMeetingData:
                                groupedParticipantMeetings[i - 1],
                            countProcessNumber: i,
                        }),
                    )
                }
            }
        }

        console.log('Starting sending transation..........')
        const txResults = await Promise.all(txPromises)
        // update status transaction
        if (txResults && txResults.length > 0) {
            const updateTransactionPromises = []
            txResults.map((txResult, index) => {
                if (txResult) {
                    console.log(
                        'Sent transaction: ' + txResult?.transactionHash,
                    )
                    updateTransactionPromises.push(
                        this.transactionRepository.updateTransaction(
                            transactionsList[index].id,
                            {
                                txHash: txResult?.transactionHash,
                                status: TRANSACTION_STATUS.PROCESSING,
                            },
                        ),
                    )
                }
            })
            await Promise.all(updateTransactionPromises)
        }
    }
}
