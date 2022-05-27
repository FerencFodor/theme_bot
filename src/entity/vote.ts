import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

import { Theme } from "./theme.js";

@Entity("theme_vote")
export class Vote {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Theme)
  theme: Theme;

  @Column("int")
  vote: number;
}
