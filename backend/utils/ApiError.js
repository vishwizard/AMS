export default class ApiError extends Error {
    constructor(statusCode, data, message="Something went wrong", errors=[]){
        super(message);
        this.statusCode=statusCode;
        this.data=data;
        this.message=message;
        this.errors=errors;
        this.success=false;
        Error.captureStackTrace(this,this.constructor);
    }
}