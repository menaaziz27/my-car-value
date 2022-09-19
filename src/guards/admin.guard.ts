import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

export class AdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    // interceptors always gonna run after any middleware and after any guards .. that why admin guard always return false -> because the interceptor of current-user always run after the guard so there's no request.currentUser attached in the request
    if (!request.currentUser) {
      return false; // check if the user is signed in first
    }

    return request.currentUser.admin; // if the user is admin ok proceeed to the handler .. if false reject the request
  }
}
