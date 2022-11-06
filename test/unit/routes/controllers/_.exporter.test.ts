import * as exporter from "../../../../src/routes/controllers/_.exporter";

it("controllerExporter has 6 Controller", () => expect(Object.keys(exporter).length).toBe(6));
