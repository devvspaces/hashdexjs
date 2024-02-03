import { applyDecorators } from '@nestjs/common/decorators';
import { ApiHeader } from '@nestjs/swagger';

export const API_KEY_HEADER = 'x-api-key';

export function ApiHeaders() {
  return applyDecorators(
    ApiHeader({
      name: API_KEY_HEADER,
      description: 'description',
    }),
  );
}
