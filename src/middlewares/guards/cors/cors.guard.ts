import * as cors from "cors";

export function getCorsMiddleware(CORS_ORIGIN_LIST: string[]) {
    cors({
        methods: ["GET", "POST", "FETCH", "PUT", "DELETE", "OPTION"],
        allowedHeaders: ["content-type", "authorization"],
        origin: CORS_ORIGIN_LIST,
    });

    return cors;
}
