import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Permisos } from '../../shared/dtos/datosUsuarios';
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  apiRest: String = environment.urlServidor;
  httpHeadrs: HttpHeaders;
  httpHeadrs1: HttpHeaders;
  mensajeError: string;
  token: any;
  username: string;
  permisos: Permisos = new Permisos();
  constructor(private http: HttpClient ) {
    this.httpHeadrs = new HttpHeaders({
      'Content-Type':  'application/json'
    });
   }
  /* validarUsuario(objetoLogin) {
    let headersNew = this.httpHeadrs.append("Authorization",`Basic ${ btoa(`${ objetoLogin.login }:${ objetoLogin.password }`) }`);
    return new Promise( resolve => {
     this.http.post<any>(this.apiRest + 'login', {}, { headers: headersNew}).subscribe(async data => {
      if (data.ok === true) {
        sessionStorage.setItem('token', `${ data.token }`);
        sessionStorage.setItem('oid', data.usuario.oid);
        sessionStorage.setItem('usuario', JSON.stringify(data.usuario));
        sessionStorage.setItem('username', data.usuario.login);
        this.permisos = data.Permisos;
        await resolve(true);
       } else {
         this.mensajeError = data.mensaje;
          resolve(false);
       }
      }, async error => {
        await resolve(false);
      });
    });
  } */  

    validarUsuario(objetoLogin) {
    return new Promise( resolve => {
     this.http.post<any>(this.apiRest + 'user/login', objetoLogin, { headers: this.httpHeadrs}).subscribe(async data => {
       if (data.ok === true) {
         console.log(data);
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('oid', data.oid);
        sessionStorage.setItem('username', data.nombre);
        this.permisos = data.permisos;
        await resolve(true);
       } else {
         this.mensajeError = data.mensaje;
          resolve(false);
       }
      }, async error => {
        await resolve(false);
      });
    });
  }  
  getToken() {
    this.token = sessionStorage.getItem('token');
    return this.token;
  }
  getNombre() {
    this.username = sessionStorage.getItem('username');
    return this.username;
  }
  renuevaToken() {
    return new Promise( resolve => {
      const token = sessionStorage.getItem('token');
      this.httpHeadrs1 = new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + this.getToken(),
        'nombrePermiso': 'admin'
      });
      this.http.post<any>(this.apiRest + 'login/RenuevaToken', '', { headers: this.httpHeadrs1}).subscribe(async data => {
        if (data.ok === true) {
         sessionStorage.setItem('token', data.token);
         await resolve(true);
        } else {
           resolve(false);
        }
       }, async error => {
         await resolve(false);
       });
     });
  }
}
