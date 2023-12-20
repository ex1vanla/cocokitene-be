import { forwardRef, Module } from '@nestjs/common'
import { CompanyController } from '@api/modules/companys/company.controller'
import { CompanyService } from '@api/modules/companys/company.service'
import { UserModule } from '@api/modules/users/user.module'
import { RoleModule } from '@api/modules/roles/role.module'
import { UserRoleModule } from '@api/modules/user-roles/user-role.module'
import { UserStatusModule } from '@api/modules/user-status/user-status.module'
import { PlanModule } from '@api/modules/plans/plan.module'
import { RolePermissionModule } from '@api/modules/role-permissions/role-permission.module'
import { PermissionModule } from '@api/modules/permissions/permission.module'

@Module({
    imports: [
        forwardRef(() => UserModule),
        RoleModule,
        UserRoleModule,
        UserStatusModule,
        PlanModule,
        RolePermissionModule,
        PermissionModule,
    ],
    controllers: [CompanyController],
    providers: [CompanyService],
    exports: [CompanyService],
})
export class CompanyModule {}
