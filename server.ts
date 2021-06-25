import express, { Application } from 'express';
import { dbDevConnect } from './database/database.development';
import { dbProdConnect } from './database/database.production';
import allApiRoutes from './api/api.routes';
import { dotEnvConfig } from './dotenv/config';
import resetMockedData from './scripts/resetMockedData';

const app: Application = express();

const PORT = dotEnvConfig.PORT || 3000;
const NODE_ENV = dotEnvConfig.NODE_ENV || 'development';
const RESET_MOCKED_DATA = dotEnvConfig.RESET_MOCKED_DATA || 'false';

// Body parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(allApiRoutes);

// Database connection
if (NODE_ENV === 'production') {
  dbProdConnect();
} else {
  dbDevConnect();
}

// Reset mocked data for development
if (NODE_ENV !== 'production') {
  if (RESET_MOCKED_DATA === 'true') {
    (async () => {
      try {
        console.log('Resetting mocked data...');
        await resetMockedData();
      } catch (e) {
        console.error(e);
      }
    })();
  }
}

try {
  app.listen(PORT, (): void => {
    console.log(`Connected successfully on port ${PORT}`);
  });
} catch (error) {
  console.error(`Error occured: ${error.message}`);
}
