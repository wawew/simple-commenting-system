import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

const mongoServer = await MongoMemoryServer.create({
  instance: {
    port: process.env.MONGODB_PORT,
    dbName: process.env.MONGODB_DB_NAME,
  },
});

class MongoMemoryConnection {
  constructor() {
    if (!MongoMemoryConnection.instance) {
      this.init();
      MongoMemoryConnection.instance = this;
    }
    return MongoMemoryConnection.instance;
  }

  async init() {
    try {
      await mongoose.connect(mongoServer.getUri(), { dbName: "boo" });
      console.log("Database connected");
    } catch (error) {
      console.error("Error connecting to database", error);
    }
  }
}

const repoConnection = new MongoMemoryConnection();
Object.freeze(repoConnection);
export default repoConnection;
