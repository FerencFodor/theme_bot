import "reflect-metadata";

import dotenv from "dotenv";
import { DataSource } from "typeorm";

import { Theme } from "./entity/theme.js";
//  import { Vote } from "./entity/vote.js";

dotenv.config();

const databaseUrl =
  process.env.DEBUG === "true"
    ? process.env.DEBUG_URL
    : process.env.DATABASE_URL;

export const AppSourceData: DataSource = new DataSource({
  entities: [Theme],
  //  extra: { ssl: { rejectUnauthorized: false } },
  logging: true,
  synchronize: true,
  type: "postgres",
  url: databaseUrl,
});
