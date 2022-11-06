import * as exporter from "../../../../src/routes/routers/_.exporter";

it("routerExporter has 6 Controller", () => expect(Object.keys(exporter).length).toBe(6));
