import { PartialType } from '@nestjs/mapped-types';
import { User } from '@entities/user.entity';
import configuration from '@shares/config/configuration';
import { uuid } from '@shares/utils/uuid';

export class InsertUserDto extends PartialType(User) {}

const superAdminWalletAddress =
  configuration().api.superAdminWallets.split('|') || [];
const adminWalletAddress = configuration().api.adminWallets.split('|') || [];

export const usersSupperAdminData: InsertUserDto[] =
  superAdminWalletAddress.map((address, index) => ({
    walletAddress: address.toLowerCase(),
    username: 'super_admin ' + ++index,
    nonce: uuid(),
  }));

export const usersAdminData: InsertUserDto[] = adminWalletAddress.map(
  (address, index) => ({
    walletAddress: address.toLowerCase(),
    username: 'admin ' + ++index,
    nonce: uuid(),
  }),
);

export const userNomallyData: InsertUserDto[] = [
  {
    walletAddress: '0xb6bcc605163714d0af8544aad8aabde7a54ae179',
    username: 'DaiTV',
    email: 'daitv@trithucmoi.co',
    nonce: uuid(),
    avatar:
      'https://i.seadn.io/gae/ehUSQhnsGoxsqszQdgzLAhD50gnhgdFCsnqlNdsOqINRTNtlwVoMDVdVVskBPuCp0KLtnhuYzCZCaLm_craTEjpafyfrXSjNpco8MUE',
  },
  {
    walletAddress: '0x6a0b754cd732acee9654cc653f3de360da3e6c94',
    username: 'thaontp',
    email: 'thaontp@trithucmoi.co',
    nonce: uuid(),
    avatar: 'https://i.seadn.io/gcs/files/86ba42e7b54bcdfd6fb2c6fc7d1f2fc3.jpg',
  },
];

export const userShareholderData: InsertUserDto[] = [
  {
    walletAddress: '0x44534dcC2b343794c9C47D61766844e762e2D617',
    username: 'kiennv',
    email: 'kiennv@trithucmoi.co',
    nonce: uuid(),
    avatar:
      'https://i.seadn.io/gae/ehUSQhnsGoxsqszQdgzLAhD50gnhgdFCsnqlNdsOqINRTNtlwVoMDVdVVskBPuCp0KLtnhuYzCZCaLm_craTEjpafyfrXSjNpco8MUE',
  },
];
