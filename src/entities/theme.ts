import { BaseEntity, Entity, PrimaryColumn } from 'typeorm';

@Entity('themes')
export class Theme extends BaseEntity {
  @PrimaryColumn('varchar', { length: 255 })
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    public theme: string;
}
