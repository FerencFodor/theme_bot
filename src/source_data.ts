import "reflect-metadata";

import dotenv from "dotenv";
import { DataSource } from "typeorm";

import { Theme } from "./entity/theme.js";
import { Vote } from "./entity/vote.js";

dotenv.config();

export const AppSourceData: DataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  synchronize: true,
  logging: true,
  extra: { ssl: { rejectUnauthorized: false } },
  entities: [Theme, Vote],
});
