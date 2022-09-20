import * as exporter from "../../../../src/routes/repositories/_.exporter";

it("serviceExporter has 4 Controller", () => expect(Object.keys(exporter).length).toBe(6));
