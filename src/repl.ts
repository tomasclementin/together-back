import { repl } from '@nestjs/core';

import { AppModule } from '@/module/app.module';

async function bootstrap() {
  await repl(AppModule);
}

bootstrap().then(() => console.log('bootstrap'));
