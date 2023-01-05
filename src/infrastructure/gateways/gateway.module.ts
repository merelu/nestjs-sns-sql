import { ExceptionsModule } from '@infrastructure/services/exceptions/exceptions.module';
import { LoggerModule } from '@infrastructure/services/logger/logger.module';
import { UseCasesProxyModule } from '@infrastructure/usecases-proxy/usecases-proxy.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [UseCasesProxyModule.register(), ExceptionsModule, LoggerModule],
  providers: [],
  exports: [],
})
export class GatewayModule {}
