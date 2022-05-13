import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config();

// Connect DB
export async function connectDB() {
  const uri = process.env.MONGOURI;

  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await client.connect();

  return client.db("chatApp");
}
