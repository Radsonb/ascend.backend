import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './shared/prisma/prisma.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [AuthModule, PrismaModule, UserModule],
})
export class AppModule {}
