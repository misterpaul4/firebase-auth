import { IsEmail, IsOptional, IsString } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  @IsString()
  name: string;

  @Column('text', { unique: true })
  @IsEmail()
  email: string;

  @Column({ nullable: true })
  @IsString()
  password?: string;

  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  phone?: string;

  @Column({ nullable: true, unique: true })
  thirdPartyUUID?: string;
}
