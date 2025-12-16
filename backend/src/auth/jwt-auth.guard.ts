import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;
    if (req) {
      return req;
    }

    // Subscription or WS context
    const gqlContext = ctx.getContext();
    const connection = gqlContext.connection || {};
    const client = connection.context || gqlContext;

    // Ensure headers exist for JwtStrategy
    if (!client.headers) {
      client.headers = {};
      const params = client.connectionParams || {};
      client.headers['authorization'] = params['Authorization'] || params['authorization'];
    }

    // Add mock logIn for Passport compatibility
    client.logIn = client.logIn || (() => Promise.resolve());

    return client;
  }
}
