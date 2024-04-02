import { Injectable } from '@nestjs/common'
import { RoleMtgRepository } from '@repositories/role-mtg.repository'

@Injectable()
export class RoleMtgService {
    constructor(private readonly roleMtgRepository: RoleMtgRepository) {}
}
