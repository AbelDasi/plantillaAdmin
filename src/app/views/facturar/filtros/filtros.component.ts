import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { trigger, style, animate, transition, state } from '@angular/animations';
import { filtrosFacturacion } from 'src/app/shared/dtos/datosUsuarios';
import { FacturacionService } from '../facturacion.service';
import { DatePipe } from '@angular/common';
import { MetodosService } from 'src/app/shared/services/metodos.service';
import { ToastrService } from 'ngx-toastr';
import { NgbAccordion } from '@ng-bootstrap/ng-bootstrap';
import { async } from '@angular/core/testing';
import { Router } from '@angular/router';

@Component({
  selector: 'app-filtros',
  templateUrl: './filtros.component.html',
  styleUrls: ['./filtros.component.scss']
})
export class FiltrosComponent implements OnInit {
  objetoFiltro: filtrosFacturacion = new filtrosFacturacion();
  filtroHabilitado: any;
  estado: number[];
  fechaHasta: Date;
  fechaDesde: Date;
  estados: any;
  solicitudes: any[] = [];
  alturaPantalla: number;
  divPagina: number;
  listaSolicitudes: any[] = [];
  fechaInicio: Date = new Date();
  fechaFin: Date = new Date(); 
  tiposFacturacion = [{ oid: 0, nombre: 'Sin Factura' }, { oid: 1, nombre: 'Factura Inmediata' }, { oid: 2, nombre: 'Factura Mensual' }];
  envios_automaticos = [{ oid: 0, nombre: 'No' }, { oid: 1, nombre: 'Si' }];
  lookupData: { paginate: boolean; pageSize: number; store: any[]; };
  lookupData1: { paginate: boolean; pageSize: number; store: any[]; };
  @ViewChild('celdaSolicitudes', { static: false }) celdaSolicitudes: any;
  @ViewChild('accordion', { static: true }) accordion: NgbAccordion;
  alturaReferenciaNumber: number;
  alturaReferencia: string;
  constructor(public facturacion: FacturacionService, private datePipe: DatePipe, private metodos: MetodosService,
    private toastr: ToastrService, private router: Router) { }
   @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.alturaPantalla = window.innerHeight;
    const divPagina = document.getElementById('iniciado');
    if (this.facturacion.altura1 !== 0) {
      this.divPagina = this.facturacion.altura1;
    } else {
      this.divPagina = divPagina.offsetHeight;
    }
    const diferenciaAltura = this.alturaPantalla - this.divPagina;
    const sumaAltura = diferenciaAltura + this.celdaSolicitudes.nativeElement.offsetHeight - 80;
    this.alturaReferenciaNumber = sumaAltura;
    this.alturaReferencia = sumaAltura + 'px';
  } 
  ngOnInit() {
    
    this.filtroClientes();
    this.obtenerServicios();
    this.alturaReferencia = '500px';
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.accordion.expand('panel');
      this.onResize();
    }, 800);
  }

  filtroClientes() {
    this.facturacion.getClientes().then(data => {
      this.facturacion.clientes = data.clientes;

      this.facturacion.clientes.sort(this.metodos.compare);
      this.lookupData = {
        paginate: true,
        pageSize: 20,
        store: this.facturacion.clientes
      };
    });
  }
  obtenerServicios() {
    this.facturacion.getServicios().then((data: any) => {
      this.lookupData1 = {
        paginate: true,
        pageSize: 20,
        store: data.servicios
      };
    });

  }



  onSelectionChanged(e) {

  }
  // METODO QUE PREPARA LA FILA PARA PONERLE ESTILO CSS //
  onRowPrepared(event) {
    if (event.rowType === 'data') {
      if (event.key.bool_facturacion) {
        // tslint:disable-next-line:no-unused-expression
        event.rowElement.style.background = 'white';
        event.rowElement.style.color = 'green';
        event.rowElement.style.fontWeight = 'bold';
      }
    }
  }
  // METODO QUE PREPARA LA CELDA PARA PONERLE ESTILO CSS //
  onCellPrepared(event) {
    if (event.rowType === 'header') {
      event.cellElement.style.border = '0px';
      event.cellElement.style = 'color: white;font-weigth: bold;text-align: center;background-color:#0B86CA;border:1px solid white;font-size:12px;';
    } else if (event.rowType === 'data') {
      if (event.key.pedidoenfactura) {
        if (event.column.dataField === 'referencia_cliente') {
          event.cellElement.style = 'background: red;color: white;font-weight: bold;text-align: center;';
        }
      }
      if (event.column.dataField === 'observaciones' || event.column.dataField === 'observaciones_so') {
        event.cellElement.style = 'cursor:pointer';
      }
      event.cellElement.style =`text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;font-size: 13px; text-align:center;`;
    }
  }


  irSolicitudes(parametro) {
    this.facturacion.modoBusqueda = parametro;
    this.router.navigateByUrl('facturar/solicitudes');
  }

  async buscar() {
    this.facturacion.loading = true;
    let cadenaConsulta = '';
    this.objetoFiltro.fechainicio = this.datePipe.transform(this.fechaInicio, 'yyyy-MM-dd');
    this.objetoFiltro.fechafin = this.datePipe.transform(this.fechaFin, 'yyyy-MM-dd');
    cadenaConsulta+= `and fecha_entrada between '${this.objetoFiltro.fechainicio}' and '${this.objetoFiltro.fechafin}' `;
    let cadenaCliente = '';
    let cadenaClienteFacturar = '';
    let cadenaServicios = '';
    let cadenaServiciosSol = '';
    
    if (this.objetoFiltro.cliente) {
      
      for (const oid of this.objetoFiltro.cliente) {
        cadenaCliente += "," + oid;
      }
      cadenaCliente = cadenaCliente.substring(1);
      cadenaConsulta += `and cliente_oid in(${cadenaCliente}) `;
      
    }
    if (this.objetoFiltro.cliente_facturar) {
      for (const oid of this.objetoFiltro.cliente_facturar) {
        cadenaClienteFacturar += "," + oid;
      }
      cadenaClienteFacturar = cadenaClienteFacturar.substring(1);
      cadenaConsulta += `and factura_a in(${cadenaClienteFacturar}) `;
    }

    if (this.objetoFiltro.servicios) {
      for (const oid of this.objetoFiltro.servicios) {
        cadenaServicios += "," + oid;
      }
      cadenaServicios = cadenaServicios.substring(1);
      
    }
    if (this.objetoFiltro.solicitud) {
      if (this.objetoFiltro.solicitud.includes('..')) {
        this.splitearPorRangos(this.objetoFiltro.solicitud);
        cadenaConsulta += this.splitearPorRangos(this.objetoFiltro.solicitud);
      } else {
        const solicitud = this.objetoFiltro.solicitud.split(';');
        const oids = [];
        for (const oid of solicitud) {
          oids.push(oid);
        }
        this.splitearPorComas(oids);
      } 

    }
    if (this.objetoFiltro.referencia_cliente) {
      cadenaConsulta += `and referencia_cliente='${this.objetoFiltro.referencia_cliente}' `;
    }


    if (cadenaServicios !== '') {
      const jsonData = '{"oids":' + JSON.stringify(cadenaServicios) + '}';
      this.facturacion.getSolicitudesConServicios(jsonData).then(async(data: any)=> {
        if (data.ok) {
          for (const oid of await data.solicitudes) {
            cadenaServiciosSol += "," + oid.oid;
          }
          cadenaServiciosSol = cadenaServiciosSol.substring(1);
        }
        cadenaConsulta += `and oid in(${cadenaServiciosSol}) `;
        const jsonData1 = '{"consulta":' + JSON.stringify(cadenaConsulta) + '}';
        await this.facturacion.filtrarSolicitudes(jsonData1).then(async(data: any)=> {
          this.solicitudes = await data.solicitudes;
          this.facturacion.loading = false;
          this.accordion.collapse('panel');
          this.objetoFiltro = new filtrosFacturacion();
        }, error => {
          this.facturacion.loading = false;
        });
      });
    } else {
      const jsonData1 = '{"consulta":' + JSON.stringify(cadenaConsulta) + '}';
      await this.facturacion.filtrarSolicitudes(jsonData1).then(async(data: any)=> {
        if (data.ok) {
          this.solicitudes = await data.solicitudes;
          this.facturacion.loading = false;
          this.accordion.collapse('panel');
          this.objetoFiltro = new filtrosFacturacion();
        }
      }, error => {
        this.facturacion.loading = false;
      });
      
    }
    
    
    
  }

  splitearPorRangos(parametro) {
  const solicitud =  parametro.split('..');

    for (let i = solicitud[0].length; i < 10; i++) {
      if (solicitud[0].length < 10) {
        solicitud[0] += '0';
      }
    }

    for (let i = parametro[1].length; i < 10; i++) {
      if (solicitud[1].length < 10) {
        solicitud[1] += '0';
      }
    }
    return `and codigo > '${solicitud[0]}' and codigo < '${solicitud[1]}' `;
  }

  splitearPorComas(parametro) {
    let cadena = '';
    for (const oid of parametro) {
      cadena += `,'${oid}'`;
  }
  return `and codigo in(${cadena})`;
  

  }

  /* prefacturar() {
    const miau =this.solicitudesSeleccionadas.map(key => {
     
      return {pedido_completo: key.req_pedido_completo, entregadas: key.entregadas, total: key.total};
   });
   const ouhmamah = miau.filter(
     solicitud => solicitud.pedido_completo === true && solicitud.entregadas < solicitud.total);
   if (ouhmamah.length > 0) {
     this.toastr.error('Alguna de sus solicitudes seleccionadas no cumple con los requisitos, revise su selección', 'ERROR');
     return;
   }
    this.solicitudesNoPrefactura = [];
   // metodo para mandar las prefacturas
   for (const item of this.solicitudesSeleccionadas) {
     if (item.retenida) {
       this.solicitudesNoPrefactura.push(item);

     }
   }
   if (this.solicitudesNoPrefactura.length > 0) {
     this.mostrarPopUp = true;
     return;
   }
   confirm('Vas a prefacturar', '¿Continuar?').then(res => {
     if (res) {
       this.facturacion.mandarAPrefacturar(this.listaPrefacturas).then((resp: any) => {
         this.facturacion.loading = true;
         if (resp.ok) {
           this.solicitudesPrefactura = [];
           const quitarDeGrid = [];
           const serviciosNoFacturados = [];
           this.getCountTipoFacturacion();

           this.seleccionBotones(this.facturacion.modoBusqueda);
           for (const solicitud of resp.body) {
             for (const soli of solicitud.solicitudes) {
               const busca = this.solicitudesPrefactura.find(key => key === soli);
               if (!busca) {
                 soli.nPrefactura = solicitud.prefactura.codigo;
                 this.solicitudesPrefactura.push({ solicitud: soli, oids: solicitud.oids, codigos: solicitud.oids1 });
               }
             }
           }
           this.mostrarPopUp1 = true;
           this.toastr.success('Solicitudes mandadas a prefacturas correctamente', 'Correcto');

         } else {
           if (resp.cabecera.length === 0) {
             this.toastr.error('Las solicitudes que quiere prefacturar no tienen servicios, revise las solicitudes', 'Error');
           } else {
             this.solicitudesNoPrefactura = resp.servicios_noFac;
             this.mostrarPopUp = true;
           }
         }
         this.facturacion.loading = false;
       });
     }
   }); 
 } */

}
