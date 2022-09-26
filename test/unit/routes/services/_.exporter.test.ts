import * as exporter from "../../../../src/routes/services/_.exporter";

it("routerExporter has 5 Controller", () => expect(Object.keys(exporter).length).toBe(5));
