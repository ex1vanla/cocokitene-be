import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common'
import {
    ListFileOfMeeting,
    // ListFileOfProposal,
    // MeetingEnded,
    // participant,
    // ResultVoteProposal,
    // ResultVoting,
} from '../cronjob/cronjob.interface'
import {
    // MeetingRole,
    StatusMeeting,
    // UserMeetingStatusEnum,
} from '@shares/constants/meeting.const'
// import { enumToArray } from '@shares/utils/enum'
import { MeetingRepository } from '@repositories/meeting.repository'
import { UserMeetingRepository } from '@repositories/user-meeting.repository'
import { ProposalRepository } from '@repositories/proposal.repository'
// import { ProposalFileRepository } from '@repositories/proposal-file.repository'
import { TransactionRepository } from '@repositories/transaction.repository'
import {
    CONTRACT_TYPE,
    // SupportedChainId,
    TRANSACTION_STATUS,
} from '@shares/constants'
import { httpErrors } from '@shares/exception-filter'
// import { ParticipantMeetingTransactionRepository } from '@repositories/participant-meeting-transaction.repository'
// import { ProposalTransactionRepository } from '@repositories/proposal-transaction.repository'
// import { FileProposalTransactionRepository } from '@repositories/file-proposal-transaction.repository'
// import configuration from '@shares/config/configuration'
import {
    dateTimeToEpochTime,
    getChainId,
    getContractAddress,
    // groupObject,
    sendCreateMeetingTransaction,
} from '@shares/utils'
// import { TransactionResponseData } from '@dtos/mapper.dto'
// import { VotingTransactionRepository } from '@repositories/voting-transaction.repository'
import { VotingRepository } from '@repositories/voting.repository'
import { MeetingFileRepository } from '@repositories/meeting-file.repository'
// import { FileMeetingTransactionRepository } from '@repositories/file-meeting-transaction.repository'
import { Logger } from 'winston'
import { messageBLCLog } from '@shares/exception-filter/message-log-blc-const'
import { CandidateRepository } from '@repositories/candidate.repository'
import { VotingCandidateRepository } from '@repositories/voting-candidate.repository'
import { MeetingService } from '@api/modules/meetings/meeting.service'
import { hashMd5 } from '@shares/utils/md5'

@Injectable()
export class TransactionService {
    constructor(
        private readonly meetingRepository: MeetingRepository,
        private readonly userMeetingRepository: UserMeetingRepository,
        private readonly proposalRepository: ProposalRepository,
        // private readonly proposalFileRepository: ProposalFileRepository,
        private readonly votingRepository: VotingRepository,
        private readonly meetingFileRepository: MeetingFileRepository,
        private readonly transactionRepository: TransactionRepository,
        // private readonly participantMeetingTransactionRepository: ParticipantMeetingTransactionRepository,
        // private readonly proposalTransactionRepository: ProposalTransactionRepository,
        // private readonly fileOfProposalTransactionRepository: FileProposalTransactionRepository,
        // private readonly votingTransactionRepository: VotingTransactionRepository,
        // private readonly fileOfMeetingTransactionRepository: FileMeetingTransactionRepository,
        private readonly candidateRepository: CandidateRepository,
        private readonly votingCandidateRepository: VotingCandidateRepository,
        private readonly meetingService: MeetingService,
        @Inject('winston')
        private readonly logger: Logger, // private readonly myLoggerService: MyLoggerService,
    ) {}
    // async handleAllEndedMeeting_old(): Promise<void> {
    //     const meetingIdsAppearedInTransaction =
    //         await this.transactionRepository.getMeetingIdsWithTransactions()
    //     const listMeetingEnd =
    //         await this.meetingRepository.findMeetingByStatusAndEndTimeVoting(
    //             StatusMeeting.HAPPENED,
    //             meetingIdsAppearedInTransaction,
    //         )
    //     if (!listMeetingEnd || listMeetingEnd?.length == 0) {
    //         console.log('No meeting ends found: ' + new Date())
    //         // this.logger.debug('[BLC] No meetings found')
    //         this.logger.debug(
    //             `${messageBLCLog.NOT_FOUND_MEETING_ENDED.message}`,
    //         )
    //         return
    //     }
    //     await Promise.all([
    //         ...listMeetingEnd.map(async (meeting) => {
    //             const companyId = meeting.companyId
    //             const listProposal =
    //                 await this.proposalRepository.getInternalListProposalByMeetingId(
    //                     meeting.id,
    //                 )
    //             const meetingFiles =
    //                 await this.meetingFileRepository.getMeetingFilesByMeetingId(
    //                     meeting.id,
    //                 )
    //             const listMeetingFiles: ListFileOfMeeting[] = meetingFiles.map(
    //                 (meetingFile) => {
    //                     return {
    //                         meetingId: meetingFile.meetingId,
    //                         meetingFileId: meetingFile.id,
    //                         url: meetingFile.url,
    //                     }
    //                 },
    //             )
    //             const listResultProposalFiles: ListFileOfProposal[] = [],
    //                 listResultProposals: ResultVoteProposal[] = [],
    //                 listResultVotings: ResultVoting[] = []

