import { ApiProperty } from '@nestjs/swagger';

export class ResponseDto {
    @ApiProperty({ description: 'Status code', })
    statusCode: number;

    @ApiProperty({ description: 'Reponse message',  })
    message: string;

    constructor(message: string, statusCode: number) {
        this.message = message;
        this.statusCode = statusCode;
    }
}
