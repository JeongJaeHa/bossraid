import { Column, CreateDateColumn, Entity, EntityRepository, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Repository, UpdateDateColumn } from "typeorm";

@Entity({ schema: 'test', name: 'users' })
export class Users {
    @PrimaryGeneratedColumn('increment')
    id?: number;

    @Column()
    nickname: string;

    @UpdateDateColumn()
    created_at: string;
}

@Entity({ schema: 'test', name: 'userhistories'})
export class UserHistories {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    score: number;

    @CreateDateColumn()
    enter_time: Date;

    @UpdateDateColumn()
    end_time: Date;

    @ManyToOne(() => Users, (users) => users.id)
    @JoinColumn({ name: "Users_id"})
    users: Users;
}

export class UsersRepository extends Repository<Users> {}
export class UserHistoriesRepository extends Repository<UserHistories> {}