    //             await Promise.all([
    //                 ...listProposal.map(async (proposal) => {
    //                     const votedQuantity = proposal.votedQuantity,
    //                         unVotedQuantity = proposal.unVotedQuantity,
    //                         notVoteYetQuantity = proposal.notVoteYetQuantity,
    //                         proposalId = proposal.id,
    //                         titleProposal = proposal.title

    //                     listResultProposals.push({
    //                         meetingId: meeting.id,
    //                         titleProposal: titleProposal,
    //                         proposalId: proposalId,
    //                         votedQuantity: votedQuantity,
    //                         unVotedQuantity: unVotedQuantity,
    //                         notVoteYetQuantity: notVoteYetQuantity,
    //                     })

    //                     const [listProposalFile, votings] = await Promise.all([
    //                         this.proposalFileRepository.getInternalListProposalFileByProposalId(
    //                             proposal.id,
    //                         ),
    //                         this.votingRepository.getInternalListVotingByProposalId(
    //                             proposal.id,
    //                         ),
    //                     ])

    //                     await Promise.all([
    //                         ...listProposalFile.map((item) => {
    //                             const proposalFileId = item.id,
    //                                 proposalId = item.proposalId,
    //                                 url = item.url
    //                             listResultProposalFiles.push({
    //                                 meetingId: meeting.id,
    //                                 proposalFileId: proposalFileId,
    //                                 proposalId: proposalId,
    //                                 url: url,
    //                             })
    //                         }),
    //                         ...votings.map((voting) => {
    //                             const userId = voting.userId,
    //                                 result = voting.result,
    //                                 votingId = voting.id
    //                             listResultVotings.push({
    //                                 userId: userId,
    //                                 proposalId: proposal.id,
    //                                 result: result,
    //                                 votingId: votingId,
    //                             })
    //                         }),
    //                     ])
    //                 }),
    //             ])

    //             const [
    //                 hosts,
    //                 controlBoards,
    //                 directors,
    //                 administrativeCouncils,
    //                 shareholders,
    //             ] = await Promise.all(
    //                 enumToArray(MeetingRole).map((role) =>
    //                     this.userMeetingRepository.getUserMeetingByMeetingIdAndRole(
    //                         meeting.id,
    //                         role,
    //                     ),
    //                 ),
    //             )
    //             const shareholdersTotal = shareholders.length
    //             const shareholdersJoined = shareholders.reduce(
    //                 (accumulator, currentValue) => {
    //                     accumulator =
    //                         currentValue.status ===
    //                         UserMeetingStatusEnum.PARTICIPATE
    //                             ? accumulator + 1
    //                             : accumulator
    //                     return accumulator
    //                 },
    //                 0,
    //             )
    //             const totalMeetingShares = shareholders.reduce(
    //                 (accumulator, currentValue) => {
    //                     accumulator += Number(currentValue.user.shareQuantity)
    //                     return accumulator
    //                 },
    //                 0,
    //             )

