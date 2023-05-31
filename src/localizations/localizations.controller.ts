/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Get,
  Logger,
  Param,
  Response,
  StreamableFile,
} from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';

import { Response as ResponseType } from 'express';
import { createReadStream } from 'fs';

import { LocalizationsService } from './localizations.service';

const _ControllerPath = 'localizations';

@Controller(_ControllerPath)
export class LocalizationsController {
  constructor(private readonly localizationsService: LocalizationsService) {}

  @ApiParam({
    name: 'lng',
    type: String,
    description: 'Language',
    example: 'en',
  })
  @ApiParam({
    name: 'ns',
    type: String,
    description: 'Namespace',
    example: 'translation.json',
  })
  @Get(':lng/:ns')
  getFile(
    @Response({ passthrough: true }) res: ResponseType,
    @Param('lng') lng: string,
    @Param('ns') ns: string
  ) {
    res.set({
      'Content-Type': 'application/json',
    });

    const path = this.localizationsService.getFilePath(lng, ns);

    const fileReadStream = createReadStream(path, {
      encoding: null,
    });

    return new StreamableFile(fileReadStream).setErrorHandler((err) => {
      Logger.error(err);
    });
  }
}
