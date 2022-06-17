import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CurrencyService {
  private static readonly gbpCountries = [
    'Atlantic/South_Georgia',
    'Atlantic/St_Helena',
    'Europe/Gibraltar',
    'Europe/Guernsey',
    'Europe/Isle_of_Man',
    'Europe/Jersey',
    'Europe/London'
  ];

  getCurrency() {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    if (CurrencyService.gbpCountries.includes(timezone))
      return 'GBP';

    if (timezone.startsWith('Europe'))
      return 'EUR';

    return 'USD';
  }
}
