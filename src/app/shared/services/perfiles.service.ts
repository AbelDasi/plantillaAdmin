import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest  } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PerfilesService {
  apiRest: String = environment.urlServidor;
  httpHeadrs: HttpHeaders;
  constructor(private http: HttpClient) {
    this.httpHeadrs = new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
      'nombrePermiso': 'admin'
    });
   }
   getPerfilesUsuario(pantalla) {
    return new Promise((resolve, reject) => {
      this.http.get(this.apiRest + 'perfiles/ObtenerPefiles/' + pantalla, { headers: this.httpHeadrs})
          .subscribe((response: any) => {
              resolve(response);
          }, reject);
    });
   }
   crearPerfil(datos) {
    return new Promise((resolve, reject) => {
      const datosService =  JSON.stringify(datos);
      this.http.post(this.apiRest + 'perfiles/CrearPerfil', datosService, { headers: this.httpHeadrs})
          .subscribe((response: any) => {
              resolve(response);
          }, reject);
    });
   }
   getPerfil(oid) {
    return new Promise((resolve, reject) => {
      this.http.get(this.apiRest + 'perfiles/ObtenerPefil/' + oid, { headers: this.httpHeadrs})
          .subscribe((response: any) => {
              resolve(response);
          }, reject);
    });
   }
   getPerfilSeleccionado() {
    return new Promise((resolve, reject) => {
      this.http.get(this.apiRest + 'perfiles/ObtenerPerfilSelecionado', { headers: this.httpHeadrs})
          .subscribe((response: any) => {
              resolve(response);
          }, reject);
    });
   }
   modificarPerfil(datos) {
      return new Promise((resolve, reject) => {
      const datosService =  JSON.stringify(datos);
      this.http.put(this.apiRest + 'perfiles/ActualizarPerfil', datosService, { headers: this.httpHeadrs})
          .subscribe((response: any) => {
              resolve(response);
          }, reject);
      });
   }
   deletePerfil(oid): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.delete(this.apiRest + 'perfiles/BorrarPerfil/' + oid, { headers: this.httpHeadrs})
          .subscribe((response: any) => {
              resolve(response);
          }, reject);
    });
   }
   getPerfilesUsuarioPantalla(pantalla) {
    return new Promise((resolve, reject) => {
      this.http.get(this.apiRest + 'perfiles/ObtenerPefiles?pantalla=' + pantalla, { headers: this.httpHeadrs})
          .subscribe((response: any) => {
              resolve(response);
          }, reject);
    });
   }
   getPerfilSeleccionadoPorPantalla(pantalla) {
    return new Promise((resolve, reject) => {
      this.http.get(this.apiRest + 'perfiles/ObtenerPerfilSelecionado?pantalla=' + pantalla, { headers: this.httpHeadrs})
          .subscribe((response: any) => {
              resolve(response);
          }, reject);
    });
   }
   getPerfilesFacturacion() {
    return new Promise((resolve, reject) => {
      this.http.get(this.apiRest + 'perfiles/ObtenerPefilesFacturas', { headers: this.httpHeadrs})
          .subscribe((response: any) => {
              resolve(response);
          }, reject);
    });
   }
}
