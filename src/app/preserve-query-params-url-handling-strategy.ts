import { PlatformLocation } from '@angular/common';
import { UrlHandlingStrategy, UrlTree } from '@angular/router';

export class PreserveQueryParamsUrlHandlingStrategy implements UrlHandlingStrategy {
  private static preserved = ['via'];

  constructor(private platformLocation: PlatformLocation) {}

  shouldProcessUrl(url: UrlTree) {
    return true;
  }

  extract(url: UrlTree) {
    const currentQueryParams = new URLSearchParams(this.platformLocation?.search ?? '');
    for (const [key, value] of currentQueryParams.entries()) {
      if (!PreserveQueryParamsUrlHandlingStrategy.preserved.includes(key)) continue;

      const newValue = url.queryParams[key];
      if (newValue === '')
        delete url.queryParams[key];
      else if (value && !newValue)
        url.queryParams[key] = value;
    }

    return url;
  }

  merge(newUrlPart: UrlTree, rawUrl: UrlTree) {
    return newUrlPart;
  }
}
