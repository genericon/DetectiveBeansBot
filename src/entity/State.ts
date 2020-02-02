import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { JObject } from 'inkjs';

@Entity()
export class State {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column('simple-json')
    state: JObject;
}