    //             const joinedMeetingShares = shareholders.reduce(
    //                 (accumulator, currentValue) => {
    //                     accumulator =
    //                         currentValue.status ===
    //                         UserMeetingStatusEnum.PARTICIPATE
    //                             ? accumulator +
    //                               Number(currentValue.user.shareQuantity)
    //                             : accumulator
    //                     return accumulator
    //                 },
    //                 0,
    //             )

    //             const participants: participant[] = []
    //             await Promise.all([
    //                 ...hosts.map((host) =>
    //                     participants.push({
    //                         meetingId: meeting.id,
    //                         userId: host.user.id,
    //                         username: host.user.username,
    //                         role: MeetingRole.HOST,
    //                         status: host.status,
    //                     }),
    //                 ),
    //                 ...controlBoards.map((controlBoard) =>
    //                     participants.push({
    //                         meetingId: meeting.id,

    //                         userId: controlBoard.user.id,
    //                         username: controlBoard.user.username,
    //                         role: MeetingRole.CONTROL_BOARD,
    //                         status: controlBoard.status,
    //                     }),
    //                 ),
    //                 ...directors.map((director) =>
    //                     participants.push({
    //                         meetingId: meeting.id,

    //                         userId: director.user.id,
    //                         username: director.user.username,
    //                         role: MeetingRole.DIRECTOR,
    //                         status: director.status,
    //                     }),
    //                 ),
    //                 ...administrativeCouncils.map((administrativeCouncil) =>
    //                     participants.push({
    //                         meetingId: meeting.id,
    //                         userId: administrativeCouncil.user.id,
    //                         username: administrativeCouncil.user.username,
    //                         role: MeetingRole.ADMINISTRATIVE_COUNCIL,
    //                         status: administrativeCouncil.status,
    //                     }),
    //                 ),
    //                 ...shareholders.map((shareholder) =>
    //                     participants.push({
    //                         meetingId: meeting.id,
    //                         userId: shareholder.user.id,
    //                         username: shareholder.user.username,
    //                         role: MeetingRole.SHAREHOLDER,
    //                         status: shareholder.status,
    //                     }),
    //                 ),
    //             ])
    //             const meetingEnd: MeetingEnded = {
    //                 meetingId: meeting.id,
    //                 companyId: companyId,
    //                 titleMeeting: meeting.title,
    //                 meetingLink: meeting.meetingLink,
    //                 startTimeMeeting: dateTimeToEpochTime(meeting.startTime),
    //                 endTimeMeeting: dateTimeToEpochTime(meeting.endTime),
    //                 participants: participants,
    //                 listResultProposals: listResultProposals,
    //                 listResultProposalFiles: listResultProposalFiles,
    //                 listResultVotings: listResultVotings,
    //                 listResultMeetingFiles: listMeetingFiles,
    //                 shareholdersTotal: shareholdersTotal,
    //                 shareholdersJoined: shareholdersJoined,
    //                 joinedMeetingShares: joinedMeetingShares,
    //                 totalMeetingShares: totalMeetingShares,
    //             }
    //             // get current chain Id
    //             const currentChainId = getChainId()
    //             try {
    //                 await this.transactionRepository.createTransaction({
    //                     meetingId: meetingEnd.meetingId,
    //                     titleMeeting: meetingEnd.titleMeeting,
    //                     meetingLink: meetingEnd.meetingLink,
    //                     totalMeetingShares: meetingEnd.totalMeetingShares,
    //                     joinedMeetingShares: meetingEnd.joinedMeetingShares,
    //                     shareholdersTotal: meetingEnd.shareholdersTotal,
    //                     shareholdersJoined: meetingEnd.shareholdersJoined,
    //                     startTimeMeeting: meetingEnd.startTimeMeeting,
    //                     endTimeMeeting: meetingEnd.endTimeMeeting,
    //                     companyId: meetingEnd.companyId,
    //                     chainId: currentChainId,
    //                     type: TRANSACTION_TYPE.CREATE_MEETING,
    //                     contractAddress: getContractAddress({
    //                         type: CONTRACT_TYPE.MEETING,
    //                         chainId: currentChainId,
    //                     }),
    //                 })
    //             } catch (error) {
    //                 throw new HttpException(
    //                     httpErrors.TRANSACTION_CREATE_FAILED,
    //                     HttpStatus.INTERNAL_SERVER_ERROR,
    //                 )
    //             }
    //             try {
    //                 await Promise.all([
    //                     ...meetingEnd.participants.map((participant) =>
    //                         this.participantMeetingTransactionRepository.createParticipantMeetingTransaction({
    //                                 meetingId: participant.meetingId,
    //                                 userId: participant.userId,
    //                                 username: participant.username,
    //                                 status: participant.status,
    //                                 role: participant.role,
    //                             },
    //                         ),
    //                     ),
    //                     ...meetingEnd.listResultProposals.map(
    //                         (listResultProposal) =>
    //                             this.proposalTransactionRepository.createProposalTransaction(
    //                                 {
    //                                     proposalId:
    //                                         listResultProposal.proposalId,
    //                                     meetingId: meetingEnd.meetingId,
    //                                     titleProposal:
    //                                         listResultProposal.titleProposal,
    //                                     title: listResultProposal.titleProposal,
    //                                     votedQuantity:
    //                                         listResultProposal.votedQuantity ??
    //                                         0,
    //                                     unVotedQuantity:
    //                                         listResultProposal.unVotedQuantity ??
    //                                         0,
    //                                     notVoteYetQuantity:
    //                                         listResultProposal.notVoteYetQuantity ??
    //                                         0,
    //                                 },
    //                             ),
    //                     ),
    //                     ...meetingEnd.listResultProposalFiles.map(
    //                         (listResultProposalFile) =>
    //                             this.fileOfProposalTransactionRepository.createFileOfProposalTransaction(
    //                                 {
    //                                     url: listResultProposalFile.url,
    //                                     meetingId: meetingEnd.meetingId,
    //                                     proposalFileId:
    //                                         listResultProposalFile.proposalFileId,
    //                                 },
    //                             ),
    //                     ),
    //                     ...meetingEnd.listResultVotings.map(
    //                         (listResultVoting) =>
    //                             this.votingTransactionRepository.createVotingTransaction(
    //                                 {
    //                                     userId: listResultVoting.userId,
    //                                     result: listResultVoting.result,
    //                                     votingId: listResultVoting.votingId,
    //                                     proposalId: listResultVoting.proposalId,
    //                                 },
    //                             ),
    //                     ),
    //                     ...meetingEnd.listResultMeetingFiles.map(
    //                         (listResultMeetingFile) =>
    //                             this.fileOfMeetingTransactionRepository.createFileOfMeetingTransaction(
    //                                 {
    //                                     url: listResultMeetingFile.url,
    //                                     meetingId:
    //                                         listResultMeetingFile.meetingId,
    //                                     meetingFileId:
    //                                         listResultMeetingFile.meetingFileId,
    //                                 },
    //                             ),
    //                     ),
    //                 ])
    //             } catch (error) {
    //                 throw new HttpException(
    //                     { message: error.message },
    //                     HttpStatus.INTERNAL_SERVER_ERROR,
    //                 )
    //             }
    //         }),
    //     ])
    // }

