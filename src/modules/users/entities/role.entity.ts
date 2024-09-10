import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { RoleName } from '../../../common/enums/role-name.enum';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.roles, { onDelete: 'CASCADE' })
  user: User;

  @Column({
    type: 'enum',
    enum: RoleName,
    default: RoleName.USER,
  })
  roleName: RoleName;
}
