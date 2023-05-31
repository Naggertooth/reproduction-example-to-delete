import * as dotenv from 'dotenv';
dotenv.config();

export const NODE_ENV = process.env.NODE_ENV;

export const DATABASE_URL = process.env.DATABASE_URL;
export const DATABASE_URL_TEST = process.env.DATABASE_URL_TEST;
