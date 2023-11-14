import config from "./config";
import ApiAdapterRepository from "./db/repositories/ApiAdapterRepository";
import GeotabService from "./services/GeotabService";
import ApiAdapterReportService from "./services/ApiAdapterReportService";

export const apiAdapterController = async() => {
  const {goDatabase, goPassword, goServer, goUsername} = config.geotab;

  const geotabService = new GeotabService(goUsername, goPassword, goDatabase, goServer);
  const apiAdapterRepository = new ApiAdapterRepository();

  const apiAdapterReportService = new ApiAdapterReportService(apiAdapterRepository,geotabService);
  const report = await apiAdapterReportService.getData();
}