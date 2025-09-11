import { ErrorHandler } from '@angular/core';
import { GlobalErrorHandlerService } from './global-error-handler.service';

export const provideGlobalErrorHandler = () => ({
  provide: ErrorHandler,
  useClass: GlobalErrorHandlerService,
});
