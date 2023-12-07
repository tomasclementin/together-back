import { ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';

@UseInterceptors(ClassSerializerInterceptor)
export class BaseController {}
