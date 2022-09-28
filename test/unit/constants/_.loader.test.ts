import * as loader from "../../../src/constants/_.loader";

it("constantsLoader has 5 Controller", () => expect(Object.keys(loader).length).toBe(6));
