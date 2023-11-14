import { executeSqlCommand } from "..";
import { apiAdapterRespInterface } from "../interface/apiAdapterResp";
import { DateTime } from "luxon";
const  yesterdayStart = DateTime.now().setZone('America/Mexico_City').minus({days: 1}).startOf('day').toFormat('yyyy-MM-dd HH:mm:ss');
const yesterdayEnd = DateTime.now().minus({days: 1}).endOf('day').toFormat('yyyy-MM-dd HH:mm:ss');

export default class ApiAdapterRepository{
  async get(): Promise<apiAdapterRespInterface[]>{
    try{
      const query =  `SELECT *FROM partitions.get_exceptions_data_fn('${yesterdayStart}', '${yesterdayEnd}')`;
      
      const [res] = Object.values(await executeSqlCommand(query,[],true));

      if(!res){
        throw new Error('No data found');
      }
      
      return res as apiAdapterRespInterface[];
    }catch(err){
      throw err;
    }
  
  }
}