    async handleAllEndedMeeting(): Promise<void> {
        // get all meeting have status happened and not appeared in Transaction table
        const meetingIdsAppearedInTransaction =
            await this.transactionRepository.getMeetingIdsWithTransactions()

        const listMeetingHappened =
            await this.meetingRepository.findMeetingByStatusAndEndTimeVoting(
                StatusMeeting.HAPPENED,
                meetingIdsAppearedInTransaction,
            )
        if (!listMeetingHappened || listMeetingHappened.length == 0) {
            // not find meeting have status happened and no appeared in Transaction table
            console.log('No meeting have status happened!')
            return
        }

        await Promise.all([
            ...listMeetingHappened.map(async (meeting) => {
                const companyId = meeting.companyId
                //Meeting file
                const meetingFiles =
                    await this.meetingFileRepository.getMeetingFilesByMeetingId(
                        meeting.id,
                    )
                const listMeetingFile: ListFileOfMeeting[] = meetingFiles.map(
                    (meetingFile) => {
                        return {
                            meetingId: meetingFile.meetingId,
                            meetingFileId: meetingFile.id,
                            url: meetingFile.url,
                        }
                    },
                )

                const listMeetingProposals =
                    await this.proposalRepository.getAllProposalByMtgId(
                        meeting.id,
                    )
                const listMeetingCandidates =
                    await this.candidateRepository.getAllCandidateByMeetingId(
                        meeting.id,
                    )

                const listVoteProposals = []
                const listVoteCandidate = []

                await Promise.all([
                    ...listMeetingProposals.map(async (proposal) => {
                        const listVoteOfProposal =
                            await this.votingRepository.getInternalListVotingByProposalId(
                                proposal.id,
                            )
                        listVoteOfProposal.map((vote) => {
                            listVoteProposals.push(vote)
                        })
                    }),
                    ...listMeetingCandidates.map(async (candidate) => {
                        const listVoteOfCandidate =
                            await this.votingCandidateRepository.getListVotedByCandidateId(
                                candidate.id,
                            )
                        listVoteOfCandidate.map((voteCandidate) => {
                            listVoteCandidate.push(voteCandidate)
                        })
                    }),
                ])

                const listParticipantOfMeeting =
                    await this.userMeetingRepository.getAllIdsParticipantInBoardMeeting(
                        meeting.id,
                    )

                const voteInformation =
                    await this.meetingService.calculateVoter(
                        meeting.id,
                        companyId,
                        meeting.type,
                    )

                const keyQuery = Date.now() + ''

                const hash_basicMeeting = hashMd5({
                    meetingId: meeting.id,
                    companyId: companyId,
                    titleMeeting: meeting.title,
                    meetingLink: meeting.meetingLink,
                    startTimeMeeting: dateTimeToEpochTime(meeting.startTime),
                    endTimeMeeting: dateTimeToEpochTime(meeting.endTime),
                    voterTotal: voteInformation.voterTotal,
                    voterJoined: voteInformation.voterJoined,
                    totalMeetingVote: voteInformation.totalMeetingVote,
                    joinedMeetingVote: voteInformation.joinedMeetingVote,
                })

                const hash_fileMeeting = hashMd5(listMeetingFile)
                const hash_proposalMeeting = hashMd5(listMeetingProposals)
                const hash_proposalVote = hashMd5(listVoteProposals)
                const hash_candidateMeeting = hashMd5(listMeetingCandidates)
                const hash_candidateVote = hashMd5(listVoteCandidate)
                const hash_participantMeeting = hashMd5(
                    listParticipantOfMeeting,
                )
                const hash_detailMeeting = hashMd5({
                    meetingId: meeting.id,
                    companyId: companyId,
                    titleMeeting: meeting.title,
                    meetingLink: meeting.meetingLink,
                    startTimeMeeting: dateTimeToEpochTime(meeting.startTime),
                    endTimeMeeting: dateTimeToEpochTime(meeting.endTime),
                    voterTotal: voteInformation.voterTotal,
                    voterJoined: voteInformation.voterJoined,
                    totalMeetingVote: voteInformation.totalMeetingVote,
                    joinedMeetingVote: voteInformation.joinedMeetingVote,
                    fileMeeting: listMeetingFile,
                    proposalMeeting: listMeetingProposals,
                    proposalVote: listVoteProposals,
                    candidateMeeting: listMeetingCandidates,
                    candidateVote: listVoteCandidate,
                    participantMeeting: listParticipantOfMeeting,
                })

                // get current chain Id
                const currentChainId = getChainId()
                try {
                    await this.transactionRepository.createTransaction({
                        chainId: currentChainId,
                        contractAddress: getContractAddress({
                            type: CONTRACT_TYPE.MEETING,
                            chainId: currentChainId,
                        }),
                        meetingId: meeting.id,
                        keyQuery: keyQuery,
                        detailMeetingHash: hash_detailMeeting,
                        basicInformationMeetingHash: hash_basicMeeting,
                        fileMeetingHash: hash_fileMeeting,
                        proposalMeetingHash: hash_proposalMeeting,
                        votedProposalHash: hash_proposalVote,
                        candidateHash: hash_candidateMeeting,
                        votedCandidateHash: hash_candidateVote,
                        participantHash: hash_participantMeeting,
                    })
                } catch {
                    throw new HttpException(
                        httpErrors.TRANSACTION_CREATE_FAILED,
                        HttpStatus.INTERNAL_SERVER_ERROR,
                    )
                }
            }),
        ])
    }

