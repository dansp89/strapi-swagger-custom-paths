export type ErrorResponseParams = {
  status: number;
  name: string;
  message: string;
  description: string;
};

export function makeErrorResponse({ status, name, message, description }: ErrorResponseParams) {
  return {
    description,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            data: {
              type: 'string',
              nullable: true,
              example: null
            },
            error: {
              type: 'object',
              properties: {
                status: { type: 'number', example: status },
                name: { type: 'string', example: name },
                message: { type: 'string', example: message },
                details: { type: 'object' }
              }
            }
          }
        }
      }
    }
  };
}

export const defaultErrors: Record<string, any> = {
  400: makeErrorResponse({
    status: 400,
    name: 'BadRequestError',
    message: 'Bad Request',
    description: 'Bad Request'
  }),
  401: makeErrorResponse({
    status: 401,
    name: 'UnauthorizedError',
    message: 'Unauthorized',
    description: 'Unauthorized'
  }),
  403: makeErrorResponse({
    status: 403,
    name: 'ForbiddenError',
    message: 'Forbidden',
    description: 'Forbidden'
  }),
  404: makeErrorResponse({
    status: 404,
    name: 'NotFoundError',
    message: 'Not Found',
    description: 'Not Found'
  }),
  500: makeErrorResponse({
    status: 500,
    name: 'InternalServerError',
    message: 'Internal Server Error',
    description: 'Internal Server Error'
  })
};