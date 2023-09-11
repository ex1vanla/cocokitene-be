import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Company } from '@entities/company.entity';
import { UserRole } from '@shares/constants';

@Entity('roles')
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({
    name: 'role',
    type: 'enum',
    enum: UserRole,
    nullable: false,
  })
  role: UserRole;
  @Column({ name: 'description', type: 'varchar', length: 255, nullable: true })
  description: string;
  @Column({ nullable: false, name: 'company_id', type: 'integer', width: 11 })
  companyId: number;
  @ManyToOne(() => Company)
  @JoinColumn({
    name: 'company_id',
  })
  company: Company;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
