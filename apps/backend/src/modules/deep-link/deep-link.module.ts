import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeepLink } from './entities/deep-link.entity';
import { DeepLinkService } from './deep-link.service';
import { DeepLinkController } from './deep-link.controller';
import { DeepLinkRedirectController } from './deep-link-redirect.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DeepLink])],
  controllers: [DeepLinkController, DeepLinkRedirectController],
  providers: [DeepLinkService],
  exports: [DeepLinkService],
})
export class DeepLinkModule {}
