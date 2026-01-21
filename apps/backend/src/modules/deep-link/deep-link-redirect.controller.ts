import { Controller, Get, Header, Param, Req, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { Public } from '../auth/decorators/public.decorator';
import { DeepLinkService } from './deep-link.service';

@Public()
@ApiTags('Deep Links')
@Controller('dl')
export class DeepLinkRedirectController {
  constructor(private readonly deepLinkService: DeepLinkService) {}

  @Get(':code')
  @ApiOperation({ summary: 'Resolve deep link by short code' })
  @ApiResponse({
    status: 302,
    description: 'Redirects to store, app link, or web URL',
  })
  @Header('Cache-Control', 'no-store')
  async redirect(
    @Param('code') code: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const deepLink = await this.deepLinkService.findByShortCode(code);
    const resolution = this.deepLinkService.resolveRedirect(
      deepLink,
      req.headers['user-agent'],
    );

    if (resolution.type === 'direct') {
      res.redirect(302, resolution.url);
      return;
    }

    res.status(200).send(resolution.htmlContent);
  }
}
