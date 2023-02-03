export type AuthJwtPayload = {
  id: string;
  iat: number;
  exp: number;
};

export type AuthJwtSignPayload = {
  id: string;
};
