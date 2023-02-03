import { SetMetadata } from '@nestjs/common';
import { APP_CONFIG } from 'src/app.config';

export const IsPublic = () =>
  SetMetadata(APP_CONFIG.PUBLIC_ENDPOINT_METADATA, true);
