import { RoleName } from '../common/enums/role-name.enum';
export interface JwtPayload {
  sub: number;
  email: string;
  iat: number;
  exp: number;
  roles?: RoleName[];
}
