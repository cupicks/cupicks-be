import * as cors from "cors";

export function getCorsMiddleware(CORS_ORIGIN_LIST: string[]) {
    return cors({
        methods: ["GET", "POST", "FETCH", "PUT", "DELETE", "OPTION"],
        allowedHeaders: ["content-type", "Content-Type", "authorization"],
        origin: "*",
    });
}
