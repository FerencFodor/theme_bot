import { Entity, BaseEntity, PrimaryColumn } from 'typeorm';

@Entity('themes')
export class Theme extends BaseEntity {
    @PrimaryColumn('varchar', { length: 255 })
    public theme: string;
}
