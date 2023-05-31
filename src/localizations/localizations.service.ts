import { Injectable } from '@nestjs/common';

import { join } from 'path';

@Injectable()
export class LocalizationsService {
  getFilePath(lng: string, ns: string) {
    const internalLanguagePath = lng;
    const internalNamespacePath = ns;
    const path = join(
      process.cwd(),
      `/static/i18n/${internalLanguagePath}/${internalNamespacePath}`
    );

    return path;
  }
}
