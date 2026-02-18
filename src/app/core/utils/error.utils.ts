interface ErrorWithMessage {
  error?: {
    message?: string;
  };
}

export const extractErrorMessage = (error: unknown): string => {
  if (typeof error === 'string') return error;

  if (isErrorWithMessage(error)) {
    const message = error.error?.message;
    if (typeof message === 'string') {
      return message;
    }
  }

  return 'Unexpected error occurred';
};

const isErrorWithMessage = (value: unknown): value is ErrorWithMessage => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'error' in value &&
    typeof (value as { error?: unknown }).error === 'object' &&
    (value as { error?: unknown }).error !== null &&
    'message' in (value as { error?: { message?: unknown } }).error!
  );
};
