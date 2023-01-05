import { HttpStrategy } from '@infrastructure/common/strategies/http.strategy';
import { ExceptionsModule } from '@infrastructure/services/exceptions/exceptions.module';
import { UseCasesProxyModule } from '@infrastructure/usecases-proxy/usecases-proxy.module';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { AuthController } from './auth/auth.controller';
import { ChatController } from './chat/chat.controller';
import { CoupleController } from './couple/couple.controller';
import { FeedController } from './feed/feed.controller';
import { HealthController } from './health/health.controller';
import { UserController } from './user/user.controller';

@Module({
  imports: [UseCasesProxyModule.register(), ExceptionsModule, TerminusModule],
  controllers: [
    UserController,
    AuthController,
    CoupleController,
    FeedController,
    ChatController,
    HealthController,
  ],
  providers: [HttpStrategy],
})
export class ControllersModule {}
