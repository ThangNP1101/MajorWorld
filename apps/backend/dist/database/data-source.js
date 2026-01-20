"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const dotenv = require("dotenv");
dotenv.config();
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: process.env.DATABASE_HOST || "localhost",
    port: parseInt(process.env.DATABASE_PORT) || 5432,
    username: process.env.DATABASE_USER || "majorworld",
    password: process.env.DATABASE_PASSWORD || "majorworld123",
    database: process.env.DATABASE_NAME || "major_world",
    entities: [__dirname + "/../**/*.entity{.ts,.js}"],
    migrations: [__dirname + "/migrations/*{.ts,.js}"],
    synchronize: false,
});
//# sourceMappingURL=data-source.js.map