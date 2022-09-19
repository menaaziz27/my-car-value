import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { UsersService } from '../users.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  // when this interceptor being executed ?
  // before any request reach any controller in our app
  // this interceptor is made to use dependency injection of user service which we cannot use in normal decorators
  constructor(private userService: UsersService) {}
  async intercept(context: ExecutionContext, handler: CallHandler<any>) {
    const request = context.switchToHttp().getRequest();
    const { userId } = request?.session;

    // if there is a userId find the user and attach him to request
    if (userId) {
      const user = await this.userService.findOne(userId);
      request.currentUser = user;
    }

    // if userId is not found .. handle the route normally
    return handler.handle();
  }
}
