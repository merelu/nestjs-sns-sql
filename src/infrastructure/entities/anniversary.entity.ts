import { CoupleInfoModel } from '@domain/model/database/couple-info';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CoupleInfo } from './couple-info.entity';

@Entity()
export class Anniversary {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'timestamp' })
  datetime: Date;

  @DeleteDateColumn()
  deleted_at: Date | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'int', nullable: true })
  couple_info_id: number | null;

  @ManyToOne(() => CoupleInfo, (coupleInfo) => coupleInfo.anniversaries, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'couple_info_id', referencedColumnName: 'id' })
  couple_info: CoupleInfoModel;
}
