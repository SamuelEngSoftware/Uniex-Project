import { Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, Column } from "typeorm";
import { User } from "./User";
import { Course } from "./Course";

@Entity("subscriptions")
export class Subscription {

  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @CreateDateColumn()
  subscribedAt!: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: "userId" })
  user!: User;

  @Column()
  userId!: string; 

  @ManyToOne(() => Course, (course) => course.subscriptions, {
    onDelete: "CASCADE"
  })
  @JoinColumn({ name: "courseId" })
  course!: Course;

  @Column()
  courseId!: string;
}