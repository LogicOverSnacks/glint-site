import { Injectable } from '@angular/core';

export type Currency = 'CNY' | 'EUR' | 'GBP' | 'JPY' | 'USD';

@Injectable({ providedIn: 'root' })
export class CurrencyService {
  private static readonly cnyCountries = [
    'Asia/Shanghai',
    'Asia/Urumqi'
  ];

  private static readonly gbpCountries = [
    'Atlantic/South_Georgia',
    'Atlantic/St_Helena',
    'Europe/Gibraltar',
    'Europe/Guernsey',
    'Europe/Isle_of_Man',
    'Europe/Jersey',
    'Europe/London'
  ];

  private static readonly jpyCountries = [
    'Asia/Tokyo'
  ];

  get currencies(): { id: Currency; displayText: string; }[] {
    return [
      { id: 'USD', displayText: 'USD $' },
      { id: 'CNY', displayText: 'CNY 元' },
      { id: 'EUR', displayText: 'EUR €' },
      { id: 'GBP', displayText: 'GBP £' },
      { id: 'JPY', displayText: 'JPY 円' },
    ];
  }

  getCurrency(): Currency {
    const timezone = Intl.DateTimeFormat().resolvedOptions()?.timeZone;

    if (CurrencyService.cnyCountries.includes(timezone))
      return 'CNY';

    if (CurrencyService.gbpCountries.includes(timezone))
      return 'GBP';

    if (CurrencyService.jpyCountries.includes(timezone))
      return 'JPY';

    if (timezone?.startsWith('Europe'))
      return 'EUR';

    return 'USD';
  }

  getPriceText(currency: Currency, price: number) {
    return currency === 'CNY' ? `${price}元`
      : currency === 'EUR' ? `€${price}`
      : currency === 'GBP' ? `£${price}`
      : currency === 'JPY' ? `${price}円`
      : `$${price}`;
  }
}
