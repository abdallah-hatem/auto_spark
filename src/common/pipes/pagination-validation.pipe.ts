import { ArgumentMetadata, Injectable, PipeTransform, ValidationPipe } from '@nestjs/common';

@Injectable()
export class PaginationValidationPipe extends ValidationPipe {
  constructor() {
    super({
      whitelist: true,
      forbidNonWhitelisted: false, // Allow filter[*] parameters
      transform: true,
      // Only validate known properties, ignore filter[*] ones
      skipMissingProperties: false,
    });
  }

  async transform(value: any, metadata: ArgumentMetadata) {
    // If this is query validation, filter out filter[*] properties for validation
    if (metadata.type === 'query') {
      const filteredValue = { ...value };
      
      // Remove filter[*] properties for validation but keep standard ones
      Object.keys(filteredValue).forEach(key => {
        if (key.match(/^filter\[.+\]$/)) {
          delete filteredValue[key];
        }
      });
      
      // Validate only the core pagination properties
      return super.transform(filteredValue, metadata);
    }
    
    return super.transform(value, metadata);
  }
} 