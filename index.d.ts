import mongoose from "mongoose";


declare global {
    namespace Express {
      interface Request {
        user?: {
          id: string;
          role: UserRole;
        };
      }
    }
}
export {};