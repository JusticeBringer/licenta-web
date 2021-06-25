import mongoose from 'mongoose';
import dotEnvConfig from '../dotenv/config';

const MONGODB_URI = dotEnvConfig.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env file');
}

let database: mongoose.Connection;
export const dbDevConnect = () => {
  if (database) {
    return;
  }
  mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  });
  database = mongoose.connection;
  database.once('open', async () => {
    console.log('Connected to development database');
  });
  database.on('error', () => {
    console.log('Error connecting to development database');
  });
};

export const disconnect = () => {
  if (!database) {
    console.log('Development database was not connected. Disconnecting nothing.');
    return;
  }

  console.log('Disonnected from development database');
  mongoose.disconnect();
};