    // async handleDataAfterEventSuccessfulCreatedMeeting() {
    //     const transactionsCreateMeetingSuccessful =
    //         await this.transactionRepository.getTransactionsCreateMeetingSuccessful()

    //     if (
    //         !transactionsCreateMeetingSuccessful ||
    //         transactionsCreateMeetingSuccessful?.length == 0
    //     ) {
    //         console.log(
    //             'No meeting creation event has been successful: ' + new Date(),
    //         )
    //         // this.logger.debug(
    //         //     '[BLC] No meeting creation event has been successful',
    //         // )
    //         this.logger.debug(
    //             `${messageBLCLog.NOT_FOUND_MEETING_CREATE.message}`,
    //         )
    //         return
    //     }

    //     const maximumNumberTransactionCallFuncBlockchain =
    //             configuration().transaction
    //                 .maximumNumberTransactionPerCallFuncBlockchain,
    //         currentChainId = getChainId()
    //     await Promise.all([
    //         ...transactionsCreateMeetingSuccessful.map(async (transaction) => {
    //             const [
    //                 proposals,
    //                 fileOfProposals,
    //                 participants,
    //                 fileOfMeetings,
    //             ] = await Promise.all([
    //                 this.proposalTransactionRepository.getProposalTransactionsByMeetingId(
    //                     transaction.meetingId,
    //                 ),
    //                 this.fileOfProposalTransactionRepository.getFileOfProposalTransactionsByMeetingId(
    //                     transaction.meetingId,
    //                 ),
    //                 this.participantMeetingTransactionRepository.getParticipantsMeetingTransactionsByMeetingId(
    //                     transaction.meetingId,
    //                 ),
    //                 this.fileOfMeetingTransactionRepository.getFileOfMeetingTransactionsByMeetingId(
    //                     transaction.meetingId,
    //                 ),
    //             ])

