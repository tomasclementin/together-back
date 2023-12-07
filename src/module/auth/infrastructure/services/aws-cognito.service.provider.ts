import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
  CognitoUserSession,
} from 'amazon-cognito-identity-js';

import { LoginDto } from '../../application/dto/login.dto';
import { SignupDto } from '../../application/dto/signup.dto';
import { IAuthProvider } from './authorization.provider.interface';

import { Injectable } from '@nestjs/common';

export interface AccessTokenDto {
  sub: string;
  iss: string;
  client_id: string;
  origin_jti: string;
  event_id: string;
  token_use: string;
  scope: string;
  auth_time: number;
  exp: number;
  iat: number;
  jti: string;
  username: string;
}

@Injectable()
export class AwsCognitoServiceProvider implements IAuthProvider {
  private userPool: CognitoUserPool;

  constructor() {
    this.userPool = new CognitoUserPool({
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      ClientId: process.env.COGNITO_APP_CLIENT_ID,
      endpoint: process.env.COGNITO_ENDPOINT,
    });
  }

  async login(loginDto: LoginDto): Promise<CognitoUserSession> {
    return new Promise((resolve, reject) => {
      const authentication = {
        Username: loginDto.email,
        Password: loginDto.password,
      };

      const authenticationDetails = new AuthenticationDetails(authentication);

      const user = {
        Username: loginDto.email,
        Pool: this.userPool,
      };

      const cognitoUser = new CognitoUser(user);
      cognitoUser.setAuthenticationFlowType('USER_PASSWORD_AUTH');

      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result: CognitoUserSession) {
          resolve(result);
        },
        onFailure: function (err) {
          reject(err);
        },
      });
    });
  }

  async signup(user: SignupDto): Promise<string> {
    const { name, lastName, email, password, phoneNumber } = user;
    const attributes = [];
    const _name = {
      Name: 'name',
      Value: name,
    };
    const _email = {
      Name: 'email',
      Value: email,
    };
    const _familyName = {
      Name: 'family_name',
      Value: lastName,
    };

    const _phoneNumber = {
      Name: 'phone_number',
      Value: phoneNumber,
    };

    const attributeEmail = new CognitoUserAttribute(_email);
    const attributeName = new CognitoUserAttribute(_name);
    const attributeFamilyName = new CognitoUserAttribute(_familyName);
    const attributePhoneNumber = new CognitoUserAttribute(_phoneNumber);

    attributes.push(attributeName);
    attributes.push(attributeEmail);
    attributes.push(attributeFamilyName);
    attributes.push(attributePhoneNumber);

    return new Promise((resolve, reject) => {
      this.userPool.signUp(email, password, attributes, null, (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(result.userSub);
      });
    });
  }
}
