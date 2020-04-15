import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest  } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LaboratoriesService {
  apiRest: String = environment.urlServidor;
  constructor(private http: HttpClient) { }

  ponerEncabezados() {
    return  new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'Bearer ' + sessionStorage.getItem('token')
    });
  }

  getLaboratorios(): Promise<any> {
    return new Promise((resolve, reject) => {
      
      this.http.get(`${this.apiRest}laboratorios/`, { headers: this.ponerEncabezados()})
          .subscribe((response: any) => {
              resolve(response);
          }, reject);
  });
  }
}
