import { Body, Controller, Post, Get, Patch, Param, Query, Delete, NotFoundException, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { Serialize } from '../interceptors/serialize.interceptors';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { UsersService } from './users.service';

@Controller('auth')
// @Serialize(UserDto)
export class UsersController {
    constructor(private usersService: UsersService){}
    @Post('/signup')
    createUser(@Body() body: CreateUserDto){
        this.usersService.create(body.email, body.password);
    }

    @Serialize(UserDto)
    @Get('/:id')
    async findUser(@Param('id') id: string) {
        const user =  await this.usersService.findOne(parseInt(id));
        if(!user) {
            throw new NotFoundException('Not found user');
        }
        return user;
    }

    @Get()
    findAllUsers(@Query('email') email: string){
        return this.usersService.find(email);
    }

    @Delete('/:id')
    removeUser(@Param('id') id: string){
        return this.usersService.remove(parseInt(id));
    }

    @Patch('/:id')
    updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
        return this.usersService.update(parseInt(id), body);
    }
}