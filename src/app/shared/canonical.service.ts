import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CanonicalService {

  constructor(@Inject(DOCUMENT) private document: Document) {}

  updateCanonicalLink() {
    const url = this.document.URL.split('?')[0];
    this.getLinkElement().setAttribute('href', url);
  }

  private getLinkElement() {
    let element = this.document.querySelector<HTMLLinkElement>(`link[rel='canonical']`);
    if (!element) {
      element = this.document.createElement('link');
      element.setAttribute('rel', 'canonical');
      this.document.head.appendChild(element);
    }

    return element;
  }
}
