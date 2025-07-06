import { DataSource } from "typeorm"

export default new DataSource({
    type: "postgres",
    host: "localhost",
    port: parseInt(process.env.PG_PORT) || 5332,
    username: "demosuser",
    password: "demospassword",
    database: "demos",
    entities: [
        "src/model/entities/*.ts",
        "src/model/entities/GCR/*.ts",
        "src/model/entities/GCRv2/*.ts",
    ],
    migrations: ["src/migrations/**/*.ts"],
    synchronize: false, // Set to false for production with migrations
    logging: false,
})
