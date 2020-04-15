import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest  } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LegislacionService {
  apiRest: String = environment.urlServidor;

  constructor(private http: HttpClient) { }

  ponerEncabezados() {
    return  new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'Bearer ' + sessionStorage.getItem('token')
    });
  }

  getLegislaciones(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(`${this.apiRest}legislacion`, { headers: this.ponerEncabezados()})
      .subscribe((response: any) => {
        resolve(response);
      }, reject);
    });
  }

  getLegislacion(oid): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(`${this.apiRest}legislacion/${oid}`, { headers: this.ponerEncabezados()})
      .subscribe((response: any) => {
        resolve(response);
      }, reject);
    });
  }

  eliminarLegislacion(oid): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.delete(`${this.apiRest}legislacion/${oid}`, { headers: this.ponerEncabezados()})
      .subscribe((response: any) => {
        resolve(response);
      }, reject);
    });
  }

  crearLegislacion(datos): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(`${this.apiRest}legislacion`,datos, {headers: this.ponerEncabezados()})
      .subscribe((response: any) => {
        resolve(response);
      }, reject);
    });
  }

  modificarLegislacion(datos, oid): Promise<any> {
    return new Promise((resolve, reject) => {
      const datosService =  JSON.stringify(datos);
      this.http.put(`${this.apiRest}legislacion/${oid}`, datosService, { headers: this.ponerEncabezados()})
      .subscribe((response: any) => {
        resolve(response);
      }, reject);
    });
   }
}
