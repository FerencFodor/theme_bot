import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("themes")
export class Theme {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("char", { length: 255 })
  theme: string;
}
