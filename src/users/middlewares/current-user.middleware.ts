import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { nextTick } from "process";
import { User } from "../user.entity";
import { UsersService } from "../users.service";

declare global {
    namespace Express {
        interface Request {
            currentUser?: User; 
        }
    }
}


@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
    constructor(private userService: UsersService){}
    
    async use(req: Request, res: Response, next: NextFunction) {
        const {userId} = req.session || {};
        if(userId) {
            console.log(userId)
            const user = await this.userService.findOne(parseInt(userId));
            req.currentUser = user;
        }

        next();
    }
}