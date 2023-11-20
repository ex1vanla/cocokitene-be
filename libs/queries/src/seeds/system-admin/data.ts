import { PartialType } from '@nestjs/swagger'
import { SystemAdmin } from '../..'

export class InertSertSystemAdminDto extends PartialType(SystemAdmin) {}

// nguyenkien--->$2b$10$jbqtJoIKdWleu6U0AsvCIOJgxo8eStV.HCrMlfXuvo76oNfoUqR1W
// nguyentienhuy--->$2b$10$799eKj1aPSb1nJJG8fp9Ge7qIS17GiW.Jbrz3dsmUlA16QU3UQfCe
// nguyenanhphuong-->$2b$10$UeuuNr3KwfXqQ6AQ8iQOLujOlGwP1XOOJA2hLevkqwjY1lYgv2Z.m

export const systemAdminData: InertSertSystemAdminDto[] = [
    {
        username: 'kienkien',
        email: 'nguyenkien123ns@gmail.com',
        password:
            '$2b$10$jbqtJoIKdWleu6U0AsvCIOJgxo8eStV.HCrMlfXuvo76oNfoUqR1W',
        resetPasswordToken: 'j2GBoYx4PgLr8N1iDEz6',
        resetPasswordExpireTime: new Date('2023-12-31T23:59:59'),
    },
    {
        username: 'nguyentienhuy',
        email: 'huynt@trithucmoi.co',
        password:
            '$2b$10$799eKj1aPSb1nJJG8fp9Ge7qIS17GiW.Jbrz3dsmUlA16QU3UQfCe',
        resetPasswordToken: 'j2GBoY23PgLr8N1iDEz6',
        resetPasswordExpireTime: new Date('2023-12-31T23:59:59'),
    },
    {
        username: 'PhuongNA',
        email: 'phuong.na163228@gmail.com',
        password:
            '$2b$10$UeuuNr3KwfXqQ6AQ8iQOLujOlGwP1XOOJA2hLevkqwjY1lYgv2Z.m',
        resetPasswordToken: 'j2GBoY23PgLr8N1iDEz6',
        resetPasswordExpireTime: new Date('2023-12-31T23:59:59'),
    },
]
