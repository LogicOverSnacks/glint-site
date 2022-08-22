export { BaseComponent } from './base.component';

export const toQueryParamsString = (queryParams: Record<string, any>) =>
  Object.entries(queryParams).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&');
