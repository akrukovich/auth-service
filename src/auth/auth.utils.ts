import { RedisPrefix } from './auth.enums';

export const getAccessTokenKey = (id: number): string => `${RedisPrefix.AccessToken}${id}`;

export const getRefreshTokenKey = (id: number): string => `${RedisPrefix.RefreshToken}${id}`;
