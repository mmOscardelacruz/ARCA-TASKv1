import Bluebird from "bluebird";
import ApiAdapterRepository from "../db/repositories/ApiAdapterRepository";
import GeotabService from "./GeotabService";
import { API } from "../utils/helpers/GeotabHelper";
import { createAddress } from "./CreateAddressService";
// import { Coordinates } from "../types/Coordinates";
import { Coordinates } from "../interfaces/Geotab/Trip";
import InsertArcaService from "./InsertArcaService";
import { ArcaInterface } from "../interfaces/ArcaInterface";
const insertArca = new InsertArcaService();

export default class ApiAdapterRportService {

  // Constructor for the class
  constructor(
    private readonly apiAdapterRepository: ApiAdapterRepository,
    private readonly geotabService: GeotabService
  ) {}

  async getData(): Promise<any> {
    try{
      const dbApiAdpater = await this.apiAdapterRepository.get();
      // console.log(dbApiAdpater);
      const chunkSize = 500;
      const chunks = Math.ceil(dbApiAdpater.length / chunkSize);
      console.time('chunk');
      for(let i = 0; i < chunks; i++){
        const chunk = dbApiAdpater.slice(i * chunkSize, (i + 1) * chunkSize);
      
      const result: ArcaInterface[] = await Bluebird.map(
        chunk, async (item) => {
          const convertDuration = item.DurationTicks / 10000000;
          const hours = Math.floor(convertDuration / 3600);
          const minutes = Math.floor((convertDuration % 3600) / 60);
          const seconds = Math.floor(convertDuration % 60);

          const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
          


          const logRecord = await this.geotabService.getLogRecord(item.ActiveFrom,item.ActiveFrom,item.DeviceId);
          const {longitude: longitud, latitude: latitud} = logRecord[0];
          const direccion = await this.geotabService.getAddresses(longitud, latitud);

          // const direccion = await createAddress({x: longitud, y: latitud} as Coordinates);

          const res: any = {
            uo: '',
            num_sap: item.DeviceName,
            num_employee: item.DriverNumber,
            driver_name: item.DriverName,
            event_type: item.RuleName,
            event_description: item.RuleComment,
            time_start: item.ActiveFrom,
            time_end: item.ActiveTo,
            location: direccion,
            distance: item.Distance,
            duration: timeString
          };
          return res;
      },{concurrency: 100}
      ).filter(x => typeof x !== 'undefined');
      //Insertar en la base de datos para arca
       await insertArca.insertData(result);

    }
    console.timeEnd('chunk');
    //Se muestra un mensaje en consola cuando se ha completado el envio de datos a arca
    console.log('El envio de datos a BD se ha completado');
    }catch(err){
      throw err;
    }
  }



}

