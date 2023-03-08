import { Injectable } from '@angular/core';

import { Currency } from './currency.service';

@Injectable({ providedIn: 'root' })
export class PriceService {
  getPriceInfo(currency: Currency, frequency: 'month' | 'year') {
    const priceId =
      currency === 'CNY' ? frequency === 'month' ? 'price_1Mj06CDHQ0P4M2Je9knh6KFG' : 'price_1Mj06mDHQ0P4M2Jer308dYlV'
      : currency === 'EUR' ? frequency === 'month' ? 'price_1LBiVnDHQ0P4M2JeF1YU18pY' : 'price_1MAFDnDHQ0P4M2Jekbgap1ci'
      : currency === 'GBP' ? frequency === 'month' ? 'price_1L8jX9DHQ0P4M2Jef54yz8Vf' : 'price_1MADpLDHQ0P4M2JeYpMnekbG'
      : currency === 'JPY' ? frequency === 'month' ? 'price_1Mj0HCDHQ0P4M2Je2bxyCJqX' : 'price_1Mj0HdDHQ0P4M2JeKAeWQAZw'
      : frequency === 'month' ? 'price_1LBiVPDHQ0P4M2JeZTmkJwdu' : 'price_1MAFDdDHQ0P4M2Je55BFMpnA';

    const price =
      currency === 'CNY' ? frequency === 'month' ? 30 : 250
      : currency === 'EUR' ? frequency === 'month' ? 4 : 35
      : currency === 'GBP' ? frequency === 'month' ? 4 : 35
      : currency === 'JPY' ? frequency === 'month' ? 600 : 5000
      : frequency === 'month' ? 4 : 35;

    return { price, priceId };
  }
}
