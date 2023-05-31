import * as dotenv from 'dotenv';

import { NODE_ENV } from './environment';
dotenv.config();

export const isDevEnv = NODE_ENV === 'development';
export const isTestEnv = NODE_ENV === 'test';
