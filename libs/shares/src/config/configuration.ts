import * as dotenv from 'dotenv';
dotenv.config();

interface Configuration {
  common: {
    nodeEnv: string;
    networkEnv: string;
  };
  // database: {
  //   host: string;
  //   port: number;
  //   name: string;
  //   user: string;
  //   pass: string;
  //   type: string;
  //   logging: boolean;
  // };
  api: {
    port: number;
    prefix: string;
  };
}

export default (): Configuration => ({
  common: {
    nodeEnv: process.env.NODE_ENV || 'development',
    networkEnv: process.env.NETWORK_ENV || 'TESTNET',
  },
  // database: {
  //   host: process.env.DB_HOST || 'localhost',
  //   port: parseInt(process.env.DB_PORT, 10) || 3307,
  //   name: process.env.DB_NAME || 'exment_market',
  //   user: process.env.DB_USER || 'root',
  //   pass: process.env.DB_PASS || '1',
  //   type: process.env.DB_TYPE || 'mysql',
  //   logging: process.env.DB_LOGGING === 'true',
  // },
  api: {
    port: parseInt(process.env.API_PORT, 10) || 4000,
    prefix: process.env.API_PREFIX || 'api',
  },
});
