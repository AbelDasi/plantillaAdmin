import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest  } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {
  apiRest: String = environment.urlServidor;
  constructor(private http: HttpClient) { }

  ponerEncabezados() {
    return  new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'Bearer ' + sessionStorage.getItem('token')
    });
  }

  getPaises(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(`${this.apiRest}paises`, { headers: this.ponerEncabezados()})
      .subscribe((response: any) => {
        resolve(response);
      }, reject);
    });
  }

  getPais(oid): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(`${this.apiRest}paises/${oid}`, { headers: this.ponerEncabezados()})
      .subscribe((response: any) => {
        resolve(response);
      }, reject);
    });
  }

  eliminarPais(oid): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.delete(`${this.apiRest}paises/${oid}`, { headers: this.ponerEncabezados()})
      .subscribe((response: any) => {
        resolve(response);
      }, reject);
    });
  }

  crearPais(datos): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(`${this.apiRest}paises`,datos, {headers: this.ponerEncabezados()})
      .subscribe((response: any) => {
        resolve(response);
      }, reject);
    });
  }

  modificarPais(datos, oid): Promise<any> {
    return new Promise((resolve, reject) => {
      const datosService =  JSON.stringify(datos);
      this.http.put(`${this.apiRest}paises/${oid}`, datosService, { headers: this.ponerEncabezados()})
      .subscribe((response: any) => {
        resolve(response);
      }, reject);
    });
   }
}
