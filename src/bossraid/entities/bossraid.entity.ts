import { Users } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, EntityRepository, IsNull, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Repository, UpdateDateColumn } from "typeorm";

@Entity({ schema: 'test', name: 'userhistories'})
export class RaidHistories {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(() => Users, (users) => users.id)
    @JoinColumn({ name: "userId"})
    userId: number;

    @Column({nullable: true})
    score?: number;

    @Column({nullable: true})
    level: number;

    @CreateDateColumn()
    enter_time: Date;

    @UpdateDateColumn({nullable: true, default: null})
    end_time: Date;
}

export class RaidHistoriesRepository extends Repository<RaidHistories> {}