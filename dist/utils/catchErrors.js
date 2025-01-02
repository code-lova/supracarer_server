"use strict";
//adding a customing type for the below function
//since there is not a specific type
Object.defineProperty(exports, "__esModule", { value: true });
const catchErrors = (controller) => async (req, res, next) => {
    try {
        await controller(req, res, next);
    }
    catch (error) {
        next(error);
    }
};
exports.default = catchErrors;
