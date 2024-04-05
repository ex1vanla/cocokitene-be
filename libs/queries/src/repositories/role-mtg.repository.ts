import { Repository } from 'typeorm'
import { RoleMtg } from '@entities/role-mtg.entity'
import { CustomRepository } from '@shares/decorators'

@CustomRepository(RoleMtg)
export class RoleMtgRepository extends Repository<RoleMtg> {}
