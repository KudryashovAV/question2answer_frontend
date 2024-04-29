import { connect, set } from 'mongoose';
import envConfig from '@/config';

let isConnected = false;
export default async function connectToDb() {
  set('strictQuery', true);
  set('bufferCommands', false);
  try {
    if (isConnected) {
      console.log('Using existing database connection');
      return;
    }
    await connect("mongodb+srv://akd:8BEwIW6mDN37YjZL@cluster0.rq9pyab.mongodb.net", { dbName: 'dev_overflow' });
    console.log('Connected to database');
    isConnected = true;
  } catch (err) {
    console.log('Failed to connect to database', err);
  }
}
