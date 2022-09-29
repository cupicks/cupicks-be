import * as loader from "../../../src/constants/_.loader";

it("constantsLoader has 6 Controller", () => expect(Object.keys(loader).length).toBe(6));
