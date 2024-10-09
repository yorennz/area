import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class HashToolService {

    async hashBcrypt(Data: string): Promise<string> {
        try {
            const salt = await bcrypt.genSalt()
            const hash = await bcrypt.hash(Data, salt)
            return hash
        } catch (error) {
            throw new InternalServerErrorException(error.message)
        }
    }

    async hashMd5(data: string): Promise<string> {
        try {
            const md5 = crypto.createHash('md5').update(data).digest("hex");
            return md5
        } catch (error) {
            throw new InternalServerErrorException(error.message)
        }
    }

    async checkHash(data: string, hash: string): Promise<boolean> {
        try {
            const isMatch = await bcrypt.compare(data, hash);
            return isMatch
        } catch (error) {
            throw new InternalServerErrorException(error.message)
        }
    }

    async genToken(email: string): Promise<[string, string]> {
        const tokenHashBcrypt = await this.hashBcrypt(email)
        const tokenHashMd5First = await this.hashMd5(tokenHashBcrypt)
        const tokenHashMd5Second = await this.hashMd5(tokenHashMd5First)
        return [tokenHashMd5First, tokenHashMd5Second]
    }
}
