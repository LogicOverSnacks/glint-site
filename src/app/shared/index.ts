import { environment } from 'src/environments/environment';

export { BaseComponent } from './base.component';

export const ApiBaseUrl = environment.production ? 'https://api.glint.info' : 'http://localhost:8082';
