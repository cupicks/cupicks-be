import { getMockRequest, getMockResponse } from "./http/node.mocks.https";
import * as routesExporter from "./routes/_.exporter";
import * as modulesExporter from "./modules/_.exporter";

export const mockHttp = {
    getMockRequest,
    getMockResponse,
};
export const mockRoute = routesExporter;
export const mockModule = modulesExporter;
