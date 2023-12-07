import { Base } from '@/common/domain/base.entity';

export class User extends Base {
  externalId: string;
  phoneNumber: string;
  name: string;
  lastName: string;
  email: string;
}
