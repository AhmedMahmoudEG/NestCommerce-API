/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap, map } from 'rxjs';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    //this will run before router handler
    console.log('before route Handler');

    //this will run after it
    return next.handle().pipe(
      map((dataFromRouteHandler: any) => {
        const { password, ...rest } = dataFromRouteHandler;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return { ...rest };
      }),
    );
  }
}
