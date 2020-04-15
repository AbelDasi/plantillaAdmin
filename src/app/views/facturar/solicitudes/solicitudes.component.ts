import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
// servicios
import { PerfilesService } from '../../../shared/services/perfiles.service';
import { FacturacionService } from '../facturacion.service';
import { MetodosService } from 'src/app/shared/services/metodos.service';
// fin servicios
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { filtrosFacturacion, PerfilGridMod, PerfilGrid, countFacturacion } from '../../../shared/dtos/datosUsuarios';
import { DxDataGridComponent, DxValidationGroupComponent } from 'devextreme-angular';
import { confirm } from 'devextreme/ui/dialog';
import Button from 'devextreme/ui/button';
// animaciones
import { trigger, style, animate, transition, state } from '@angular/animations';

import { Router } from '@angular/router';
import { PrefacturaComponent } from '../prefactura/prefactura.component';
import ArrayStore from 'devextreme/data/array_store';
import { NgbAccordion } from '@ng-bootstrap/ng-bootstrap';
import { ObjetosPerfil } from './objetosConfiguracion';

let idClienteCambia: number;

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.scss'],
  animations: [
    trigger('fade', [
      state('show', style({
        opacity: 1
      })),
      state('hide', style({
        opacity: 0
      })),
      transition('show => hide', animate('600ms ease-out')),
      transition('hide => show', animate('1000ms ease-in')),
    ])
  ]
})
export class SolicitudesComponent implements OnInit {
  // modelos
  countFacturacion: countFacturacion = new countFacturacion();
  objetoFiltro: filtrosFacturacion = new filtrosFacturacion();
  // date
  fechaDesde: Date;
  fechaHasta: Date;
  // boolean
  habilitarVerServicios: boolean;
  filtroHabilitado: boolean;
  mostrarFiltro: boolean = false;
  seleccionGridBool: boolean;
  cambiaEstado: boolean;
  editCellNoSelect: boolean;
  idClienteHabilitado: boolean;
  filtrarBol: boolean;
  seleccion: boolean = false;
  mostrarPopUp: boolean;
  codigosVisibles: boolean = false;
  paginacionGrid: boolean = true;
  verListaPerfiles: boolean = false;
  objetoPerfiles:ObjetosPerfil = new ObjetosPerfil();
  
  perfilHtml = `{"columns":[{"visibleIndex":0,"dataField":"codigo",
        "dataType":"string","visible":true},{"visibleIndex":1,"dataField":"acuerdo",
        "dataType":"string","visible":true},{"visibleIndex":2,"dataField":"fecha_entrada",
        "dataType":"string","visible":true},{"visibleIndex":3,"dataField":"fecha_entrega",
        "dataType":"string","visible":true},{"visibleIndex":4,"dataField":"fecha_entrega_prevista",
        "dataType":"string","visible":true},{"visibleIndex":5,"dataField":"estado","dataType":"string",
        "visible":true},{"visibleIndex":6,"dataField":"serviciosfac1","dataType":"number","visible":true},
        {"visibleIndex":7,"dataField":"total","dataType":"number","visible":true},{"visibleIndex":8,
        "dataField":"pedidoenfactura","dataType":"boolean","visible":true},{"visibleIndex":9,"dataField":"req_no_mezclar",
        "dataType":"boolean","visible":true},{"visibleIndex":10,"dataField":"agrupar_facturas_analiticas",
        "dataType":"boolean","visible":true},{"visibleIndex":11,"dataField":"desglosar_direccion_envio",
        "dataType":"boolean","visible":true},{"visibleIndex":12,"dataField":"direccion_envio","dataType":"number",
        "visible":true},{"visibleIndex":13,"dataField":"referencia_cliente","dataType":"string","width":100,"visible":true},
        {"visibleIndex":14,"dataField":"cliente_oid","dataType":"number","width":200,"visible":true},
        {"visibleIndex":15,"dataField":"factura_a","dataType":"number","width":200,"visible":true},
        {"visibleIndex":16,"dataField":"codigo_proyecto","dataType":"string","visible":true},
        {"visibleIndex":17,"dataField":"codigo_tarea","dataType":"string","visible":true},
        {"visibleIndex":18,"dataField":"codigo_subtarea","dataType":"string","visible":true},
        {"visibleIndex":19,"dataField":"emails_envio","dataType":"string","width":150,"visible":true},
        {"visibleIndex":20,"dataField":"tipologia","dataType":"number","visible":true},{"visibleIndex":21,
        "dataField":"tipo_facturacion","dataType":"number","visible":true},{"visibleIndex":22,
        "dataField":"tipo_facturacion_cliente","dataType":"number","visible":true},{"visibleIndex":23,
        "dataField":"envio_automatico","dataType":"number","visible":true},{"visibleIndex":24,"dataField":"retenida",
        "dataType":"boolean","visible":true},{"visibleIndex":25,"dataField":"observaciones","dataType":"string",
        "visible":true},{"visibleIndex":26,"dataField":"observaciones_so","dataType":"string","visible":true},
        {"visibleIndex":27,"dataField":"observaciones_fac","visible":true},{"visibleIndex":28,"dataField":"codigo_prefactura",
        "visible":false},{"visibleIndex":29,"dataField":"codigo_factura","visible":false},{"visibleIndex":30,"dataField":"codigo_abono",
        "visible":false},{"visibleIndex":31,"dataField":"importe","dataType":"number","visible":true}],"allowedPageSizes":[25,50,100],
        "filterPanel":{"filterEnabled":true},"filterValue":null,"searchText":"","pageIndex":0,"pageSize":50}`;
  // string
  mensajeCarga: string;
  seleccionGrid: string;
  alturaReferencia: string;
  textoSeleccion: string;
  parametroFiltroTipo: string;
  detectarEventoChange: string;
  tituloPagina: string;
  pantalla: String = 'solicitudesFacturacion';
  modoBusqueda = 'inmediata';
  // numbers
  alturaPantalla: number;
  alturaReferenciaNumber: number;
  divPagina: number;
  columnIndex: number;
  idCliente: number;
  idPerfilEliminar: number;
  preFacturasSel: number = 0;
  longitudPre: number = 0;
  // any
  estado: any;
  seleccionado: any;
  nombrePerfil: any;
  editado: any;
  tipologias: any[] = [];
  proyectos: any[] = [];
  tareas:any[] = [];
  subtareas: any[] = [];
  clientes: any[] = [];
  envios_automaticos: any[] = [];
  listaTipolClient: any[] = [];
  filasEditadas: any[] = [];
  listaPrefacturas: any[] = [];
  estados: any[] = [];
  solicitudes: any[] = [];
  solicitudesSeleccionadas: any[] = [];
  tiposFacturacion: any[] = [];
  perfiles: any[] = [];
  selectedItemKeys: any[] = [];
  solicitudesNoPrefactura: any[] = [];
  solicitudesPrefactura: any[] = [];
  direccionesEnvio: any[] = [];
  // array store de devextreme
  dataSources: ArrayStore;

