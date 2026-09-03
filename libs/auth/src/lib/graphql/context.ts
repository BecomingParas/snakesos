import { auth } from '../authentication/config/better-auth.config';

export interface AuthContext {
  session: any;
  user: any;
  isAuthenticated: boolean;
}

export async function createAuthContext(req: Request): Promise<AuthContext> {
  try {
    const session = await auth.api.getSession({ headers: req.headers as any });
    
    return {
      session,
      user: session?.user,
      isAuthenticated: !!session,
    };
  } catch (error) {
    return {
      session: null,
      user: null,
      isAuthenticated: false,
    };
  }
}
