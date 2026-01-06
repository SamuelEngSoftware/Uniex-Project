import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";


export enum UserRole {
  ADMIN = "admin",
  COORDENADOR = "coordenador",
  PARTICIPANTE = "participante"
}

@Entity("users") 
export class User {

  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ length: 100 })
  name!: string;

  @Column({ unique: true }) 
  email!: string;

  @Column() 
  password!: string;

  @Column({
    type: "simple-enum",
    enum: UserRole,
    default: UserRole.PARTICIPANTE 
  })
  role!: UserRole;

  @CreateDateColumn() 
  created_at!: Date;

  @UpdateDateColumn() 
  updated_at!: Date;
}