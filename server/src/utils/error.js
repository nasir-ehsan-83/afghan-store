export class AppError extends Error {
  status = 400;
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

export const notFound = (resource = 'Resource') => {
  return new AppError(`${resource} not found`, 404);
};

export const badRequest = (message) => {
  return new AppError(message, 400);
};

export const unauthorized = (message = 'Unauthorized') => {
  return new AppError(message, 401);
};

export const forbidden = (message = 'Forbidden') => {
  return new AppError(message, 403);
};

export const conflict = (message) => {
  return new AppError(message, 409);
};