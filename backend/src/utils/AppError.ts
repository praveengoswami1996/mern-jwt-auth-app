import AppErrorCode from "../constants/appErrorCode";
import { HttpStatusCode } from "../constants/http";

//This class will handle our custom errors

class AppError extends Error {
    constructor(
        public statusCode: HttpStatusCode,
        public message: string,
        public errorCode?: AppErrorCode
    ){
        super(message);
    }
}

export default AppError;