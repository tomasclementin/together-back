import { CognitoUserSession } from 'amazon-cognito-identity-js';

import { LoginDto } from '../../application/dto/login.dto';
import { SignupDto } from '../../application/dto/signup.dto';

export const AUTH_PROVIDER = 'AUTH_PROVIDER';
export interface IAuthProvider {
  signup(user: SignupDto): Promise<string>;
  login(loginDto: LoginDto): Promise<CognitoUserSession>;
}
