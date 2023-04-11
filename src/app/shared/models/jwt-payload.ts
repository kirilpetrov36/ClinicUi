export interface JwtPayload {
    token: string;
    refreshToken: string;
    tokenExpiration: Date;
    role: string;
    userId: string;
}