import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest  } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {ServiciosDetalles, DetalleSolicitud} from '../dtos/datosUsuarios';

@Injectable({
  providedIn: 'root'
})
export class SeguridadService {
  apiRest: String = environment.urlServidor;
  httpHeadrs: HttpHeaders;
  usuarios: any[] = [];
  grupos: any[] = [];
  usuario: any;
  grupoUsuarios: any[] = [];
  listaDetalles: any[] = [];
  popUpGrupo: boolean;
  popUpPerfil: boolean;
  popUpResumenFacturacionServicios: boolean;
  popUpResumenFacturacionSolicitud: boolean;
  popUpFilaNueva: boolean;
  popUp: boolean;
  nuevoServicio: boolean;
  // tslint:disable-next-line:no-inferrable-types
  altura1: number = 0;
  popUpPerfilMod: boolean;
  popUpPerfilDelete: boolean;
  loading: boolean;
  oidsArrayx: any[] = [];
  oidsArray: any[] = [];
  perfiles: any[] = [];
  clientes: any[] = [];
  listadoFacturar: any[] = [];
  detalles: string;
  grupo: any = {};

  solicitudesBol: boolean;
  serviciosBol: boolean;
  prefacturaBol: boolean;
  resumenBol: boolean;
  nuevalineaBol: boolean;
  gridSolicitudesBol: boolean;
  constructor(private http: HttpClient) {
    this.httpHeadrs = new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'Bearer ' + sessionStorage.getItem('token')
    });
   }
   getUsuarios(): Promise<any> {
      return new Promise((resolve, reject) => {
        this.http.get(this.apiRest + 'usuario/ObtenerTodosUsuarios', { headers: this.httpHeadrs})
            .subscribe((response: any) => {
                this.usuarios = response.users;
                resolve(response);
            }, reject);
    });
 }
 getUsuario(id): Promise<any> {
  return new Promise((resolve, reject) => {
    this.http.get(this.apiRest + 'usuario/ObtenerUsuario/' + id, { headers: this.httpHeadrs})
        .subscribe((response: any) => {
            resolve(response);
        }, reject);
});
}
 deleteUsuario(oid): Promise<any> {
  return new Promise((resolve, reject) => {
    const oid1 = '{"oid":' + oid + '}';
    this.http.delete(this.apiRest + 'usuario/BorrarUsuario/' + oid, { headers: this.httpHeadrs})
        .subscribe((response: any) => {
            resolve(response);
        }, reject);
  });
 }
 modificarUsuario(datos): Promise<any> {
  return new Promise((resolve, reject) => {
    const datosUser =  JSON.stringify(datos);
    this.http.put(this.apiRest + 'usuario/ActualizarUsuario', datosUser, { headers: this.httpHeadrs})
        .subscribe((response: any) => {
            resolve(response);
        }, reject);
  });
 }
 AltaUsuario(datos): Promise<any> {
  return new Promise((resolve, reject) => {
    const datosUser =  JSON.stringify(datos);
    this.http.post(this.apiRest + 'usuario/CrearUsuario', datosUser, { headers: this.httpHeadrs})
        .subscribe((response: any) => {
            resolve(response);
        }, reject);
  });
 }

 subirArchivo( archivo: File, tipo: string, id: number ) {

  return new Promise( (resolve, reject ) => {

    const formData = new FormData();
    const xhr = new XMLHttpRequest();

    formData.append( 'imagen', archivo, archivo.name );

    xhr.onreadystatechange = function() {

      if ( xhr.readyState === 4 ) {

        if ( xhr.status === 200 ) {
          resolve( JSON.parse( xhr.response ) );
        } else {
          reject( xhr.response );
        }

      }
    };
    const url = environment.urlServidor + 'upload/' + tipo + '/' + id;
    xhr.open('PUT', url, true );
    xhr.send( formData );
  });
}
//////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////// BLOQUE DE GRUPOS /////////////////////////////////
getGrupos(): Promise<any> {
  return new Promise((resolve, reject) => {
    this.http.get(this.apiRest + 'grupos/ObtenerTodosGrupos', { headers: this.httpHeadrs})
        .subscribe((response: any) => {
           // this.usuarios = response.users;
            this.grupos = response.grupos;
            resolve(response);
        }, reject);
});
}
getClientes(): Promise<any> {
  return new Promise((resolve, reject) => {
    this.http.get(this.apiRest + 'clientes/ObtenerClientes', { headers: this.httpHeadrs})
        .subscribe((response: any) => {
          this.clientes = response.clientes;
           // this.usuarios = response.users;
            resolve(response);
        }, reject);
});
}
getUsuariosGrupo(id): Promise<any> {
  return new Promise((resolve, reject) => {
    this.http.get(this.apiRest + 'grupos/ObtenerGrupo/' + id, { headers: this.httpHeadrs})
        .subscribe((response: any) => {
           // this.usuarios = response.users;
         //   this.grupos = response.grupos;
            this.grupoUsuarios = response.usuarios_grupos;
            this.grupo = response.grupo;
            resolve(response);
        }, reject);
  });
 }
 getSolicitudesFacturacion(): Promise<any> {
  return new Promise((resolve, reject) => {
 //   this.http.get(this.apiRest + 'facturacion/ObtenerSolicitudesServicios', { headers: this.httpHeadrs})
 this.http.get(this.apiRest + 'facturacion/ObtenerSolicitudesServicios', { headers: this.httpHeadrs})
        .subscribe((response: any) => {
           // this.usuarios = response.users;
            resolve(response);
        }, reject);
});
}
getSolicitudesFacturacionConFiltros(datos): Promise<any> {
  return new Promise((resolve, reject) => {
  const params = new HttpParams()
    .set('estado', datos.estado)
    .set('fechainicio', datos.fechainicio)
    .set('fechafin', datos.fechafin)
    .set('numRef', datos.numRef);
  const options = { params: params, headers: this.httpHeadrs };
 this.http.get(this.apiRest + 'facturacion/ObtenerSolicitudesServicios', options)
        .subscribe((response: any) => {
            resolve(response);
        }, reject);
});
}
getDetallesSolicitud(datos): Promise<any> {
  return new Promise((resolve, reject) => {
    const params = new HttpParams()
    .set('oid', datos);
  const options = { params: params, headers: this.httpHeadrs };
    this.http.get(this.apiRest + 'facturacion/DetalleSolicitud', options)
        .subscribe((response: any) => {
           // this.usuarios = response.users;
            resolve(response);
        }, reject);
});
}
getEstados(): Promise<any> {
  return new Promise((resolve, reject) => {
    this.http.get(this.apiRest + 'facturacion/ObtenerEstados', { headers: this.httpHeadrs})
        .subscribe((response: any) => {
           // this.usuarios = response.users;
            resolve(response);
        }, reject);
});
}
modificarServicios(datos): Promise<any> {
  return new Promise((resolve, reject) => {
    const datosService =  JSON.stringify(datos);
    this.http.put(this.apiRest + 'facturacion/ModificarServicios', datosService, { headers: this.httpHeadrs})
        .subscribe((response: any) => {
            resolve(response);
        }, reject);
  });
 }
 modificarSolicitudes(datos): Promise<any> {
  return new Promise((resolve, reject) => {
    const datosService =  JSON.stringify(datos);
    this.http.put(this.apiRest + 'facturacion/ModificarSolicitudFacturacion', datosService, { headers: this.httpHeadrs})
        .subscribe((response: any) => {
            resolve(response);
        }, reject);
  });
 }
 insertarServicios(datos): Promise<any> {
  return new Promise((resolve, reject) => {
    const datosService =  JSON.stringify(datos);
    this.http.post(this.apiRest + 'facturacion/InsertarServicios', datosService, { headers: this.httpHeadrs})
        .subscribe((response: any) => {
            resolve(response);
        }, reject);
  });
 }
 ////////////////// BLOQUE DE PERFILES /////////////////////////
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
 getPerfil(oid, pantalla) {
  return new Promise((resolve, reject) => {
    this.http.get(this.apiRest + 'perfiles/ObtenerPefil/' + oid + '/' + pantalla, { headers: this.httpHeadrs})
        .subscribe((response: any) => {
            resolve(response);
        }, reject);
  });
 }
 getPerfilSeleccionado(pantalla) {
  return new Promise((resolve, reject) => {
    this.http.get(this.apiRest + 'perfiles/ObtenerPerfilSelecionado/' + pantalla, { headers: this.httpHeadrs})
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
 deleteServiciosNuevos(oid) {
  return new Promise((resolve, reject) => {
    const oid1 = JSON.stringify( oid );
    const params = new HttpParams()
    .set('oid', oid1);
    const options = { params: params, headers: this.httpHeadrs };
    this.http.delete(this.apiRest + 'facturacion/EliminarServicioFacturacion', options)
        .subscribe((response: any) => {
            resolve(response);
        }, reject);
  });
 }
 ////////////// ENVIAR SOLICITUDES A FACTURAR //////////
 enviarServiciosAFacturar(datos): Promise<any> {
  return new Promise((resolve, reject) => {
  //  const datosUser =  JSON.stringify(datos);
    this.http.post(this.apiRest + 'facturacion/EnviarNavision', datos, { headers: this.httpHeadrs})
        .subscribe((response: any) => {
            resolve(response);
        }, reject);
  });
 }
 ////// FILTRO DE SOLICITUDES
 getSolicitudesTipoFacturacion(id, nombre, pantalla) {
  return new Promise((resolve, reject) => {
    this.http.get(this.apiRest + 'facturacion/ObtenerSolicitudesTipologia/' + encodeURI(`${ id }/${ nombre }/${ pantalla }`),
     { headers: this.httpHeadrs})
        .subscribe((response: any) => {
            resolve(response);
        }, reject);
  });
 }
 getCountTipoFacturacion() {
  return new Promise((resolve, reject) => {
    this.http.get(this.apiRest + 'facturacion/CountTipoFacturacion', { headers: this.httpHeadrs})
        .subscribe((response: any) => {
            resolve(response);
        }, reject);
  });
 }
 /////////////// RECUPERAR LAS TIPOLOGIAS DEL CLIENTE EN EL GRID
 getTipologia(oid) {
  return new Promise((resolve, reject) => {
    this.http.get(this.apiRest + 'facturacion/ObtenerTipologiaPorCliente/' + oid, { headers: this.httpHeadrs})
        .subscribe((response: any) => {
            resolve(response);
        }, reject);
  });
 }
 getTipologias() {
  return new Promise((resolve, reject) => {
    this.http.get(this.apiRest + 'facturacion/ObtenerTodasTipologia/', { headers: this.httpHeadrs})
        .subscribe((response: any) => {
            resolve(response);
        }, reject);
  });
 }
 getServicios() {
  return new Promise((resolve, reject) => {
    this.http.get(this.apiRest + 'servicios/ObtenerServicios', { headers: this.httpHeadrs})
        .subscribe((response: any) => {
            resolve(response);
        }, reject);
  });
 }
}


// facturacion/DetalleSolicitud/331440
