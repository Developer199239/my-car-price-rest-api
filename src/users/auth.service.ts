import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";
import { UsersService } from "./users.service";

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService{
    constructor(private userService: UsersService) {}

    async signup(email: string, password: string) {
        const users = await this.userService.find(email);
        if(users.length) {
            throw new BadRequestException('email is use');
        }
        
        //Hash the users password
        //General a salt
        const salt = randomBytes(8).toString('hex');

        //Hash the salt and the password together
        const hash =  (await scrypt(password, salt, 32)) as Buffer;

        //Join the hashed result and the salf togher
        const encodedPassword = salt + '.' + hash.toString('hex');

        // Create a new user and save it
        const user = await this.userService.create(email, encodedPassword);

        //return the user
        return user;
    }

    async signin(email: string, password: string) {
        const [user] = await this.userService.find(email);
        if(!user) {
            throw new NotFoundException('User not found');
        }

        const [salt, storeHash] = user.password.split('.');
        const hash = (await scrypt(password, salt, 32)) as Buffer;

        if(storeHash !== hash.toString('hex')) {
            throw new BadRequestException('Bad password');
        } 
        return user
    }
}