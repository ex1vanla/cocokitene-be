import { PartialType } from '@nestjs/swagger'
import { SystemAdmin } from '../..'

export class InertSertSystemAdminDto extends PartialType(SystemAdmin) {}

// nguyentienhuy--->$2b$10$799eKj1aPSb1nJJG8fp9Ge7qIS17GiW.Jbrz3dsmUlA16QU3UQfCe
//exceedone@2024 ---> $2b$10$JgoWShCh8r.ORSH1MWFUiuVUVf9yFRhBS9nbnzB0qEL.41t1JUkTy

export const systemAdminData: InertSertSystemAdminDto[] = [
    {
        username: 'nguyentienhuy',
        email: 'huynt@trithucmoi.co',
        password:
            '$2b$10$799eKj1aPSb1nJJG8fp9Ge7qIS17GiW.Jbrz3dsmUlA16QU3UQfCe',
        resetPasswordToken: 'j2GBoY23PgLr8N1iDEz6',
        resetPasswordExpireTime: new Date('2023-12-31T23:59:59'),
    },
    {
        username: 'snoro',
        email: 'snoro@exceedone.co.jp',
        password:
            '$2b$10$JgoWShCh8r.ORSH1MWFUiuVUVf9yFRhBS9nbnzB0qEL.41t1JUkTy',
        resetPasswordToken: 'j2GBoY23PgLr8N1iDEz6',
        resetPasswordExpireTime: new Date('2023-12-31T23:59:59'),
    },
]
