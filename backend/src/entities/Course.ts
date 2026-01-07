import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity("courses")
export class Course {

  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column()
  date!: Date; 

  @Column("int")
  spots!: number; 

  @CreateDateColumn()
  created_at!: Date;


  @ManyToOne(() => User)
  @JoinColumn({ name: "coordenador_id" }) 
  coordenador!: User;
}