
const getEnv = (key: string, defaultValue?: string): string => {
    const value = process.env[key] || defaultValue;

    if(value === undefined){
        throw new Error(`Missing enviroment variable ${key}`)
    }

    return value;
}


export const MONGO_URI = getEnv("MONGO_URI");
export const NODE_ENV = getEnv("NODE_ENV", "production");
export const PORT = getEnv("PORT", "4004");
export const APP_ORIGIN = getEnv("APP_ORIGIN");
export const JWT_SECRET = getEnv("JWT_SECRET");
export const JWT_REFRESH_SECRET = getEnv("JWT_REFRESH_SECRET");
export const GRIEVANCE_EMAIL = getEnv("GRIEVANCE_EMAIL");
export const GRIEVANCE_EMAIL_PASSWORD = getEnv("GRIEVANCE_EMAIL_PASSWORD");

