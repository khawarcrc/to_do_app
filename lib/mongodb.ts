import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI as string;

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable in .env.local');
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === 'development') {
  // In development, reuse the client across hot reloads to avoid exhausting connections
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect().then((c) => {
      console.log('MongoDB: Connection is established');
      return c;
    });
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect().then((c) => {
    console.log('MongoDB: Connection is established');
    return c;
  });
}

export default clientPromise;
