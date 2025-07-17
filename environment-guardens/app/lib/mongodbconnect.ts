// mongodb.js
import { MongoClient, ServerApiVersion } from 'mongodb';
import { env } from 'process';

const uri = process.env.DATABASE_URL!;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let isConnected = false;

async function connectToMongo() {
  if (!isConnected) {
    await client.connect();
    isConnected = true;
    console.log("Connected to MongoDB.");
  }
  return client;
}

export { client, connectToMongo };

