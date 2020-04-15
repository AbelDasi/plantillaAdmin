import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest  } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UbicacionesService {
  apiRest: String = environment.urlServidor;
  constructor(private http: HttpClient) { }

  ponerEncabezados() {
    return  new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'Bearer ' + sessionStorage.getItem('token')
    });
  }

  getUbicaciones(): Promise<any> {
    return new Promise((resolve, reject) => {
      
      this.http.get(`${this.apiRest}ubicaciones/ObtenerUbicaciones`, { headers: this.ponerEncabezados()})
          .subscribe((response: any) => {
              resolve(response);
          }, reject);
  });
  }
  getUbicacion(oid): Promise<any> {
    return new Promise((resolve, reject) => {
      
      this.http.get(`${this.apiRest}ubicaciones/ObtenerUbicacion/${oid}`, { headers: this.ponerEncabezados()})
          .subscribe((response: any) => {
              resolve(response);
          }, reject);
  });
  }
  eliminarUbicacion(oid): Promise<any> {
    return new Promise((resolve, reject) => {
      const oid1 = '{"oid":' + oid + '}';
      this.http.delete(`${this.apiRest}ubicaciones/${oid}`, { headers: this.ponerEncabezados()})
          .subscribe((response: any) => {
              resolve(response);
          }, reject);
    });
   }
   CrearUbicacion(datos): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(`${this.apiRest}ubicaciones`,datos, {headers: this.ponerEncabezados()})
          .subscribe((response: any) => {
              resolve(response);
          }, reject);
  });
  }

  modificarUbicacion(datos, oid): Promise<any> {
    return new Promise((resolve, reject) => {
      const datosService =  JSON.stringify(datos);
      this.http.put(`${this.apiRest}ubicaciones/${oid}`, datosService, { headers: this.ponerEncabezados()})
          .subscribe((response: any) => {
              resolve(response);
          }, reject);
    });
   }
}
