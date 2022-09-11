import { CanActivate, ExecutionContext } from '@nestjs/common';

export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    // canActivate will process the request if the userId is truthy and if falsy will reject the request -> Forbidden resource
    return request.session.userId;
  }
}
