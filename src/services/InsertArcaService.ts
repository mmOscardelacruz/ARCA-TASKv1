import { executeSqlCommand } from "../db";
import { ArcaInterface } from "../interfaces/ArcaInterface";


export default class InsertArcaService {
  


  async insertData(data: ArcaInterface []) {
  try {
    const values = JSON.stringify(data);
    const query = `SELECT partitions.insert_processed_exceptions_fn($1);`
    const resp = await executeSqlCommand(query, [values],true);
    // console.log('Data Inserted');
    return resp;
  } catch (error) {
    throw error;
  }
  }
}