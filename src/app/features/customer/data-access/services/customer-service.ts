import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '@/environments/environment';
import { CustomerQueryParams } from '@/features/customer/data-access/interfaces/customer-query-params';
import { CustomerResponse } from '@/features/customer/data-access/interfaces/customer-response';
import { PagedCustomersResponse } from '@/features/customer/data-access/interfaces/paged-customers-response';

/**
 * Encapsula las llamadas HTTP al recurso de clientes.
 */
@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private readonly httpClient = inject(HttpClient);

  /**
   * Obtiene el listado paginado de clientes según los filtros y parámetros indicados.
   *
   * @param queryParams Filtros, ordenamiento y paginación a aplicar.
   * @returns Observable con la página de clientes.
   */
  public findAll({
    firstName,
    lastName,
    email,
    status,
    startDate,
    endDate,
    page,
    size,
    sort,
  }: CustomerQueryParams): Observable<PagedCustomersResponse> {
    let params = new HttpParams();
    if (firstName) params = params.append('firstName', firstName);
    if (lastName) params = params.append('lastName', lastName);
    if (email) params = params.append('email', email);
    if (status) params = params.append('status', status);
    if (startDate) params = params.append('startDate', startDate);
    if (endDate) params = params.append('endDate', endDate);
    if (page) params = params.append('page', page);
    if (size) params = params.append('size', size);
    if (sort) params = params.append('sort', sort);

    return this.httpClient.get<PagedCustomersResponse>(`${environment.apiUrl}/customers`, {
      params,
    });
  }

  /**
   * Obtiene un cliente por su identificador.
   *
   * @param customerId Identificador del cliente a consultar.
   * @returns Observable con el cliente encontrado.
   */
  public findById(customerId: number): Observable<CustomerResponse> {
    return this.httpClient.get<CustomerResponse>(`${environment.apiUrl}/customers/${customerId}`);
  }

  /**
   * Elimina un cliente por su identificador.
   *
   * @param customerId Identificador del cliente a eliminar.
   * @returns Observable que se completa al finalizar la eliminación.
   */
  public deleteById(customerId: number): Observable<void> {
    return this.httpClient.delete<void>(`${environment.apiUrl}/customers/${customerId}`);
  }

  /**
   * Restaura un cliente previamente eliminado.
   *
   * @param customerId Identificador del cliente a restaurar.
   * @returns Observable que se completa al finalizar la restauración.
   */
  public restoreById(customerId: number): Observable<void> {
    return this.httpClient.put<void>(`${environment.apiUrl}/customers/${customerId}/restore`, null);
  }
}
