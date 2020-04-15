import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest  } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AcronimosService {
  apiRest: String = environment.urlServidor;

  constructor(private http: HttpClient) { }

  ponerEncabezados() {
    return  new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'Bearer ' + sessionStorage.getItem('token')
    });
  }

  getAcronimos(): Promise<any> {
    return new Promise((resolve, reject) => {
      
      this.http.get(`${this.apiRest}acronimos/`, { headers: this.ponerEncabezados()})
          .subscribe((response: any) => {
              resolve(response);
          }, reject);
  });
  }
  getAcronimo(oid): Promise<any> {
    return new Promise((resolve, reject) => {
      
      this.http.get(`${this.apiRest}acronimos/${oid}`, { headers: this.ponerEncabezados()})
          .subscribe((response: any) => {
              resolve(response);
          }, reject);
  });
  }
  eliminarAcronimo(oid): Promise<any> {
    return new Promise((resolve, reject) => {
      const oid1 = '{"oid":' + oid + '}';
      this.http.delete(`${this.apiRest}acronimos/${oid}`, { headers: this.ponerEncabezados()})
          .subscribe((response: any) => {
              resolve(response);
          }, reject);
    });
   }
   crearAcronimo(datos): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(`${this.apiRest}acronimos`,datos, {headers: this.ponerEncabezados()})
          .subscribe((response: any) => {
              resolve(response);
          }, reject);
  });
  }

  modificarAcronimo(datos, oid): Promise<any> {
    return new Promise((resolve, reject) => {
      const datosService =  JSON.stringify(datos);
      this.http.put(`${this.apiRest}acronimos/${oid}`, datosService, { headers: this.ponerEncabezados()})
          .subscribe((response: any) => {
              resolve(response);
          }, reject);
    });
   }
}
