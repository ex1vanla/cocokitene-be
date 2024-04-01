import { Repository } from 'typeorm'
import { Election } from '@entities/election.entity'
import { CustomRepository } from '@shares/decorators'
@CustomRepository(Election)
export class ElectionRepository extends Repository<Election> {}
