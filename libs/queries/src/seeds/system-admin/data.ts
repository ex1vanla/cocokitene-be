import { PartialType } from '@nestjs/swagger'
import { SystemAdmin } from '../..'

export class InertSertSystemAdminDto extends PartialType(SystemAdmin) {}

// nguyentienhuy--->$2b$10$799eKj1aPSb1nJJG8fp9Ge7qIS17GiW.Jbrz3dsmUlA16QU3UQfCe

export const systemAdminData: InertSertSystemAdminDto[] = [
    {
        username: 'nguyentienhuy',
        email: 'huynt@trithucmoi.co',
        password:
            '$2b$10$799eKj1aPSb1nJJG8fp9Ge7qIS17GiW.Jbrz3dsmUlA16QU3UQfCe',
        resetPasswordToken: 'j2GBoY23PgLr8N1iDEz6',
        resetPasswordExpireTime: new Date('2023-12-31T23:59:59'),
    },
]
