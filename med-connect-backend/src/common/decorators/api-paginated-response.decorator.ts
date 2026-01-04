import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { IPaginatedResponse } from '../interfaces/pagination.interface';

export const ApiPaginatedResponse = <TModel extends Type<any>>(
  model: TModel,
) => {
  return applyDecorators(
    ApiExtraModels(model),
    ApiOkResponse({
      description: 'Successfully retrieved paginated data',
      schema: {
        allOf: [
          {
            properties: {
              success: {
                type: 'boolean',
                example: true,
              },
              message: {
                type: 'string',
                example: 'Data retrieved successfully',
              },
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
              meta: {
                type: 'object',
                properties: {
                  page: {
                    type: 'number',
                    example: 1,
                  },
                  limit: {
                    type: 'number',
                    example: 20,
                  },
                  totalItems: {
                    type: 'number',
                    example: 100,
                  },
                  totalPages: {
                    type: 'number',
                    example: 5,
                  },
                  hasNextPage: {
                    type: 'boolean',
                    example: true,
                  },
                  hasPrevPage: {
                    type: 'boolean',
                    example: false,
                  },
                  nextPage: {
                    type: 'number',
                    example: 2,
                  },
                  prevPage: {
                    type: 'number',
                    example: null,
                  },
                },
              },
              timestamp: {
                type: 'string',
                format: 'date-time',
                example: '2024-01-04T12:00:00.000Z',
              },
            },
          },
        ],
      },
    }),
  );
};

