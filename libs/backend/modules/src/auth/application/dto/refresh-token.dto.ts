export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    phone: string | null;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
  expiresIn: number;
}
