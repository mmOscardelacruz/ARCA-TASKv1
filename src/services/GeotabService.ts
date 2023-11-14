import { Device } from '../interfaces/Geotab/Devices';
import { DeviceStatusInfo } from '../interfaces/Geotab/DeviceStatusInfo';
import { ExceptionEvents } from '../interfaces/Geotab/ExceptionEvents';
import { GetAddressInterface } from '../interfaces/Geotab/GetAddressInterface';
import { Group } from '../interfaces/Geotab/Group';
import { LogRecord } from '../interfaces/Geotab/LogRecord';
import { StatusData } from '../interfaces/Geotab/StatusData';
import {  API, GeotabHelper } from '../utils/helpers/GeotabHelper';

class GeotabService {
  private geotabHelper: GeotabHelper;
  
  constructor(username: string, password: string, database: string, server: string) {
    this.geotabHelper = new GeotabHelper(username, password, database, server);
    
  }

  async getApi() {
    return await this.geotabHelper.getApi();
  }

  async getDevices(deviceId:string): Promise<Device[]> {
    try {
      const api = await this.getApi() as API;
      const devices: Device[] = await api.call('Get', {
        typeName: 'Device',
        search: {
          id: deviceId
        }
      });

      return devices;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getDevicesAux(): Promise<Device[]> {
    try {
      const api = await this.getApi() as API;
      const devices: Device[] = await api.call('Get', {
        typeName: 'Device',
        
      });

      return devices;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getGroups(): Promise<Group[]> {
    try {
      const api = await this.getApi() as API;
      const groups: Group[] = await api.call('Get', {
        typeName: 'Group'
      });

      return groups;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getDeviceStatusInfo(): Promise<DeviceStatusInfo[]> {
    try {
      const api = await this.getApi() as API;
      const devices: DeviceStatusInfo[] = await api.call('Get', {
        typeName: 'DeviceStatusInfo'
      });

      return devices;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getStatusData(fromDate: string, toDate: string, diagnosticId: string, deviceId: string): Promise<StatusData[]> {
    try {
      const api = await this.getApi() as API;
      const statusData: StatusData[] = await api.call('Get', {
        typeName: 'StatusData',
        search: {
          fromDate,
          toDate,
          diagnosticSearch: {
            id: diagnosticId
          },
          deviceSearch: {
            id: deviceId
          }
        }
        
      });

      return statusData;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getExceptions(fromDate: string, toDate: string, ruleId: string, deviceId: string): Promise<ExceptionEvents[]> {
    try {
      const api = await this.getApi() as API;
      const exceptionEvents: ExceptionEvents[] = await api.call('Get', {
        typeName: 'ExceptionEvent',
        search: {
          fromDate,
          toDate,
          ruleSearch: {
            id: ruleId
          },
          deviceSearch: {
            id: deviceId
          }
        }
        
      });

      return exceptionEvents;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getLogRecord(fromDate: string, toDate: string, deviceId: string, resultsLimit?: number): Promise<LogRecord[]> {
    try {
      
      const api = await this.getApi() as API;
      const logRecords: LogRecord[] = await api.call('Get', {
        typeName: 'LogRecord',
        search: {
          fromDate,
          toDate,
          deviceSearch: {
            id: deviceId
          }
        },
        resultsLimit: resultsLimit ?? null
      });

      return logRecords;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getAddresses(x: number, y: number): Promise<any> {
    try{
      const api = await this.getApi() as API;
      const [addresses] = await api.call('GetAddresses', {
        coordinates: [{x, y}]
      
      });
      const {formattedAddress} = addresses as GetAddressInterface;
      if(!formattedAddress){
        return 'Address not found'
      }

      return formattedAddress
    } catch(error){
      console.error(error);
      throw error;
    }
  }

  async getMultiLogRecord(data:any[]): Promise<any>{
    try{
      const api = await this.getApi() as API;
      const res = await api.multicall([['Get', 
      {typeName: 'LogRecord', search: {fromDate: data[0], toDate: data[0], deviceSearch: {id: data[0]}}}]])
    }catch(error){
      console.error(error);
      throw error;
    }
  }

  
}

export default GeotabService;
