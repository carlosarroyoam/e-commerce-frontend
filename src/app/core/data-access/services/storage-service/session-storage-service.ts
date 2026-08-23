import { Injectable } from '@angular/core';

import { APP_NAMESPACE } from '@/core/constants/storage-keys.constants';
import { StorageService } from '@/core/data-access/services/storage-service/storage-service';

/**
 * Almacenamiento por pestaña basado en sessionStorage, con el namespace de la app.
 */
@Injectable({
  providedIn: 'root',
})
export class SessionStorageService extends StorageService {
  protected readonly storage = sessionStorage;
  protected readonly namespace = APP_NAMESPACE;
}
