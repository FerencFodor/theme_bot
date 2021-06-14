import {Entity, Column, BaseEntity, PrimaryColumn} from 'typeorm';

@Entity("themes")
export default class Theme extends BaseEntity{
    @PrimaryColumn('varchar', {length: 255})
    public theme: string;
}