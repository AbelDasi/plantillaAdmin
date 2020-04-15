import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest  } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ObservacionesService {
  apiRest: String = environment.urlServidor;

  constructor(private http: HttpClient) { }

  ponerEncabezados() {
    return  new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'Bearer ' + sessionStorage.getItem('token')
    });
  }

  getObservaciones(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(`${this.apiRest}observaciones`, { headers: this.ponerEncabezados()})
      .subscribe((response: any) => {
        resolve(response);
      }, reject);
    });
  }

  getObservacion(oid): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(`${this.apiRest}observaciones/${oid}`, { headers: this.ponerEncabezados()})
      .subscribe((response: any) => {
        resolve(response);
      }, reject);
    });
  }

  eliminarObservacion(oid): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.delete(`${this.apiRest}observaciones/${oid}`, { headers: this.ponerEncabezados()})
      .subscribe((response: any) => {
        resolve(response);
      }, reject);
    });
  }

  crearObservacion(datos): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(`${this.apiRest}observaciones`,datos, {headers: this.ponerEncabezados()})
      .subscribe((response: any) => {
        resolve(response);
      }, reject);
    });
  }

  modificarObservacion(datos, oid): Promise<any> {
    return new Promise((resolve, reject) => {
      const datosService =  JSON.stringify(datos);
      this.http.put(`${this.apiRest}observaciones/${oid}`, datosService, { headers: this.ponerEncabezados()})
      .subscribe((response: any) => {
        resolve(response);
      }, reject);
    });
   }
}
