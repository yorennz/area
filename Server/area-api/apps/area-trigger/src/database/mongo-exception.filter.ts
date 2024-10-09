import { ArgumentsHost, Catch, ConflictException, ExceptionFilter } from '@nestjs/common';
import { MongoError } from 'mongodb';

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
    catch(exception: MongoError, host: ArgumentsHost) {
        const ctx = host.switchToHttp(),
            response = ctx.getResponse();
        var status = 500;
        var message = "Error database";
        var error = exception.errmsg;
        switch (exception.code) {
            case 11000:
                status = 409;
                message = "Data already exist"
        }
        return response.status(status).json({
            message: message,
            error: error,
            statusCode: status,
        })
    }
}