import { Injectable, Logger } from '@nestjs/common';
import { PlanSeederService } from './plan/plan.seeder.service';
import { CompanyStatusSeederService } from './company-status/company-status.seeder.service';
import { CompanySeederService } from './company/company.seeder.service';
import { PermissionSeederService } from '@seeds/permission/permission.seeder.service';
import { RoleSeederService } from '@seeds/role/role.seeder.service';
import { UserSeederService } from '@seeds/user/user.seeder.service';
import { UserStatusSeederService } from '@seeds/user-status/user-status.seeder.service';

@Injectable()
export class Seeder {
  constructor(
    private readonly planSeederService: PlanSeederService,
    private readonly companyStatusSeederService: CompanyStatusSeederService,
    private readonly companySeederService: CompanySeederService,
    private readonly permissionSeederService: PermissionSeederService,
    private readonly roleSeederService: RoleSeederService,
    private readonly userSeederService: UserSeederService,
    private readonly userStatusSeederService: UserStatusSeederService,
  ) {}
  async seed() {
    Logger.log('START_SEEDING__DATA');
    await this.seedPlan();
    await this.seedCompanyStatus();
    await this.seedCompany();
    await this.seedPermission();
    await this.seedRole();
    await this.seedUserStatus();
    await this.seedUser();
    Logger.log('END___SEEDING__DATA');
  }

  async seedPlan() {
    await this.planSeederService.seedPlan();
  }
  async seedCompanyStatus() {
    await this.companyStatusSeederService.seedCompanyStatus();
  }
  async seedCompany() {
    await this.companySeederService.seedCompany();
  }
  async seedPermission() {
    await this.permissionSeederService.seedPermission();
  }
  async seedRole() {
    await this.roleSeederService.seedRole();
  }
  async seedUserStatus() {
    await this.userStatusSeederService.seedUserStatus();
  }
  async seedUser() {
    await this.userSeederService.seedUser();
  }
}
