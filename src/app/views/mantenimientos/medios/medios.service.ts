import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest  } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MediosService {
  apiRest: String = environment.urlServidor;

  constructor(private http: HttpClient) { }

  ponerEncabezados() {
    return  new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'Bearer ' + sessionStorage.getItem('token')
    });
  }

  getMedios(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(`${this.apiRest}medios`, { headers: this.ponerEncabezados()})
      .subscribe((response: any) => {
        resolve(response);
      }, reject);
    });
  }

  getMedio(oid): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(`${this.apiRest}medios/${oid}`, { headers: this.ponerEncabezados()})
      .subscribe((response: any) => {
        resolve(response);
      }, reject);
    });
  }

  eliminarMedio(oid): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.delete(`${this.apiRest}medios/${oid}`, { headers: this.ponerEncabezados()})
      .subscribe((response: any) => {
        resolve(response);
      }, reject);
    });
  }

  crearMedio(datos): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(`${this.apiRest}medios`,datos, {headers: this.ponerEncabezados()})
      .subscribe((response: any) => {
        resolve(response);
      }, reject);
    });
  }

  modificarMedio(datos, oid): Promise<any> {
    return new Promise((resolve, reject) => {
      const datosService =  JSON.stringify(datos);
      this.http.put(`${this.apiRest}medios/${oid}`, datosService, { headers: this.ponerEncabezados()})
      .subscribe((response: any) => {
        resolve(response);
      }, reject);
    });
   }
}
