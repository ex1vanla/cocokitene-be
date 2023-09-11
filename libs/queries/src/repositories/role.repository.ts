import { Role } from '@entities/role.entity';
import { CustomRepository } from '@shares/decorators';
import { Repository } from 'typeorm';
import { UserRole } from '@shares/constants';

@CustomRepository(Role)
export class RoleRepository extends Repository<Role> {
  async getRoleByName(name: UserRole): Promise<Role> {
    const role = await this.findOne({
      where: {
        role: name,
      },
    });
    return role;
  }
}
