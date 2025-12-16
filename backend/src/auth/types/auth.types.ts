// Interface for the authenticated user from JWT token
export interface AuthenticatedUser {
  id: number;
  public_id: string;
  private_id: string;
  email: string;
  role: string;
}

// GraphQL Context interface
export interface GraphQLContext {
  req: {
    user: AuthenticatedUser;
  };
}
