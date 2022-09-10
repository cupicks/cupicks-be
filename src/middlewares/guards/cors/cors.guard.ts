import * as cors from "cors";

export function getCorsMiddleware(FRONT_URL_LIST_WITHOUT_PORT: string[]) {
    return cors({
        methods: ["GET", "POST", "FETCH", "PUT", "DELETE", "OPTION"],
        allowedHeaders: ["content-type", "Content-Type", "authorization"],
        origin: FRONT_URL_LIST_WITHOUT_PORT,
    });
}
