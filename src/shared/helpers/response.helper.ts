import { HttpStatusCode } from "../enums/http-codes.enum";
import { ResponsePayload } from "../interfaces/response-payload.interface";


function response<Type extends ResponsePayload>(
    data: any,
    response: Type,
    message = '',
    statusCode: HttpStatusCode = HttpStatusCode.SUCCESS,
    status = true,
): Type {
    response.code = statusCode;
    response.data = data;
    response.status = status;
    response.errorDescription = message;
    return response;
}

export default response;