    //             const countCallFuncAddProposals = Math.ceil(
    //                     proposals.length /
    //                         maximumNumberTransactionCallFuncBlockchain,
    //                 ),
    //                 countCallFuncFileOfProposal = Math.ceil(
    //                     fileOfProposals.length /
    //                         maximumNumberTransactionCallFuncBlockchain,
    //                 ),
    //                 countCallFuncParticipant = Math.ceil(
    //                     participants.length /
    //                         maximumNumberTransactionCallFuncBlockchain,
    //                 ),
    //                 countCallFuncFileOfMeeting = Math.ceil(
    //                     fileOfMeetings.length /
    //                         maximumNumberTransactionCallFuncBlockchain,
    //                 )
    //             const addProposalsPromises = []
    //             const fileOfProposalPromises = []
    //             const participantPromises = []
    //             const fileOfMeetingPromises = []
    //             for (let i = 0; i < countCallFuncAddProposals; i++) {
    //                 addProposalsPromises.push(
    //                     this.createTransactionSecondaryAndUpdate(
    //                         TRANSACTION_TYPE.UPDATE_PROPOSAL_MEETING,
    //                         transaction,
    //                         currentChainId,
    //                     ),
    //                 )
    //             }
    //             for (let i = 0; i < countCallFuncFileOfProposal; i++) {
    //                 fileOfProposalPromises.push(
    //                     this.createTransactionSecondaryAndUpdate(
    //                         TRANSACTION_TYPE.UPDATE_FILE_PROPOSAL_MEETING,
    //                         transaction,
    //                         currentChainId,
    //                     ),
    //                 )
    //             }
    //             for (let i = 0; i < countCallFuncParticipant; i++) {
    //                 participantPromises.push(
    //                     this.createTransactionSecondaryAndUpdate(
    //                         TRANSACTION_TYPE.UPDATE_USER_PARTICIPATE_MEETING,
    //                         transaction,
    //                         currentChainId,
    //                     ),
    //                 )
    //             }
    //             for (let i = 0; i < countCallFuncFileOfMeeting; i++) {
    //                 fileOfMeetingPromises.push(
    //                     this.createTransactionSecondaryAndUpdate(
    //                         TRANSACTION_TYPE.UPDATE_FILE_OF_MEETING,
    //                         transaction,
    //                         currentChainId,
    //                     ),
    //                 )
    //             }

