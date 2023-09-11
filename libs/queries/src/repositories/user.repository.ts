import { CustomRepository } from '@shares/decorators';
import { User } from '@entities/user.entity';
import { Repository } from 'typeorm';

@CustomRepository(User)
export class UserRepository extends Repository<User> {}
