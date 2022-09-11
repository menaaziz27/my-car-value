import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    // console.log(data); data will be whatever being passed in the decorator param @CurrentUser(123) -> data = 123
    const request = context.switchToHttp().getRequest();
    const user = request.currentUser;
    return user;
  },
);
