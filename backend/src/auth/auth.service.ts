import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private jwt: JwtService) { }

    async validateUser(password: string, hash: string) {
        return bcrypt.compare(password, hash);
    }

    async generateToken(user: any) {
        return this.jwt.sign({
            sub: user.id,
            email: user.email,
        });
    }
}
