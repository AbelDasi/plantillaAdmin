import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest  } from '@angular/common/http';
import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class DilucionesService {
  apiRest: String = environment.urlServidor;

  constructor(private http: HttpClient) { }

  ponerEncabezados() {
    return  new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'Bearer ' + sessionStorage.getItem('token')
    });
  }

  getDiluciones(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(`${this.apiRest}diluciones`, { headers: this.ponerEncabezados()})
      .subscribe((response: any) => {
        resolve(response);
      }, reject);
    });
  }

  getDilucion(oid): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(`${this.apiRest}diluciones/${oid}`, { headers: this.ponerEncabezados()})
      .subscribe((response: any) => {
        resolve(response);
      }, reject);
    });
  }

  eliminarDilucion(oid): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.delete(`${this.apiRest}diluciones/${oid}`, { headers: this.ponerEncabezados()})
      .subscribe((response: any) => {
        resolve(response);
      }, reject);
    });
  }

  crearDilucion(datos): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(`${this.apiRest}diluciones`,datos, {headers: this.ponerEncabezados()})
      .subscribe((response: any) => {
        resolve(response);
      }, reject);
    });
  }

  modificarDilucion(datos, oid): Promise<any> {
    return new Promise((resolve, reject) => {
      const datosService =  JSON.stringify(datos);
      this.http.put(`${this.apiRest}diluciones/${oid}`, datosService, { headers: this.ponerEncabezados()})
      .subscribe((response: any) => {
        resolve(response);
      }, reject);
    });
   }
}
