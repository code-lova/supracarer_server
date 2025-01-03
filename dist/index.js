"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const db_1 = __importDefault(require("./config/db"));
const env_1 = require("./constants/env");
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
const http_1 = require("./constants/http");
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const authenticate_1 = __importDefault(require("./middleware/authenticate"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const session_route_1 = __importDefault(require("./routes/session.route"));
const app = (0, express_1.default)();
// Define a whitelist of allowed origins
app.use((0, cors_1.default)({
    origin: env_1.APP_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.get("/health", (req, res, next) => {
    res.status(http_1.OK).json({
        status: "Healthy",
    });
});
app.use("/auth", auth_route_1.default);
//protected routes
app.use("/user", authenticate_1.default, user_route_1.default);
app.use("/sessions", authenticate_1.default, session_route_1.default);
app.use(errorHandler_1.default);
app.listen(env_1.PORT, async () => {
    console.log(`Server is live on port ${env_1.PORT} in ${env_1.NODE_ENV} environment`);
    await (0, db_1.default)();
});