    //             await Promise.all([
    //                 ...addProposalsPromises,
    //                 ...fileOfProposalPromises,
    //                 ...participantPromises,
    //                 ...fileOfMeetingPromises,
    //             ])
    //         }),
    //     ])
    // }

    // async createTransactionSecondaryAndUpdate(
    //     type: TRANSACTION_TYPE,
    //     transaction: TransactionResponseData,
    //     chainId: SupportedChainId,
    // ) {
    //     try {
    //         // await this.transactionRepository.createTransaction({
    //         //     meetingId: transaction.meetingId,
    //         //     titleMeeting: transaction.titleMeeting,
    //         //     meetingLink: transaction.meetingLink,
    //         //     totalMeetingShares: transaction.totalMeetingShares,
    //         //     joinedMeetingShares: transaction.joinedMeetingShares,
    //         //     shareholdersTotal: transaction.shareholdersTotal,
    //         //     shareholdersJoined: transaction.shareholdersJoined,
    //         //     startTimeMeeting: transaction.startTimeMeeting,
    //         //     endTimeMeeting: transaction.endTimeMeeting,
    //         //     companyId: transaction.companyId,
    //         //     chainId: chainId,
    //         //     type: type,
    //         //     contractAddress: getContractAddress({
    //         //         type: CONTRACT_TYPE.MEETING,
    //         //         chainId: chainId,
    //         //     }),
    //         // })
    //     } catch (error) {
    //         switch (type) {
    //             case TRANSACTION_TYPE.UPDATE_PROPOSAL_MEETING:
    //                 throw new HttpException(
    //                     httpErrors.TRANSACTION_CREATE_PROPOSAL_FAILED,
    //                     HttpStatus.INTERNAL_SERVER_ERROR,
    //                 )
    //                 break
    //             case TRANSACTION_TYPE.UPDATE_USER_PARTICIPATE_MEETING:
    //                 throw new HttpException(
    //                     httpErrors.TRANSACTION_CREATE_PARTICIPANT_MEETING_FAILED,
    //                     HttpStatus.INTERNAL_SERVER_ERROR,
    //                 )
    //                 break
    //             case TRANSACTION_TYPE.UPDATE_FILE_PROPOSAL_MEETING:
    //                 throw new HttpException(
    //                     httpErrors.TRANSACTION_CREATE_FILE_OF_PROPOSAL_FAILED,
    //                     HttpStatus.INTERNAL_SERVER_ERROR,
    //                 )
    //                 break
    //             case TRANSACTION_TYPE.UPDATE_USER_PROPOSAL_MEETING:
    //                 throw new HttpException(
    //                     httpErrors.TRANSACTION_CREATE_VOTING_PROPOSAL_FAILED,
    //                     HttpStatus.INTERNAL_SERVER_ERROR,
    //                 )
    //                 break

    //             default:
    //                 throw new HttpException(
    //                     {
    //                         message: error.message,
    //                     },
    //                     HttpStatus.INTERNAL_SERVER_ERROR,
    //                 )
    //         }
    //     }
    // }

