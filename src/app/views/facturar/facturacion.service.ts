import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest  } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { resolve } from 'url';
import { CountFacturas } from 'src/app/shared/models/factura';
import { filtrosFacturacion } from 'src/app/shared/dtos/datosUsuarios';

@Injectable({
  providedIn: 'root'
})
export class FacturacionService {
  fechaInicio: Date;
  fechaFin: Date;
  fechaInicioFiltro:Date;
  fechaFinFiltro:Date;
  apiRest: String = environment.urlServidor;
  httpHeadrs: HttpHeaders;
  listaDetalles: any[] = [];
  popUpGrupo: boolean;
  popUpPerfil: boolean;
  popUpFilaNueva: boolean;
  popUp: boolean;
  nuevoServicio: boolean;
  popUpResumenFacturacionServicios: boolean;
  popUpResumenFacturacionSolicitud: boolean;
  gridPrefacturas: boolean;
  gridFacturas: boolean;
  modoBusqueda: string = 'inmediata';
  tituloPagina: string = '';
  pantallaModulo: string;
  parametroFiltroTipo: string = 'factura';
  oidRefactura: number;
  // tslint:disable-next-line:no-inferrable-types
  altura1: number = 0;
  popUpPerfilMod: boolean;
  popUpPerfilDelete: boolean;
  mostrarBtn: boolean = false;
  loading: boolean;
  oidsArrayx: any[] = [];
  oidsArray: any[] = [];
  perfiles: any[] = [];
  clientes: any[] = [];
  listadoFacturar: any[] = [];
  oidsPrefactura: any[] = [];
  validacionRequisitos: any[] = [];
  codigosPrefactura: any[] = [];
  solicitudes: any[] = [];
  detalles: string;
  grupo: any = {};
  objetoFiltro: filtrosFacturacion = new filtrosFacturacion();
  solicitudesBol: boolean;
  serviciosBol: boolean;
  prefacturaBol: boolean;
  resumenBol: boolean;
  nuevalineaBol: boolean;
  gridSolicitudesBol: boolean;
  serviciosResumenBol: boolean;
  countFacturas: CountFacturas = new CountFacturas();
  verListaPerfiles: boolean;
  constructor(private http: HttpClient) {
    this.fechaFin = new Date();
    this.fechaFin.setDate(this.fechaFin.getDate() + 1);
    this.fechaInicio = new Date();
    this.fechaInicio.setMonth(this.fechaInicio.getMonth() - 1);

    this.fechaFinFiltro = new Date();
    this.fechaFinFiltro.setDate(this.fechaFinFiltro.getDate() + 1);
    this.fechaInicioFiltro = new Date();
    this.fechaInicioFiltro.setMonth(this.fechaInicioFiltro.getMonth() - 1);
    this.httpHeadrs = new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'Bearer ' + sessionStorage.getItem('token')
    });
   }
   getClientes(): Promise<any> {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      });
      this.http.get(this.apiRest + 'clientes/ObtenerClientes', { headers: headers})
          .subscribe((response: any) => {
            this.clientes = response.clientes;
              resolve(response);
          }, reject);
  });
  }

  getDireccionesEnvio(): Promise<any> {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      });
      this.http.get(this.apiRest + 'facturacion/DireccionesEnvio', { headers: headers})
          .subscribe((response: any) => {
              resolve(response);
          }, reject);
  });
  }

  getObservacion(oid, tipo) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      });
      this.http.get(this.apiRest + 'solicitudes/ObtenerObservacionesSolicitud/' + oid + '/' + tipo, { headers: headers})
          .subscribe((response: any) => {
          resolve(response);
          }, reject);
  });
  }
  
  getSolicitudesFacturacion(): Promise<any> {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      });
   this.http.get(this.apiRest + 'facturacion/ObtenerSolicitudesServicios', { headers: headers})
          .subscribe((response: any) => {
              resolve(response);
          }, reject);
  });
  }

  getSolicitudesFacturacionConFiltros(datos): Promise<any> {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      });
    const params = new HttpParams()
      .set('estado', datos.estado)
      .set('fechainicio', datos.fechainicio)
      .set('fechafin', datos.fechafin)
      .set('numRef', datos.numRef);
    const options = { params: params, headers: headers };
   this.http.get(this.apiRest + 'facturacion/ObtenerSolicitudesServicios', options)
          .subscribe((response: any) => {
              resolve(response);
          }, reject);
  });
  }
  getDetallesSolicitud(datos): Promise<any> {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      });
      const params = new HttpParams()
      .set('oid', datos);
    const options = { params: params, headers: headers };
      this.http.get(this.apiRest + 'facturacion/DetalleSolicitud', options)
          .subscribe((response: any) => {
             // this.usuarios = response.users;
              resolve(response);
          }, reject);
  });
  }
  getCodigosSolicitud(datos): Promise<any> {
    const oids = {oids: datos};
    const array = JSON.stringify(oids);
    
    
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      });

      this.http.post(this.apiRest + 'solicitudes/ObtenerSolicitudes',array, {headers: headers})
          .subscribe((response: any) => {
              resolve(response);
          }, reject);
  });
  }
  getEstados(): Promise<any> {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      });
      this.http.get(this.apiRest + 'estados/ObtenerEstados', { headers: headers})
          .subscribe((response: any) => {
             // this.usuarios = response.users;
              resolve(response);
          }, reject);
  });
  }
  modificarServicios(datos): Promise<any> {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      });
      const datosService =  JSON.stringify(datos);
      this.http.put(this.apiRest + 'facturacion/ModificarServicios', datosService, { headers: headers})
          .subscribe((response: any) => {
              resolve(response);
          }, reject);
    });
   }
   modificarSolicitudes(datos): Promise<any> {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      });
      const datosService =  JSON.stringify(datos);
      this.http.put(this.apiRest + 'facturacion/ModificarSolicitudFacturacion', datosService, { headers: headers})
          .subscribe((response: any) => {
              resolve(response);
          }, reject);
    });
   }
   insertarServicios(datos): Promise<any> {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      });
      const datosService =  JSON.stringify(datos);
      this.http.post(this.apiRest + 'facturacion/InsertarServicios', datosService, { headers: headers})
          .subscribe((response: any) => {
              resolve(response);
          }, reject);
    });
   }
   ////////////////// BLOQUE DE PERFILES /////////////////////////
   getPerfilesUsuario(pantalla) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      });
      this.http.get(this.apiRest + 'perfiles/ObtenerPefiles/' + pantalla, { headers: headers})
          .subscribe((response: any) => {
              resolve(response);
          }, reject);
    });
   }
   crearPerfil(datos) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      });
      const datosService =  JSON.stringify(datos);
      this.http.post(this.apiRest + 'perfiles/CrearPerfil', datosService, { headers: headers})
          .subscribe((response: any) => {
              resolve(response);
          }, reject);
    });
   }
   getPerfil(oid, pantalla, seleccionado?) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      });
      this.http.get(this.apiRest + 'perfiles/ObtenerPefil/' + oid + '/' + pantalla + '/' + seleccionado, { headers: headers})
          .subscribe((response: any) => {
              resolve(response);
          }, reject);
    });
   }
   quitarPerfil(oid, pantalla) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      });
      this.http.get(this.apiRest + 'perfiles/QuitarPerfil/' + pantalla, { headers: headers})
          .subscribe((response: any) => {
              resolve(response);
          }, reject);
    });
   }
   getPerfilSeleccionado(pantalla) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      });
      this.http.get(this.apiRest + 'perfiles/ObtenerPerfilSelecionado/' + pantalla, { headers: headers})
          .subscribe((response: any) => {
              resolve(response);
          }, reject);
    });
   }
   modificarPerfil(datos, oid) {
      return new Promise((resolve, reject) => {
        const headers = new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'Bearer ' + sessionStorage.getItem('token')
        });
      const datosService =  JSON.stringify(datos);
      this.http.put(this.apiRest + 'perfiles/ActualizarPerfil/' + oid, datosService, { headers: headers})
          .subscribe((response: any) => {
              resolve(response);
          }, reject);
      });
   }

   deleteServiciosAbono(oid) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      });
    const datosService =  JSON.stringify(oid);
    this.http.put(this.apiRest + 'facturacion/EliminarServicioAbono', datosService, { headers: headers})
        .subscribe((response: any) => {
            resolve(response);
        }, reject);
    });
 }
 deleteServiciosRefactura(oid) {
  return new Promise((resolve, reject) => {
    const headers = new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'Bearer ' + sessionStorage.getItem('token')
    });
  const datosService =  JSON.stringify(oid);
  this.http.put(this.apiRest + 'facturacion/EliminarServicioRefactura', datosService, { headers: headers})
      .subscribe((response: any) => {
          resolve(response);
      }, reject);
  });
}
   deleteServiciosNuevos(oid) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      });
      const oid1 = JSON.stringify( oid );
      const params = new HttpParams()
      .set('oid', oid1);
      const options = { params: params, headers: headers };
      this.http.delete(this.apiRest + 'facturacion/EliminarServicioFacturacion', options)
          .subscribe((response: any) => {
              resolve(response);
          }, reject);
    });
   }
   ////////////// ENVIAR SOLICITUDES A FACTURAR //////////
   enviarServiciosAFacturar(datos): Promise<any> {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      });
    //  const datosUser =  JSON.stringify(datos);
      this.http.post(this.apiRest + 'facturacion/EnviarNavision', datos, { headers: headers})
          .subscribe((response: any) => {
              resolve(response);
          }, reject);
    });
   }
   abonar(oid) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      });
      const datosService =  JSON.stringify(oid);
      this.http.post(this.apiRest + 'facturas/Abonar', datosService, { headers: headers})
          .subscribe((response: any) => {
              resolve(response);
          }, reject);
    });
   }
   refacturar(oid) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      });
      const datosService =  JSON.stringify(oid);
      this.http.post(this.apiRest + 'facturas/Refacturar', datosService, { headers: headers})
          .subscribe((response: any) => {
              resolve(response);
          }, reject);
    });
   }
   ////// FILTRO DE SOLICITUDES
   getSolicitudesTipoFacturacion(id) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      });
      this.http.get(this.apiRest + 'facturacion/ObtenerSolicitudesTipologia/' + encodeURI(`${ id }`),
       { headers: headers})
          .subscribe((response: any) => {
              resolve(response);
          }, reject);
    });
   }
   getCountTipoFacturacion() {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      });
      this.http.get(this.apiRest + 'solicitudes/CountTipoFacturacion', { headers: headers})
          .subscribe((response: any) => {
              resolve(response);
          }, reject);
    });
   }
   /////////////// RECUPERAR LAS TIPOLOGIAS DEL CLIENTE EN EL GRID
   getTipologia(oid) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      });
      this.http.get(this.apiRest + 'tipologias/ObtenerTipologiaPorCliente/' + oid, { headers: headers})
          .subscribe((response: any) => {
              resolve(response);
          }, reject);
    });
   }
   getTipologias() {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      });
      this.http.get(this.apiRest + 'tipologias/ObtenerTipologias/', { headers: headers})
          .subscribe((response: any) => {
              resolve(response);
          }, reject);
    });
   }
   getServicios() {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      });
      this.http.get(this.apiRest + 'servicios/ObtenerServicios', { headers: headers})
          .subscribe((response: any) => {
              resolve(response);
          }, reject);
    });
   }

   getProyectos() {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      });
      this.http.get(this.apiRest + 'proyectos/ObtenerProyectos', { headers: headers})
          .subscribe((response: any) => {
              resolve(response);
          }, reject);
    });
   }


   ///// PREFACTURAS //////
   mandarAPrefacturar(datos) {
    const oids = {solicitudes: datos};
    const array = JSON.stringify(oids);
    
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      });
    //  const datosUser =  JSON.stringify(datos);
      this.http.post(this.apiRest + 'prefacturas', array, { headers: headers})
          .subscribe((response: any) => {
              resolve(response);
          }, reject);
    });
   }

   getPrefacturas() {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      });
      this.http.get(this.apiRest + 'prefacturas', { headers: headers})
          .subscribe((response: any) => {
              resolve(response);
          }, reject);
    });
   }
   getpreAbonos(fecha_inicio, fecha_fin) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      });
      this.http.get(this.apiRest + `facturas/preabonos?fecha_inicio=${fecha_inicio}&fecha_fin=${fecha_fin}`, { headers: headers})
          .subscribe((response: any) => {
              resolve(response);
          }, reject);
    });
   }

   getAbonos(fecha_inicio, fecha_fin) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      });
      this.http.get(this.apiRest + `facturas/abonos?fecha_inicio=${fecha_inicio}&fecha_fin=${fecha_fin}`, { headers: headers})
          .subscribe((response: any) => {
              resolve(response);
          }, reject);
    });
   }

   getCountFacturas() {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      });
      this.http.get(this.apiRest + 'facturas/CountFacturasAbonos', { headers: headers})
          .subscribe((response: any) => {
              resolve(response);
          }, reject);
    });
   }

   getDetallePrefactura(oid) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      });
      this.http.get(this.apiRest + 'prefacturas/' + oid, { headers: headers})
          .subscribe((response: any) => {
              resolve(response);
          }, reject);
    });
   }
   getDetalleFactura(oid) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      });
      this.http.get(this.apiRest + 'facturas/' + oid, { headers: headers})
          .subscribe((response: any) => {
              resolve(response);
          }, reject);
    });
   }
   getDetalleAbono(oid) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      });
      this.http.get(this.apiRest + 'facturas/abonos/' + oid, { headers: headers})
          .subscribe((response: any) => {
              resolve(response);
          }, reject);
    });
   }

   getDetalleRefactura(oid) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      });
      this.http.get(this.apiRest + 'facturas/refacturas/' + oid, { headers: headers})
          .subscribe((response: any) => {
              resolve(response);
          }, reject);
    });
   }

   validarPrefactura(oid) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      });
      
      this.http.put(this.apiRest + 'prefacturas/validarPrefactura/' + oid, {}, { headers: headers})
          .subscribe((response: any) => {
              resolve(response);
          }, reject);
    });
   }

   eliminarPrefactura(oid) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      });
      this.http.delete(this.apiRest + 'prefacturas/eliminarPrefactura/' + oid, { headers: headers})
          .subscribe((response: any) => {
              resolve(response);
          }, reject);
    });
   }

   eliminarPreAbono(oid) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      });
      this.http.delete(this.apiRest + 'facturas/eliminarPreAbono/' + oid, { headers: headers})
          .subscribe((response: any) => {
              resolve(response);
          }, reject);
    });
   }

   eliminarPreRefactura(oid) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      });
      this.http.delete(this.apiRest + 'facturas/eliminarPreRefactura/' + oid, { headers: headers})
          .subscribe((response: any) => {
              resolve(response);
          }, reject);
    });
   }

   guardarCabeceraPrefactura(datos) {
    const data = JSON.stringify(datos);
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      });
    //  const datosUser =  JSON.stringify(datos);
      this.http.post(this.apiRest + 'prefacturas/guardarPrefactura', data, { headers: headers})
          .subscribe((response: any) => {
              resolve(response);
          }, reject);
    });
   }
   unificar(datos) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      });
    //  const datosUser =  JSON.stringify(datos);
      this.http.post(this.apiRest + 'prefacturas/unificar', datos, { headers: headers})
          .subscribe((response: any) => {
              resolve(response);
          }, reject);
    });
   }
   ComprobarUnificar(datos) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      });
    //  const datosUser =  JSON.stringify(datos);
      this.http.post(this.apiRest + 'prefacturas/comprobarUnificar', datos, { headers: headers})
          .subscribe((response: any) => {
              resolve(response);
          }, reject);
    });
   }
   guardarCabeceraPreAbono(datos) {
    const data = JSON.stringify(datos);
    
   return new Promise((resolve, reject) => {
     const headers = new HttpHeaders({
       'Content-Type':  'application/json',
       'Authorization': 'Bearer ' + sessionStorage.getItem('token')
     });
     this.http.post(this.apiRest + 'facturas/guardarPreAbono', data, { headers: headers})
         .subscribe((response: any) => {
             resolve(response);
         }, reject);
   });
  }

  guardarCabeceraPreRefactura(datos) {
  const data = JSON.stringify(datos);
   return new Promise((resolve, reject) => {
     const headers = new HttpHeaders({
       'Content-Type':  'application/json',
       'Authorization': 'Bearer ' + sessionStorage.getItem('token')
     });
   //  const datosUser =  JSON.stringify(datos);
     this.http.post(this.apiRest + 'facturas/guardarPreRefactura', data, { headers: headers})
         .subscribe((response: any) => {
             resolve(response);
         }, reject);
   });
  }

   nuevaPrefactura(datos) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      });
    //  const datosUser =  JSON.stringify(datos);
      this.http.post(this.apiRest + 'prefacturas/crearPrefacturaSinSolicitud', datos, { headers: headers})
          .subscribe((response: any) => {
              resolve(response);
          }, reject);
    });
   }
   nuevoPreAbono(datos) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      });
    //  const datosUser =  JSON.stringify(datos);
      this.http.post(this.apiRest + 'facturas/crearAbonoSinFactura', datos, { headers: headers})
          .subscribe((response: any) => {
              resolve(response);
          }, reject);
    });
   }
   nuevoPreAbonoConFactura(datos) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      });
    //  const datosUser =  JSON.stringify(datos);
      this.http.post(this.apiRest + 'facturas/crearAbonoDesdeFactura', datos, { headers: headers})
          .subscribe((response: any) => {
              resolve(response);
          }, reject);
    });
   }

   ////////////////////////// FACTURAS /////////////////////////7
   mandarAFacturar(datos) {
    const oids = datos;
    const array = JSON.stringify(oids);
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      });
       this.http.post(this.apiRest + 'prefacturas/EnviarNavision', array, { headers: headers})
          .subscribe((response: any) => {
              resolve(response);
          }, reject); 
    });
   }

   getFacturas(fecha_inicio, fecha_fin) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      });
      this.http.get(this.apiRest + `facturas?fecha_inicio=${fecha_inicio}&fecha_fin=${fecha_fin}`, { headers: headers})
          .subscribe((response: any) => {
              resolve(response);
          }, reject);
    });
   }
   asociarProyectos(datos) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      });
      const datosService =  JSON.stringify(datos);
      this.http.put(this.apiRest + 'facturacion/AsociarAProyectos', datosService, { headers: headers})
          .subscribe((response: any) => {
              resolve(response);
          }, reject);
    });
   }


   //////////////////////////////////////////// FILTRO AVANZADO
   getSolicitudesConServicios(datos) {
   return new Promise((resolve, reject) => {
     const headers = new HttpHeaders({
       'Content-Type':  'application/json',
       'Authorization': 'Bearer ' + sessionStorage.getItem('token')
     });
     this.http.post(this.apiRest + 'facturacion/RecogerSolicitudesConServicios', datos, { headers: headers})
         .subscribe((response: any) => {
             resolve(response);
         }, reject);
   });
  }

  filtrarSolicitudes(datos) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      });
      this.http.post(this.apiRest + 'facturacion/getSolicitudesFiltradas', datos, { headers: headers})
          .subscribe((response: any) => {
              resolve(response);
          }, reject);
    });
  }


  ////////////////////////////////// refacturar
  getRefacturas(fecha_inicio, fecha_fin) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      });
      this.http.get(this.apiRest + `facturas/refactura?fecha_inicio=${fecha_inicio}&fecha_fin=${fecha_fin}`, { headers: headers})
          .subscribe((response: any) => {
              resolve(response);
          }, reject);
    });
   }
   getPreRefacturas(fecha_inicio, fecha_fin) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      });
      this.http.get(this.apiRest + `facturas/prerefactura?fecha_inicio=${fecha_inicio}&fecha_fin=${fecha_fin}`, { headers: headers})
          .subscribe((response: any) => {
              resolve(response);
          }, reject);
    });
   }
  nuevaPreReFactura(datos) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      });
    //  const datosUser =  JSON.stringify(datos);
      this.http.post(this.apiRest + 'facturas/crearRefacturaSinAbono', datos, { headers: headers})
          .subscribe((response: any) => {
              resolve(response);
          }, reject);
    });
   }
   nuevaRefacturaConAbono(datos) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      });
    //  const datosUser =  JSON.stringify(datos);
      this.http.post(this.apiRest + 'facturas/crearRefacturaDesdeAbono', datos, { headers: headers})
          .subscribe((response: any) => {
              resolve(response);
          }, reject);
    });
   }

}
