import { MongoClient } from "mongodb";
import { env } from "@repo/env/web";

declare global {
  var mongoClient: MongoClient | undefined;
}

export const createClient = () => {
  if (global.mongoClient) {
    return global.mongoClient;
  }

  const mongoClient = new MongoClient(env.DATABASE_URL);

  global.mongoClient = mongoClient;

  return mongoClient;
};

export const client = {
  get db() {
    return createClient().db("comp3036");
  },
};