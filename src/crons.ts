import { CronJob } from 'cron';


import { apiAdapterController } from './app';
import config from './config';

const { cronExpression } = config.cron;


export const apiAdapterCron = new CronJob(
  cronExpression, 
  async () => {
    try{
      console.log('cron started');
      await apiAdapterController();
    }catch(err){
      console.log(err);
    }
  },
  () => console.log('cron stopped'),
  true,
);