    async handleCheckTransaction() {
        const transactionsList =
            await this.transactionRepository.findTransactionByStatus(
                TRANSACTION_STATUS.PENDING,
            )
        if (!transactionsList || transactionsList?.length === 0) {
            console.log('No transactions found: ' + new Date())
            this.logger.debug(
                `${messageBLCLog.NOT_FOUND_TRANSACTION_PENDING.message}`,
            )
            return
        }
        // const maximumNumberTransactionCallFuncBlockchain =
        //     configuration().transaction
        //         .maximumNumberTransactionPerCallFuncBlockchain

        await Promise.all([
            ...transactionsList.map(async (transaction) => {
                const totalHashMd5: [string, string][] = [
                    [
                        'basicInformationMeetingHash',
                        transaction.basicInformationMeetingHash,
                    ],
                    ['fileMeetingHash', transaction.fileMeetingHash],
                    ['proposalMeetingHash', transaction.proposalMeetingHash],
                    ['votedProposalHash', transaction.votedProposalHash],
                    ['candidateHash', transaction.candidateHash],
                    ['votedCandidateHash', transaction.votedCandidateHash],
                    ['participantHash', transaction.participantHash],
                    ['detailMeetingHash', transaction.detailMeetingHash],
                ]

                const txPromises = await sendCreateMeetingTransaction({
                    chainId: transaction.chainId,
                    contractAddress: transaction.contractAddress,
                    keyMeeting: transaction.keyQuery,
                    totalHashMd5: totalHashMd5,
                })
                if (txPromises) {
                    console.log(
                        `${messageBLCLog.SENT_TRANSACTION_MEETING_ENDED.message}` +
                            txPromises?.transactionHash,
                    )
                    this.logger.info(
                        `${messageBLCLog.SENT_TRANSACTION_MEETING_ENDED.message} ${txPromises?.transactionHash}`,
                    )
                    await this.transactionRepository.updateTransaction(
                        transaction.id,
                        {
                            txHash: txPromises?.transactionHash,
                            status: TRANSACTION_STATUS.PROCESSING,
                        },
                    )
                }
            }),
        ])
    }

    // async handleDataAfterEventSuccessfulUpdateProposalMeeting() {
    //     const transactionsUpdateProposalMeetingSuccessful =
    //         await this.transactionRepository.transactionsUpdateProposalMeetingSuccessful()
    //     if (
    //         !transactionsUpdateProposalMeetingSuccessful ||
    //         transactionsUpdateProposalMeetingSuccessful?.length == 0
    //     ) {
    //         console.log(
    //             `${messageBLCLog.NO_UPDATE_PROPOSAL_MEETING_ENDED.message}}` +
    //                 new Date(),
    //         )
    //         this.logger.debug(
    //             messageBLCLog.NO_UPDATE_PROPOSAL_MEETING_ENDED.message,
    //         )
    //         return
    //     }
    //     const maximumNumberTransactionCallFuncBlockchain =
    //             configuration().transaction
    //                 .maximumNumberTransactionPerCallFuncBlockchain,
    //         currentChainId = getChainId()
    //     await Promise.all([
    //         ...transactionsUpdateProposalMeetingSuccessful.map(
    //             async (transaction) => {
    //                 const { meetingId } = transaction
    //                 const proposalTransactions =
    //                     await this.proposalTransactionRepository.getProposalTransactionsByMeetingId(
    //                         meetingId,
    //                     )

    //                 await Promise.all([
    //                     ...proposalTransactions.map(
    //                         async (proposalTransaction) => {
    //                             const { proposalId } = proposalTransaction
    //                             const votingTransactions =
    //                                 await this.votingTransactionRepository.getVotingTransactionByProposalId(
    //                                     proposalId,
    //                                 )
    //                             const countCallFuncAddUserProposals = Math.ceil(
    //                                 votingTransactions.length /
    //                                     maximumNumberTransactionCallFuncBlockchain,
    //                             )
    //                             const addUserProposalPromises = []

    //                             for (
    //                                 let i = 0;
    //                                 i < countCallFuncAddUserProposals;
    //                                 i++
    //                             ) {
    //                                 addUserProposalPromises.push(
    //                                     this.createTransactionSecondaryAndUpdate(
    //                                         TRANSACTION_TYPE.UPDATE_USER_PROPOSAL_MEETING,
    //                                         transaction,
    //                                         currentChainId,
    //                                     ),
    //                                 )
    //                             }
    //                             await Promise.all([...addUserProposalPromises])
    //                         },
    //                     ),
    //                 ])
    //             },
    //         ),
    //     ])
    // }
}
