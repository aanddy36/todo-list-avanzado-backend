export enum AuthOptions {
  "ADMIN",
  "USER",
  "BOTH",
}

export enum Role {
  "ADMIN" = "admin",
  "USER" = "user",
}

export interface JwtPayload {
  id: string;
  email: string;
  role: Role;
  iat: number;
  exp: number;
}
