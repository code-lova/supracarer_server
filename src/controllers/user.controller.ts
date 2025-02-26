import User from "../models/user.model";
import catchErrors from "../utils/catchErrors";
import appAssert from "../utils/appAssert";
import { NOT_FOUND, OK } from "../constants/http";


export const getUserHandler = catchErrors(async (req, res) => {

    const user = await User.findById(req.user?.id);
    appAssert(user, NOT_FOUND, "User not found");
    return res.status(OK).json(user.omitPassword());

});