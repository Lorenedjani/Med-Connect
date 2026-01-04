export interface IJwtPayload {
  sub: string; // User ID
  email: string;
  role: string;
  isVerified?: boolean;
  iat?: number;
  exp?: number;
  jti?: string; // JWT ID for token tracking
}

export interface IRefreshTokenPayload {
  sub: string;
  tokenId: string;
  email?: string;
  role?: string;
  iat?: number;
  exp?: number;
}

export interface ITokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface ITokenBlacklistEntry {
  tokenId: string;
  userId: string;
  expiresAt: Date;
  createdAt: Date;
}
