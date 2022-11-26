import { IsEmail, IsString } from "class-validator";

IsEmail
export class CreateUserDto {
    @IsEmail()
    email: string;
    @IsString()
    password: string
}