  // viewchild
  @ViewChild('child1', { static: false }) childOne: PrefacturaComponent;
  @ViewChild(DxDataGridComponent, { static: false }) grid: DxDataGridComponent;
  @ViewChild('val1', { static: false }) validationGroup: DxValidationGroupComponent;
  @ViewChild('val2', { static: false }) validationGroup1: DxValidationGroupComponent;
  @ViewChild('celdaSolicitudes', { static: false }) celdaSolicitudes: any;
  @ViewChild('accordion', { static: false }) accordion: NgbAccordion;
  // lookup
  lookupData: { paginate: boolean; pageSize: number; store: any; };
  lookupData1: { paginate: boolean; pageSize: number; store: any; };
  lookupData2: { paginate: boolean; pageSize: number; store: any; };
  lookupData3: { paginate: boolean; pageSize: number; store: any; };
  mostrarPopUp1: boolean;
  popUpObservaciones: boolean;
  observacion: any;
  fechaInicio: Date = new Date();
  fechaFin: Date = new Date(); 
  lookupDataServicios: { paginate: boolean; pageSize: number; store: any; };
  lookupDataDireccionesEnvio: { paginate: boolean; pageSize: number; store: any; };
  tienePerfil: boolean;

  constructor(public facturacion: FacturacionService,
    private toastr: ToastrService,
    private datePipe: DatePipe,
    public perfil: PerfilesService,
    private metodos: MetodosService,
    private router: Router) {
    this.getDireccionesEnvio();
    this.filtroClientes();
    this.filtroTipologias();
    this.obtenerServicios();
    let self = this;
    
    this.setProyecto = function (rowData: any, value: any, event) {
      (<any>this).defaultSetCellValue(rowData, value);
      rowData.codigo_subtarea = -1;
      rowData.codigo_tarea = -1;
    }
    this.setTarea = function (rowData: any, value: any, event) {
    rowData.codigo_subtarea = -1;
    
    (<any>this).defaultSetCellValue(rowData, value);
    }
    this.setsubTarea = function (rowData: any, value: any, event) {
    //  rowData.codigo_subtarea = -1;
    (<any>this).defaultSetCellValue(rowData, value);
    }
    this.setClientValue = function (rowData: any, value: any, event) {
      
      
      rowData.tipologia = -1;
      idClienteCambia = value;
      event.factura_a = value;
      const pos = self.listaTipolClient.map(function (e) { return e.oid; }).indexOf(event.oid);
      if (pos !== -1) {
        self.listaTipolClient.splice(pos, 1);
      }
      self.listaTipolClient.push(event);
      (<any>this).defaultSetCellValue(rowData, value);
    } 
    this.getFilteredTipo = this.getFilteredTipo.bind(this);
    this.getFilteredTarea = this.getFilteredTarea.bind(this);
    this.getFilteredSubTarea = this.getFilteredSubTarea.bind(this);
  }
  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.alturaPantalla = window.innerHeight;
    const divPagina = document.getElementById('inicio');
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
    this.configuracionInicial();
    this.getPerfiles();
  }
  
  configuracionInicial() {
    this.fechaInicio.setMonth(this.fechaInicio.getMonth() - 1);
    this.cambiaEstado = true;
    this.facturacion.oidsArrayx = [];
    this.facturacion.oidsArray = [];
    this.alturaReferencia = '500px';
    this.detectarEventoChange = '';
    idClienteCambia = null;
    this.idClienteHabilitado = false;
    this.tiposFacturacion = [{ oid: 0, nombre: 'Sin Factura' }, { oid: 1, nombre: 'Factura Inmediata' }, { oid: 2, nombre: 'Factura Mensual' }];
    this.envios_automaticos = [{ oid: 0, nombre: 'No' }, { oid: 1, nombre: 'Si' }];
    this.seleccionGrid = 'page';
    this.mensajeCarga = 'Cargando';
    this.habilitarVerServicios = true;
    this.getCountTipoFacturacion();
    if ( this.facturacion.solicitudes.length > 0) {
      
      this.parametroFiltroTipo = this.facturacion.modoBusqueda;
      if (this.parametroFiltroTipo === 'busqueda') {
        
        this.irPaginaFiltros('parametro');
      }
      return;
    }
    if (this.facturacion.modoBusqueda === this.modoBusqueda) {
      this.seleccionBotones(this.facturacion.modoBusqueda);
      return;
    }
    if (this.facturacion.modoBusqueda !== '') {
      this.seleccionBotones(this.facturacion.modoBusqueda);
      if (this.facturacion.modoBusqueda === 'busqueda') {
        this.codigosVisibles = true;
        this.mostrarFiltro = true;
      }
      if (this.facturacion.modoBusqueda === 'prefactura') {
        this.facturacion.gridSolicitudesBol = false;
        this.facturacion.gridFacturas = false;
        this.codigosVisibles = false;
      }
    }
     else {
      this.facturacion.modoBusqueda = this.modoBusqueda;
      this.codigosVisibles = false;

      this.seleccionBotones(this.modoBusqueda);
      
    }
  }
  // tslint:disable-next-line:use-lifecycle-interface
  ngAfterViewInit() {
    setTimeout(() => {
      this.onResize();
    }, 800);
  }
  /// METODO PARA ORDENAR ARRAYS DE FORMA ASCENDENTE
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
  // LLAMADA PARA RECOGER EL NUMERO DE SOLICITUDES CON UN TIPO DE FACTURACION //
  getCountTipoFacturacion() {
    this.facturacion.getCountTipoFacturacion().then((data: any) => {

      if (data.ok) {
        console.log(data);
        
        this.countFacturacion = data.numero;
      }
    });
  }
  // METODO PARA MOSTRAR Y OCULTAR LOS FILTROS AVANZADOS
  get stateName() {
    return this.filtroHabilitado ? 'show' : 'hide';
  }
  getDireccionesEnvio() {
    this.facturacion.getDireccionesEnvio().then((data: any)=> {
      if (data.ok) {
        this.lookupDataDireccionesEnvio = {
          paginate: true,
          pageSize: 20,
          store: data.direccionesEnvio
        };
        
      }
      
    }); 
  }
  // METODO PARA LLAMAR A LOS BOTONES DE ARRIBA DEL GRID SOLICITUDES
  seleccionBotones(parametro) {
    this.mostrarFiltro = false;
    this.parametroFiltroTipo = parametro;
    switch (parametro) {
      case 'sin facturar':
        this.facturacion.gridPrefacturas = false;
        this.facturacion.gridFacturas = false;
        this.facturacion.gridSolicitudesBol = true;
        
        this.codigosVisibles = false;
        this.facturacion.modoBusqueda = 'sin facturar';
        if (this.detectarEventoChange !== '') {
          confirm('Tiene cambios pendientes de guardar, se perderan los cambios', '¿Continuar?').then(res => {
            if (res) {
              this.recogerSolicitudes('Sin facturar', 'Solicitudes Sin Facturar', 0, this.objetoPerfiles.perfilSinFactura);
              this.grid.instance.cancelEditData();
            }
          });
        } else {
          this.recogerSolicitudes('Sin facturar', 'Solicitudes Sin Facturar', 0, this.objetoPerfiles.perfilSinFactura);
        }
        
        break;
      case 'inmediata':
        this.codigosVisibles = false;
        this.facturacion.gridPrefacturas = false;
        this.facturacion.gridFacturas = false;
        this.facturacion.gridSolicitudesBol = true;
        
        this.facturacion.modoBusqueda = 'inmediata';
        if (this.detectarEventoChange !== '') {
          confirm('Tiene cambios pendientes de guardar, se perderan los cambios', '¿Continuar?').then(res => {
            if (res) {
              this.recogerSolicitudes('Inmediata y Mensual', 'Solicitudes Factura Inmediata', 1, this.objetoPerfiles.perfilInmediataMensual);
              this.grid.instance.cancelEditData();
            }
          });
        } else {
          this.recogerSolicitudes('Inmediata y Mensual', 'Solicitudes Factura Inmediata', 1, this.objetoPerfiles.perfilInmediataMensual);
        }
        break;
       
      case 'mensual':
        this.codigosVisibles = false;
        this.facturacion.gridPrefacturas = false;
        this.facturacion.gridFacturas = false;
        this.facturacion.gridSolicitudesBol = true;
        this.facturacion.modoBusqueda = 'mensual';
       
        if (this.detectarEventoChange !== '') {
          confirm('Tiene cambios pendientes de guardar, se perderan los cambios', '¿Continuar?').then(res => {
            if (res) {
              this.recogerSolicitudes('Inmediata y Mensual', 'Solicitudes Factura Mensual', 2, this.objetoPerfiles.perfilInmediataMensual);
              this.grid.instance.cancelEditData();
            }
          });
        } else {
          this.recogerSolicitudes('Inmediata y Mensual', 'Solicitudes Factura Mensual', 2, this.objetoPerfiles.perfilInmediataMensual);
        }
        
        break;
      case 'retenida':
      
        this.codigosVisibles = false;
        this.facturacion.gridPrefacturas = false;
        this.facturacion.gridFacturas = false;
        this.facturacion.gridSolicitudesBol = true;
        this.facturacion.modoBusqueda = 'retenida';
        if (this.detectarEventoChange !== '') {
          confirm('Tiene cambios pendientes de guardar, se perderan los cambios', '¿Continuar?').then(res => {
            if (res) {
              this.recogerSolicitudes('Retenidas', 'Solicitudes Retenidas', 3, this.objetoPerfiles.perfilRetenidas);
              this.grid.instance.cancelEditData();
            }
          });
        } else {
          this.recogerSolicitudes('Retenidas', 'Solicitudes Retenidas', 3, this.objetoPerfiles.perfilRetenidas);
        }
        
        break;
      case 'prefactura':
        this.facturacion.gridPrefacturas = true;
        this.facturacion.gridFacturas = false;
        this.facturacion.gridSolicitudesBol = false;
        this.parametroFiltroTipo = parametro;
        this.facturacion.tituloPagina = 'Prefacturas';
        break;
      
      case 'factura':
        this.facturacion.gridPrefacturas = false;
        this.facturacion.gridFacturas = true;
        this.facturacion.gridSolicitudesBol = false;
        this.parametroFiltroTipo = parametro;
        this.facturacion.tituloPagina = 'Facturas';
        break;
      default:
        break;
    }
  }
   recogerSolicitudes(parametro, tituloPagina, numero, perfil?) {
    if (!this.facturacion.gridSolicitudesBol) {
      this.facturacion.gridSolicitudesBol = true;
    }
    this.mostrarFiltro = false;
    this.detectarEventoChange = '';
    this.facturacion.tituloPagina = tituloPagina;
    this.facturacion.getSolicitudesTipoFacturacion(numero).then(async( data: any) => {
      if (data.ok) {
        this.facturacion.solicitudes= await data.solicitudes;
        console.log(this.facturacion.solicitudes);
        
        this.dataSources = new ArrayStore({
            data: this.solicitudes
        });
        } else {
        this.toastr.error('Ha habido un error', 'Error');
        this.facturacion.loading = false;
        }
        this.refrescar(JSON.parse(perfil));
        }, error => {
        this.toastr.error('Ha habido un error', 'Error');
        this.facturacion.loading = false;
        });
  }

 
  cambioSeleccion($event) {
    if (this.seleccionGridBool) {
      this.textoSeleccion = 'Borrar selección';
      this.seleccionGrid = 'allPages';
      setTimeout(() => {
        this.grid.instance.selectAll();
      }, 500);
    } else {
      this.textoSeleccion = 'Seleccionar todos';
      this.seleccionGrid = 'page';
      this.grid.instance.clearSelection();
    }
  }
  selectEstado(evento) {
    this.estado = evento.target.value;
  }
  filtroTipologias() {
    this.facturacion.getTipologias().then((data: any) => {
      this.tipologias = data.tipologias;
    });
    this.facturacion.getProyectos().then((data: any) => {
      this.proyectos = data.proyectos;
      this.tareas = data.tareas;
      this.subtareas = data.subtareas;
      this.lookupData1 = {
        paginate: true,
        pageSize: 20,
        store: this.proyectos
      }; 
    });
  }
  getFilteredTipo(options) {
    
    return {
      store: this.tipologias,
      filter: options.data ? ['cliente', '=', options.data.factura_a] : null
    };
  }
  getFilteredTarea(options) {
    return {
      store: this.tareas,
      filter: options.data ? ['proyecto', '=', options.data.codigo_proyecto] : null
    };
  }
  getFilteredSubTarea(options) {
    return {
      store: this.subtareas,
      filter: 
         options.data ? [['tarea', '=', options.data.codigo_tarea], 'and',['proyecto', '=', options.data.codigo_proyecto] ] : null 
    
    

    };
  }
  setClientValue(rowData, value: any, event): void {
  }
  setProyecto(rowData, value: any, event): void {
  }
  setTarea(rowData, value: any, event): void {
  }
  setsubTarea(rowData, value: any, event): void {
  }

  
  // EVENTOS DEL PRIMER GRID //
  // METODO PARA CONTROLAR LAS FILAS QUE SE SELECCIONAN DEL GRID //
  onSelectionChanged(e) {
    const buttonElement = this.grid.instance.element().querySelector('#detallesExp');
    e.component.refresh(true);
    this.solicitudesSeleccionadas = e.selectedRowKeys;
    const oids = [];
    const prefactura = [];
    for (const item of this.solicitudesSeleccionadas) {
      oids.push(item.oid);
      prefactura.push(item.oid);
    }
    if (this.solicitudesSeleccionadas.length > 0 && this.editado === false) {
      this.habilitarVerServicios = false;
      Button.getInstance(buttonElement).option('disabled', false);
    } else {
      this.habilitarVerServicios = true;
      Button.getInstance(buttonElement).option('disabled', true);
    }
    this.facturacion.oidsArray = oids;
    this.listaPrefacturas = prefactura;
  }
  // METODO QUE PREPARA LA FILA PARA PONERLE ESTILO CSS //
  onRowPrepared(event) {
    if (event.rowType === 'data') {
      if (event.key.bool_facturacion) {
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
        if (event.column.dataField === 'referencia_cliente') {
          if (event.key.pedidoenfactura) {
          event.cellElement.style = `text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;font-size: 13px; text-align:center;
          background: red;color: white;font-weight: bold;`;
          
        } else {
          event.cellElement.style =`text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;font-size: 13px; text-align:center;`;      
        }
      }
       else if (event.column.dataField === 'total_importe' || event.column.dataField === 'observaciones_so') {
        event.cellElement.style = event.cellElement.style =`text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;font-size: 13px; text-align:center;cursor:pointer;`;
      } 
       else  {
        event.cellElement.style =`text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;font-size: 13px; text-align:center;`;
      } 
      
    }
  }
  // METODO PARA CONTROLAR SI HAY ALGUN CAMBIO EN LOS FILTROS QUE LIMPIE LA SELECCION DE LAS FILAS //
  onOptionChanged1(event) {
    if (event.name === 'columns') {
      if (this.solicitudesSeleccionadas.length > 0) {
        this.grid.instance.clearSelection();
        this.facturacion.oidsArray = [];
      }
    }
  }

  onRowUpdated(event) {
    this.filasEditadas.push(event.data);
  }

  // METODO QUE INICIALIZA Y PREPARA EL TOOLBAR DEL GRID Y DA ACCESO A LOS BOTONES DEL MISMO PARA CONTROLAR SU COMPORTAMIENTO //
  onToolbarPreparing1(event) {
    const esto = this;
    const toolbarItems = event.toolbarOptions.items;
    for (const item of toolbarItems) {
      if (item.name === 'revertButton') {
        item.options.location = 'after';
        item.options.onClick = function (e) {
          confirm('Los datos seran todos restaurados', '¿Está seguro/a?').then(res => {
            if (res === true) {
              esto.grid.instance.cancelEditData();
              esto.detectarEventoChange = '';
              esto.idClienteHabilitado = false;
              const buttonElement = esto.grid.instance.element().querySelector('#detallesExp');
              if (esto.solicitudesSeleccionadas.length > 0 && esto.editado === false) {
                esto.habilitarVerServicios = false;
                Button.getInstance(buttonElement).option('disabled', false);
              } else {
                esto.habilitarVerServicios = true;
                Button.getInstance(buttonElement).option('disabled', true);
              }
            }
          });
        };
      }
      if (item.name === 'saveButton') {
        item.options.location = 'before';
        item.options.type = 'success';
        item.options.width = 100;
        item.options.onClick = function (e) {
          confirm('¿Confirma que quiere guardar los cambios efectuados?', 'Guardar cambios').then(res => {
            if (res) {
              esto.filasEditadas = [];
              esto.grid.instance.saveEditData().then(() => {
                esto.facturacion.loading = true;
                esto.facturacion.modificarSolicitudes(esto.filasEditadas).then(data => {
                  const ok = data.ok;
                  if (ok === data.ok) {
                    esto.facturacion.loading = false;
                    esto.toastr.success('Se han modificado ' + data.numero + ' registros', 'Correcto');
                    esto.getCountTipoFacturacion();
                    esto.seleccionBotones(esto.facturacion.modoBusqueda);
                    esto.grid.instance.refresh();
                  }
                });
              });;
              esto.grid.instance.clearSelection();
              esto.editado = false;
              esto.detectarEventoChange = '';
              esto.idClienteHabilitado = false;
            }
          });
        };
      }
    }
    event.toolbarOptions.items.unshift({
      location: 'after',
      name: 'verDetalles',
      widget: 'dxButton',
      options: {
        icon: 'bulletlist',
        text: 'Ver servicios',
        disabled: true,
        elementAttr: { id: 'detallesExp' },
        onClick: function () {
          esto.verDetallesExpedicion();
          esto.seleccionGrid = 'page';
          esto.seleccionGridBool = false;
        }
      }
    },
    {
      location: 'after',
      name: 'limpiarSel',
      widget: 'dxButton',
      options: {
        icon: 'bulletlist',
        text: 'Limpiar filtros',
        disabled: false,
        elementAttr: { id: 'filtrosclear' },
        onClick: function () {
          esto.grid.instance.clearFilter();
        }
      }
    },
      {
        location: 'after',
        name: 'chooseColumn',
        widget: 'dxButton',
        options: {
          icon: 'columnchooser',
          onClick: function () {
            esto.grid.instance.showColumnChooser();
          }
        }
      },
       {
        widget: 'dxMenu',
        location: 'after',
        options: {
          items: [
            {
              icon: 'fas fa-grip-horizontal',
              hint: 'perfiles',
              items: [
                {
                  text: 'Añadir Perfil',
                  hint: 'Añadir perfil',
                  elementAttr: { id: 'addPerfil' },
                  onClick: function () {
                    esto.facturacion.popUpPerfil = true;
                    esto.nombrePerfil = '';
                  }
                },
                {
                  text: 'Modificar Perfil',
                  hint: 'Modificar perfil',
                  elementAttr: { id: 'modPerfil' },
                  onClick: function () {
                    esto.facturacion.popUpPerfilMod = true;
                    const buscaNombre = esto.facturacion.perfiles.find((key) => key.oid === esto.seleccionado);
                    esto.nombrePerfil = buscaNombre.nombre;
                  }
                },
                {
                  text: 'Eliminar Perfil',
                  hint: 'Eliminar perfil',
                  elementAttr: { id: 'deletePerfil' },
                  onClick: function () {
                    esto.facturacion.popUpPerfilDelete = true;
                  }
                },
                {
                  text: 'Seleccionar Perfil',
                  hint: 'Seleccionar perfil',
                  elementAttr: { id: 'seleccionPerfil' },
                  onClick: function () {
                    esto.facturacion.verListaPerfiles = true;
                  }
                }
              ]
            }
          ]
        }
      });
  }
  // METODO PARA CONFIGURAR CIERTOS ASPECTOS DEL GRID UNA VEZ SE HA INICIALIZADO
  onInitialized(e) {
    setTimeout(() => {
      this.getPerfilSeleccionado();
      e.component.option('stateStoring', { ignoreColumnOptionNames: [] });
    }, 100);
  }
  // METODO IMPORTANTE, SE ACCEDE A EL PARA CONTROLAR LA EDICION EN CASCADA Y LA EDICION INDIVIDUAL DE LAS CELDAS.
  onEditorPreparing(event) {
    const grid = event.component;
    const esto = this;
    if (event.parentType === 'dataRow') {
      esto.editado = esto.grid.instance.hasEditData();
      const oldOnValueChanged = event.editorOptions.onValueChanged;
      event.editorOptions.onValueChanged = function (e) {
        oldOnValueChanged.apply(this, arguments);
        if (event.type !== 'selection') {
          if (esto.editCellNoSelect) {
            esto.detectarEventoChange = 'change';
          } else {
            esto.detectarEventoChange = 'change';
            if (esto.idClienteHabilitado === true) {
              confirm('Solo se aplicaran cambios en los clientes que tengan esta tipologia', '¿Continuar?').then(res => {
                if (res) {
                  const solicitudesClient = [];
                  esto.solicitudesSeleccionadas.forEach(element => {
                    const pos = esto.listaTipolClient.map(function (e) { return e.oid; }).indexOf(element.oid);
                    if (pos !== -1) {
                      solicitudesClient.push(esto.listaTipolClient[pos]);
                    } else {
                      solicitudesClient.push(element);
                    }
                  });
                  esto.facturacion.loading = true;
                  setTimeout(() => {
                    solicitudesClient.forEach((key, index) => {
                      const pos = esto.grid.instance.getDataSource().items().map(function (e) { return e.oid; }).indexOf(key.oid);
                      if (key.bool_facturacion === false) {
                        if (key.factura_a === esto.idCliente) {
                          grid.cellValue(pos, esto.columnIndex, e.value);
                        }
                        if (index === solicitudesClient.length - 1) {
                          esto.facturacion.loading = false;
                        }
                      }
                    });
                  }, 200);
                }
              });
              esto.idClienteHabilitado = false;
            } else {
              if (esto.solicitudesSeleccionadas.length < 1) {
                return;
              }
              esto.facturacion.loading = true;
              setTimeout(() => {
                esto.solicitudesSeleccionadas.forEach((key, index) => {
                  const posicion = esto.grid.instance.getDataSource().items().indexOf(key);
                  if (key.bool_facturacion === false && esto.idClienteHabilitado === false) {
                    grid.cellValue(posicion, esto.columnIndex, e.value);
                    if (index === esto.solicitudesSeleccionadas.length - 1) {
                      esto.facturacion.loading = false;
                    }
                  }
                });
              }, 200);
            }
          }
        }
      };
    }
  }
  // METODO QUE SE ACTIVA CUANDO HACES CLICK SOBRE UNA CELDA, AQUI CONTROLAMOS UN BOOLEANO PARA SABER SI LA EDICION ES POR CELDA O FILAS
  onCellClick(e) {
    if (e.rowType === 'data') {
      this.columnIndex = e.columnIndex;
      if (e.column.type === 'selection') {
        this.editCellNoSelect = false;
        if (e.row.isSelected) {
        }
      } else {
        if (!e.row.isSelected) {
          this.editCellNoSelect = true;
        } else {
          this.editCellNoSelect = false;
        }
      }
      this.idCliente = e.data.factura_a;
      if (e.column.dataField === 'tipologia') {
        if (idClienteCambia !== null) {
          if (this.idCliente !== idClienteCambia) {
            //  this.idCliente = idClienteCambia;
            //  idClienteCambia = null;
          }
        } else {
          this.idCliente = e.data.factura_a;
        }
        this.idClienteHabilitado = true;

      } else {
        if (e.column.dataField === 'observaciones') {
          if (e.data.observaciones.length > 1) {
            this.popUpObservaciones = true;
            this.facturacion.getObservacion(e.data.oid, 'observaciones').then((data: any) => {
            this.observacion = data.observacion_grid.observaciones;
            });
          }
        }
        if (e.column.dataField === 'observaciones_so') {
          if (e.data.observaciones_so) {
            this.popUpObservaciones = true;
            this.facturacion.getObservacion(e.data.oid, 'observaciones_so').then((data: any) => {
              this.observacion = data.observacion_grid.observaciones_so;
            });
          }
        }
        
       
        this.idClienteHabilitado = false;
        //  this.idCliente = e.key.factura_a;
      }
    }
  }
  /// EVENTO PARA CONTROLAR QUE FILAS SE PUEDEN EDITAR Y CUALES NO
  onEditingStart(event) {
    if (event.data.bool_facturacion === true || event.data.estado_oid !== 6) {
      event.cancel = true;
    }
  }
  ////// EVENTO PARA GUARDAR LAS FILAS SELECCIONADAS ////

  // METODO QUE GUARDA LOS OIDS DE LAS SOLICITUDES PARA HACER UNA PETICION AL SERVIDOR Y RECOGER TODOS LOS SERVICIOS DE ESAS SOLICITUDES
  guardarSeleccionadosPrimerGrid() {
    this.facturacion.oidsArrayx = [];
    for (const item of this.facturacion.oidsArray) {
      this.facturacion.oidsArrayx.push(item);
    }
    this.grid.instance.clearSelection();
    
    return this.facturacion.oidsArrayx.length;
  }
  // LLAMADA AL COMPONENTE HIJO //
  verDetallesExpedicion() {
    if (this.detectarEventoChange !== '') {
      confirm('Tiene cambios por guardar, se perderan', '¿Continuar?').then(res => {
        if (res) {
          this.facturacion.getPerfilesUsuario('serviciosFacturacion').then((data: any) => {
            if (data.ok) {
              this.detectarEventoChange = '';
              this.facturacion.perfiles = data.perfil;
              if (this.facturacion.perfiles === data.perfil) {
                this.configuracionPanelServicios();
                this.guardarSeleccionadosPrimerGrid();
              }
            } else {
              this.toastr.error('Ha habido un error', 'Error');
            }
          });
        }
      });
    } else {
      this.facturacion.getPerfilesUsuario('serviciosFacturacion').then((data: any) => {
        if (data.ok) {
          this.facturacion.perfiles = data.perfil;
          if (this.facturacion.perfiles === data.perfil) {
            this.configuracionPanelServicios();
            this.guardarSeleccionadosPrimerGrid();
          }
        } else {
          this.toastr.error('Ha habido un error', 'Error');
        }
      });
    }
  }
  // METODO PARA OCULTAR EL PRIMER GRID Y MOSTRAR EL GRID DE SERVICIOS
  configuracionPanelServicios() {
    this.router.navigateByUrl('facturar/servicios');
  }
  // METODO PARA TRAERSE TODOS LOS PERFILES DEL USUARIO
  getPerfiles() {
    this.facturacion.getPerfilesUsuario(this.pantalla).then((data: any) => {
      if (data.ok) {
        this.facturacion.perfiles = data.perfiles;
      } else {
        this.toastr.error('Ha habido un error', 'Error');
      }
    });
  }
  // METODO PARA CREAR UN PERFIL
  crearPerfil() {
    const result = this.validationGroup.instance.validate();
    if (result.isValid) {
      const configuracion = sessionStorage.getItem('configuracion');
      let datos: PerfilGrid = new PerfilGrid();
      datos.usuario = parseInt(sessionStorage.getItem('oid'));
      datos.nombre = this.nombrePerfil;
      datos.configuracion = configuracion;
      datos.pantalla = 'solicitudesFacturacion';
      this.facturacion.crearPerfil(datos).then((data: any) => {
        if (data.ok) {
          this.seleccionado = data.perfil.oid;
          this.toastr.success(data.msg, 'Correcto');
          this.facturacion.getPerfilesUsuario(this.pantalla).then((data1: any) => {
          this.facturacion.perfiles = data1.perfiles;
          this.facturacion.popUpPerfil = false;
          }); 
        }
      }, error => {
        this.toastr.error('Ha habido algun error', 'Error');
      });
    }
  }
  // METODO PARA MODIFICAR UN PERFIL
  modificarPerfil() {
    const result = this.validationGroup1.instance.validate();
    if (result.isValid) {
      const configuracion = sessionStorage.getItem('configuracion');
      let datos: PerfilGridMod = new PerfilGridMod();
      datos.usuario = parseInt(sessionStorage.getItem('oid'));
      datos.nombre = this.nombrePerfil;
      datos.configuracion = configuracion;
      datos.oid = this.seleccionado;
      this.facturacion.modificarPerfil(datos, this.seleccionado).then((data: any) => {
        if (data.ok) {
          this.getPerfiles();
          this.toastr.success(data.msg, 'Correcto');
          this.facturacion.popUpPerfilMod = false;
        } else {
          this.toastr.error(data.msg, 'Error');
        }
      }, error => {
        this.toastr.error('Ha habido algun error', 'Error');
      });
    }
  }
  deletePerfil() {
    this.perfil.deletePerfil(this.idPerfilEliminar).then((data: any) => {
      if (data.ok) {
        this.getPerfiles();
        this.grid.instance.state();
        this.grid.instance.refresh();
        this.toastr.success(data.msg, 'Correcto');
        this.facturacion.popUpPerfilDelete = false;
      } else {
        this.toastr.error(data.msg, 'Error');
      }
    }, error => {
      this.toastr.error('Ha habido algun error', 'Error');
    });
  }
  // METODO DEL SELECT PARA CAMBIAR DE PERFIL
   cambiarPerfil(parametro) {
    this.metodoCambiarPerfil(parametro);
  } 
  // ESTE METODO ES EL QUE SE ENCARGA DE CAMBIAR EL PERFIL, LO LLAMAMOS DESDE EL METODO DE ARRIBA
   metodoCambiarPerfil(parametro) {
     
      this.facturacion.getPerfil(this.seleccionado, this.pantalla, parametro).then((data: any) => {
        if (data.ok) {
          if (parametro ==='SI') this.tienePerfil = true;
          console.log(data.perfil.configuracion);
          const perfil = JSON.parse(data.perfil.configuracion);
          
          
          sessionStorage.setItem('configuracion', JSON.stringify(perfil));
          this.refrescar(perfil);
          this.facturacion.verListaPerfiles = false;
        }
      });
  } 

  quitarPerfilPredeterminado() {
    this.facturacion.quitarPerfil(this.seleccionado,this.pantalla).then((data: any) => {
      if (data.ok) {
        this.tienePerfil = false;
        this.toastr.success('Se ha quitado el perfil predeterminado con exito');
        this.seleccionado = null;
        this.facturacion.verListaPerfiles = false;
        const config = JSON.parse(this.perfilHtml);
        sessionStorage.setItem('configuracion',JSON.stringify(this.perfilHtml));
        this.grid.instance.state(config);
      }
    });
  }
  // METODO PARA HABILITAR O DESHABILITAR EL BOTON DE FACTURAR
  devolverHabilitarBoton() {
    if (this.facturacion.oidsArray.length > 0 && this.editado === false) {
      return false;
    } else {
      return true;
    }
  }
  // METODO QUE PINTA EL GRID CON LA INFORMACION DEL PERFIL CORRESPONDIENTE
  async refrescar(parametro?) {
    
    this.facturacion.loading = true;
    this.grid.instance.state(parametro);
    setTimeout(() => {
     this.facturacion.loading = false;
    }, 100);
  }
  // OBTENER DE LA BASE DE DATOS EL PERFIL QUE SE HA SELECCIONADO
  getPerfilSeleccionado() {
    this.facturacion.getPerfilSeleccionado(this.pantalla).then((data: any) => {
        if (data.ok) {
          this.seleccionado = data.perfil.oid;
          this.tienePerfil = true;
          this.grid.instance.state(JSON.parse(data.perfil.configuracion));
        }
    });
  }
  // METODOS DE SESSION STORAGE
  customLoad() {
    const value = sessionStorage.getItem('configuracion');
    return value ? JSON.parse(value) : {};
  }
  customSave(gridState) {
    const value = JSON.stringify(gridState);
    sessionStorage.setItem('configuracion', value);
  }
  // metodo para grabar las prefacturas
  prefacturar() {
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
        this.facturacion.mandarAPrefacturar(this.listaPrefacturas).then(async(resp: any) => {
          this.facturacion.loading = true;
          if (resp.ok) {
            this.solicitudesPrefactura = await resp.body.resumen[0];
            console.log(this.solicitudesPrefactura);
            
            this.mostrarPopUp1 = true; 
            
            this.toastr.success('Solicitudes mandadas a prefacturas correctamente', 'Correcto');
            this.getCountTipoFacturacion();
            this.seleccionBotones(this.facturacion.modoBusqueda);

          } else {
            if (resp.body.length === 0) {
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
  }
  facturar() {
    this.facturacion.pantallaModulo = 'solicitudes';
    this.facturacion.oidsArrayx = this.facturacion.oidsArray;
    this.router.navigateByUrl('facturar/resumen');
  }
  irPaginaFiltros(parametro?) {
    this.parametroFiltroTipo = 'busqueda';
    this.facturacion.modoBusqueda = 'busqueda';
  if (!parametro) {
    this.facturacion.solicitudes= [];
    this.metodoFiltros();
    this.codigosVisibles = true;
  } else {
    
  this.mostrarFiltro = true;
  this.facturacion.gridSolicitudesBol = true;
  this.facturacion.gridFacturas = false;
  this.facturacion.gridPrefacturas = false;
  }
  }
  metodoFiltros() {
  this.mostrarFiltro = !this.mostrarFiltro;
  this.facturacion.gridSolicitudesBol = true;
  this.facturacion.gridFacturas = false;
  this.facturacion.gridPrefacturas = false;
  
  if (this.mostrarFiltro) {
    this.facturacion.tituloPagina = 'Filtros';

    setTimeout(() => {
      this.accordion.expand('panel');    
    }, 500);
  
  } else {
    
      this.accordion.collapse('panel');    
  }

  }
  irFacturas() {
    this.router.navigateByUrl('facturar/facturas');
  }
  recogerSeleccionadas(recogerSeleccionadas: number) {
    this.preFacturasSel = recogerSeleccionadas;
  }
  recogerLongitud(longitud: number) {
    this.longitudPre = longitud;
  }
  cambioSeleccion1(event) {
    this.childOne.probandoVainas(this.seleccion);
  }
  asociarProyectos() {
    this.facturacion.asociarProyectos(this.facturacion.oidsArray).then((data: any)=> {
      if (data.ok) {
        this.toastr.success(`Se han asociado correctamente ${data.numero} solicitudes`);
        this.getCountTipoFacturacion();
        this.solicitudesSeleccionadas.forEach((key) => {
            this.dataSources.remove(key);
        });
      }
    });
  }

  //// apartado filtros
  obtenerServicios() {
    this.facturacion.getServicios().then((data: any) => {
      this.lookupDataServicios = {
        paginate: true,
        pageSize: 20,
        store: data.servicios
      };
    });

  }

  async buscar() {
    this.facturacion.loading = true;
    let cadenaConsulta = '';
    if (this.facturacion.objetoFiltro.fechasbool) {
      this.facturacion.objetoFiltro.fechainicio = this.datePipe.transform(this.facturacion.fechaInicioFiltro, 'yyyy-MM-dd');
      this.facturacion.objetoFiltro.fechafin = this.datePipe.transform(this.facturacion.fechaFinFiltro, 'yyyy-MM-dd');
      cadenaConsulta+= `and fecha_entrada between '${this.facturacion.objetoFiltro.fechainicio}' and
      cast('${this.facturacion.objetoFiltro.fechafin}' as date) + INTERVAL '1 day' `;
    }
    
    let cadenaCliente = '';
    let cadenaClienteFacturar = '';
    let cadenaServicios = '';
    
    if (this.facturacion.objetoFiltro.cliente) {
      if (this.facturacion.objetoFiltro.cliente.length > 0) {
        for (const oid of this.facturacion.objetoFiltro.cliente) {
          cadenaCliente += "," + oid;
        }
        cadenaCliente = cadenaCliente.substring(1);
        cadenaConsulta += `and cliente_oid in(${cadenaCliente}) `;
      } else {
        cadenaConsulta += '';
      }
    }
    if (this.facturacion.objetoFiltro.cliente_facturar) {
      if (this.facturacion.objetoFiltro.cliente_facturar.length > 0) {
        for (const oid of this.facturacion.objetoFiltro.cliente_facturar) {
          cadenaClienteFacturar += "," + oid;
        }
        cadenaClienteFacturar = cadenaClienteFacturar.substring(1);
        cadenaConsulta += `and factura_a in(${cadenaClienteFacturar}) `;
      } else {
        cadenaConsulta += '';
      }
     
    }

    if (this.facturacion.objetoFiltro.servicios) {
      if (this.facturacion.objetoFiltro.servicios.length > 0) {
        for (const oid of this.facturacion.objetoFiltro.servicios) {
          cadenaServicios += "," + oid;
        }
        cadenaServicios = cadenaServicios.substring(1);
        cadenaConsulta += `and vsf.oid in(select distinct spm.solicitud from servicios_por_muestra spm
            where spm.servicio in (${cadenaServicios})) `;
      } else {
        cadenaConsulta += '';
      }
      
    }
    if (this.facturacion.objetoFiltro.pedido_cabecera) {

      cadenaConsulta += `and vsf.oid in (select spm.solicitud from servicios_por_muestra spm
       inner join prefactura_cabeceras pc on spm.prefactura= pc.oid
       where upper(pc.pedido) = upper('${this.facturacion.objetoFiltro.pedido_cabecera.trim()}') group by spm.solicitud) `;

    }
    if (this.facturacion.objetoFiltro.solicitud) {
      if (this.facturacion.objetoFiltro.solicitud.includes('..')) {
        this.splitearPorRangos(this.facturacion.objetoFiltro.solicitud);
        cadenaConsulta += this.splitearPorRangos(this.facturacion.objetoFiltro.solicitud.trim());
      } else {
        
        const solicitud = this.facturacion.objetoFiltro.solicitud.split(';');
        const oids = [];
        for (const oid of solicitud) {
          oids.push(oid);
        }
        cadenaConsulta += this.splitearPorComas(oids);
      } 

    }
    if (this.facturacion.objetoFiltro.referencia_cliente) {
      cadenaConsulta += `and upper(referencia_cliente)=upper('${this.facturacion.objetoFiltro.referencia_cliente.trim()}') `;
    }
    if (this.facturacion.objetoFiltro.abono) {
      cadenaConsulta += `and abono = (select oid from abono_cabeceras where upper(codigo)=upper('${this.facturacion.objetoFiltro.abono}')) `;
    }
    if (this.facturacion.objetoFiltro.factura) {
      cadenaConsulta += `and prefactura =(select oid from prefactura_cabeceras where upper(numero_factura)=upper('${this.facturacion.objetoFiltro.factura}')) `;
    }


    
      const jsonData1 = '{"consulta":' + JSON.stringify(cadenaConsulta) + '}';
      
      await this.facturacion.filtrarSolicitudes(jsonData1).then(async(data: any)=> {
        if (data.ok) {
          this.facturacion.solicitudes= await data.solicitudes;
          this.facturacion.loading = false;
        //  this.accordion.collapse('panel');
        //  this.facturacion.objetoFiltro = new filtrosFacturacion();
        }
      }, error => {
        this.facturacion.loading = false;
      }); 
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
        solicitud[1] += '9';
      }
    }
    return `and codigo >= '${solicitud[0]}' and codigo <= '${solicitud[1]}' `;
  }

  splitearPorComas(parametro) {
    let cadena = '';
    for (const oid of parametro) {
      cadena += `,'${oid}'`;
  }
  cadena = cadena.substring(1);
  return `and codigo in(${cadena})`;
  

  }
}
