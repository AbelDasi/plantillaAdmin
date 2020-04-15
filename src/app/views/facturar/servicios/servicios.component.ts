import { Component, OnInit, ViewChild, HostListener, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PerfilGridMod, NuevaFila } from '../../../shared/dtos/datosUsuarios';
import { confirm } from 'devextreme/ui/dialog';
import { DxDataGridComponent, DxValidationGroupComponent } from 'devextreme-angular';
import { PerfilGrid } from '../../../shared/dtos/datosUsuarios';
import ArrayStore from 'devextreme/data/array_store';
import { FacturacionService } from '../facturacion.service';
import { Router } from '@angular/router';
let columnIndex: number;
let rowIndex: number;

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.scss']
})
export class ServiciosComponent implements OnInit {
  @ViewChild('grid1', { static: false }) grid1: DxDataGridComponent;
  @ViewChild('val1', { static: false }) validationGroup: DxValidationGroupComponent;
  @ViewChild('val2', { static: false }) validationGroup1: DxValidationGroupComponent;
  @ViewChild(DxDataGridComponent, { static: false }) grid: DxDataGridComponent;
  @ViewChild('celdaSolicitudes', { static: false }) celdaSolicitudes: any;
  @Input() public navegacion: string;
  @Input() public altura: string;
  lookupData: any;
  dataSource: ArrayStore;
  seleccionado: number;
  columIndex1: any;
  selectedItemKeys: any[] = [];
  posiciones: any[] = [];
  clientes: any[] = [];
  serviciosNuevos: any[] = [];
  nombrePerfil: string;
  public loading: boolean;
  editCellNoSelect: boolean;
  paginacionGrid: boolean;
  cambiaEstado: boolean;
  btnFacturacion: boolean;
  seleccionGridBool: boolean;
  editado: boolean;
  detectarEventoChange: string;
  filasEditadas: any[] = [];
  mensajeCarga: string;
  perfiles: any[] = [];
  tiposFacturacion: any[] = [];
  objetoFila: NuevaFila;
  alturaPantalla: number;
  alturaReferenciaNumber: number;
  alturaReferencia: string;
  textoSeleccion: string;
  seleccionGrid: string;
  accion: string;
  codigosSolicitud: any[] = [];
  pantalla: string = 'serviciosFacturacion';
  constructor(public facturacion: FacturacionService,
    private toastr: ToastrService, private router: Router) {
    //  this.atras();
     }
  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    if (this.facturacion.pantallaModulo === 'solicitudes') {
      this.alturaReferencia = '400 px';
    } else {
      this.alturaPantalla = window.innerHeight;
      const divPagina = document.getElementById('card-service');
      const diferenciaAltura = this.alturaPantalla - divPagina.offsetHeight;
      const sumaAltura = diferenciaAltura + this.celdaSolicitudes.nativeElement.offsetHeight - 80;
      this.alturaReferenciaNumber = sumaAltura;
      this.alturaReferencia = sumaAltura + 'px';
    }
  }
  @HostListener('window:beforeunload')
  atras() {
  this.volver();
  }
  ngOnInit() {
    if (this.facturacion.oidsArrayx.length < 1) {
      this.router.navigateByUrl('facturar/solicitudes');
      return;
    }
    this.obtenerCodigosSolicitud();
    this.alturaReferencia = '500px';
    this.btnFacturacion = true;
    this.mensajeCarga = 'Cargando';
    this.seleccionGrid = 'page';
    this.tiposFacturacion = [{ oid: 0, nombre: 'Sin Factura' }, { oid: 1, nombre: 'Factura Inmediata' }, { oid: 2, nombre: 'Factura Mensual' }];
    this.configuracionPanelServicios();
  }
  obtenerCodigosSolicitud() {
    this.facturacion.getCodigosSolicitud(this.facturacion.oidsArrayx).then(resp => {
      if (resp.ok) {
        this.codigosSolicitud = resp.solicitudes;
      }
    });
  }
  // tslint:disable-next-line:use-lifecycle-interface
  ngAfterViewInit() {
    if (this.facturacion.oidsArrayx.length < 1) {
      return;
    }
    //  console.log('buenas que tal');
    setTimeout(() => {
      this.onResize();
    }, 800);
  }
  compare(a, b) {
    if (a.nombre < b.nombre) {
      return -1;
    }
    if (a.nombre > b.nombre) {
      return 1;
    }
    return 0;
  }
  
  cambioSeleccion() {
    if (this.seleccionGridBool) {
      this.textoSeleccion = 'Borrar selección';
      this.seleccionGrid = 'allPages';
      setTimeout(() => {
        this.grid1.instance.selectAll();
      }, 500);
    } else {
      this.textoSeleccion = 'Seleccionar todos';
      this.seleccionGrid = 'page';
      this.grid1.instance.clearSelection();
    }
  }
  configuracionPanelServicios() {
    this.loading = true;
    this.detectarEventoChange = '';
    this.paginacionGrid = true;
    columnIndex = null;
    this.facturacion.getDetallesSolicitud(this.facturacion.oidsArrayx).then(data => {
      this.facturacion.listaDetalles = data.solicitud;
      if (this.facturacion.listaDetalles === data.solicitud) {
        this.dataSource = new ArrayStore({
          data: this.facturacion.listaDetalles
        });
        this.loading = false;
      }
      this.filtroClientes();
      this.getPerfiles();
      this.cambiaEstado = true;
    });
  }
  filtroClientes() {
    this.lookupData = {
      paginate: true,
      pageSize: 20,
      store: this.facturacion.clientes
    };
  }
  onInitialized(e) {
    setTimeout(() => {
      this.getPerfilSeleccionado();
      e.component.option('stateStoring', { ignoreColumnOptionNames: [] });
    }, 100);
  }
  ///// BLOQUE DE LA GESTION DE LOS PERFILES
   getPerfiles() {
    this.facturacion.getPerfilesUsuario('serviciosFacturacion').then((data: any) => {
      if (data.ok) {
        this.facturacion.perfiles = data.perfiles;
      } else {
        this.toastr.error('Ha habido un error', 'Error');
      }
    });
  } 
   crearPerfil() {
    const result = this.validationGroup.instance.validate();
    if (result.isValid) {
      const configuracion = sessionStorage.getItem('serviciosGrid');
      let datos: PerfilGrid = new PerfilGrid();
      datos.usuario = parseInt(sessionStorage.getItem('oid'));
      datos.nombre = this.nombrePerfil;
      datos.configuracion = configuracion;
      datos.pantalla = 'serviciosFacturacion';
      this.facturacion.crearPerfil(datos).then((data: any) => {
        if (data.ok) {
          this.seleccionado = data.perfil.oid;
          this.toastr.success(data.msg, 'Correcto');
          this.facturacion.getPerfilesUsuario(this.pantalla).then((data1: any) => {
            this.perfiles = data1.perfiles;
            this.facturacion.popUpPerfil = false;
          });
        }
      }, error => {
        this.toastr.error('Ha habido algun error', 'Error');
      });
    }
  }
  modificarPerfil() {
    const result = this.validationGroup1.instance.validate();
    if (result.isValid) {
      const configuracion = sessionStorage.getItem('serviciosGrid');
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
  cambiarPerfil() {

    this.metodoCambiarPerfil();
  }
  quitarPerfilPredeterminado() {
    this.facturacion.quitarPerfil(this.seleccionado,this.pantalla).then((data: any) => {
      if (data.ok) {
        this.toastr.success('Se ha quitado el perfil predeterminado con exito');
        this.seleccionado = null;
        this.facturacion.verListaPerfiles = false;
        const config = JSON.parse(`{"columns":
        [{"visibleIndex":0,"dataField":"solicitud","dataType":"string","visible":
        "false"},{"visibleIndex":1,"dataField":"servicio_nombre","dataType":"string",
        "visible":true},{"visibleIndex":2,"dataField":"servicio_descripcion","dataType":
        "string","visible":true},{"visibleIndex":3,"dataField":"observaciones","visible":true},
        {"visibleIndex":4,"dataField":"tipo_facturacion","dataType":"number","visible":true},
        {"visibleIndex":5,"dataField":"cliente","dataType":"number","width":200,"visible":true},
        {"visibleIndex":6,"dataField":"cantidad","dataType":"number","visible":true},{"visibleIndex":7,
        "dataField":"precio_unidad","dataType":"number","visible":true},{"visibleIndex":8,"dataField":"total",
        "dataType":"number","visible":true},{"visibleIndex":9,"dataField":"no_facturar","dataType":"boolean",
        "visible":true},{"visibleIndex":10,"dataField":"bool_facturacion","dataType":"boolean","visible":true},
        {"visibleIndex":11,"dataField":"tabla","dataType":"string","visible":true}],"allowedPageSizes":[50,100,200],
        "filterPanel":{"filterEnabled":true},"filterValue":null,"searchText":"","pageIndex":0,"pageSize":100}`);
        sessionStorage.setItem('configuracion',JSON.stringify(`{"columns":
        [{"visibleIndex":0,"dataField":"solicitud","dataType":"string","visible":
        "false"},{"visibleIndex":1,"dataField":"servicio_nombre","dataType":"string",
        "visible":true},{"visibleIndex":2,"dataField":"servicio_descripcion","dataType":
        "string","visible":true},{"visibleIndex":3,"dataField":"observaciones","visible":true},
        {"visibleIndex":4,"dataField":"tipo_facturacion","dataType":"number","visible":true},
        {"visibleIndex":5,"dataField":"cliente","dataType":"number","width":200,"visible":true},
        {"visibleIndex":6,"dataField":"cantidad","dataType":"number","visible":true},{"visibleIndex":7,
        "dataField":"precio_unidad","dataType":"number","visible":true},{"visibleIndex":8,"dataField":"total",
        "dataType":"number","visible":true},{"visibleIndex":9,"dataField":"no_facturar","dataType":"boolean",
        "visible":true},{"visibleIndex":10,"dataField":"bool_facturacion","dataType":"boolean","visible":true},
        {"visibleIndex":11,"dataField":"tabla","dataType":"string","visible":true}],"allowedPageSizes":[50,100,200],
        "filterPanel":{"filterEnabled":true},"filterValue":null,"searchText":"","pageIndex":0,"pageSize":100}`));
        this.grid.instance.state(config);
      }
    });
  }
  metodoCambiarPerfil() {
   
    this.facturacion.getPerfil(this.seleccionado, this.pantalla).then((data: any) => {
      if (data.ok) {

  
        const perfil = JSON.parse(data.perfil.configuracion);
        sessionStorage.setItem('serviciosGrid', JSON.stringify(perfil));
        this.refrescar(perfil);
        this.facturacion.verListaPerfiles = false;
      }
    });
  }
  async refrescar(parametro?) {
    this.facturacion.loading = true;
    await this.grid1.instance.state(parametro);
    setTimeout(() => {
     this.facturacion.loading = false;
    }, 100);
  }
  
  getPerfilSeleccionado() {
    this.facturacion.getPerfilSeleccionado(this.pantalla).then((data: any) => {
        if (data.ok) {
          this.seleccionado = data.perfil.oid;
          this.grid1.instance.state(JSON.parse(data.perfil.configuracion));
        }
    });
  }
  customLoad() {

    const value = sessionStorage.getItem('serviciosGrid');
    return value ? JSON.parse(value) : {};
  }
  customSave(gridState) {
    const value = JSON.stringify(gridState);
    sessionStorage.setItem('serviciosGrid', value);
  }
  // METODOS PARA VOLVER AL COMPONENTE PADRE
  volver() {
    if (this.detectarEventoChange === 'change') {
      confirm('No ha guardado los cambios que ha realizado, se perderan los datos', '¿Está seguro/a?').then(res => {
        if (res) {
          this.configuracionVolver();
        }
      });
    } else {
      this.configuracionVolver();
    }
  }
  configuracionVolver() {
    this.router.navigateByUrl('facturar/solicitudes');
  }

  // EVENTOS PARA AMBOS GRIDS
  onRowPrepared(event) {
    if (event.rowType === 'data') {
      if (event.key.bool_facturacion) {
        event.rowElement.style.background = 'white';
        event.rowElement.style.color = 'green';
        event.rowElement.style.fontWeight = 'bold';
      }
    }
  }
  onCellPrepared(event) {
    if (event.rowType === 'header') {
      event.cellElement.style.border = '0px';
      event.cellElement.style = 'color: white;font-weigth: bold;text-align: center;background-color:#0B86CA;border:1px solid white;';
    }
    if (event.rowType === 'data') {
      event.cellElement.style =`text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;font-size: 13px; text-align:center;`;
    
    }
  }
  customizeText(e) {
    return e.value.toLocaleString();
    
  }
  /////////////////////// EVENTOS PARA GRID DE SERVICIOS ////////////////////
  // DEVUELVE LAS FILAS EDITADAS
  setEditedValue(valueChangedEventArg, cellInfo) {
    this.detectarEventoChange = 'change';
    const valor = valueChangedEventArg.value;
    let valorSplit;
    let valorSplitNuevo;
    if (valor.includes('+++')) {
      valorSplit = valor.split('+++');
      valorSplitNuevo = valorSplit[0] + valorSplit[1];
      if (this.selectedItemKeys.length > 0) {
        this.loading = true;
        setTimeout(() => {
          this.selectedItemKeys.forEach((key, index) => {
            if (key.bool_facturacion === false) {
              cellInfo.component.cellValue(this.posiciones[index], columnIndex, key.servicio_descripcion + valorSplit[1]);
              if (index === this.selectedItemKeys.length - 1) {
                this.loading = false;
              }
            }
          });
          cellInfo.setValue(valorSplitNuevo);
        }, 200);
      } else {
        cellInfo.setValue(valorSplitNuevo);
      }
    } else {
      if (this.selectedItemKeys.length > 0) {
        this.loading = true;
        setTimeout(() => {
          this.selectedItemKeys.forEach((key, index) => {
            if (key.bool_facturacion === false) {
              cellInfo.component.cellValue(this.posiciones[index], columnIndex, valueChangedEventArg.value);
              if (index === this.selectedItemKeys.length - 1) {
                this.loading = false;
              }
            }
          });
        }, 200);
      } else {
        cellInfo.setValue(valueChangedEventArg.value);
      }
    }
  }
  onRowUpdated(event) {
    if (event.data.modifcar_servicio) {
      this.serviciosNuevos.push(event.data);
    } else {
      this.filasEditadas.push(event.data);
    }
  }
  // METODO PARA ACCEDER A LOS EVENTOS DE EDICION DEL GRID
  onEditorPreparing(event) {
    const grid = event.component;
    const esto = this;
    if (event.parentType === 'dataRow') {
      //   esto.loading = true;
      esto.editado = esto.grid1.instance.hasEditData();
      const oldOnValueChanged = event.editorOptions.onValueChanged;
      event.editorOptions.onKeyDown = function (e) {
        if (e.event.keyCode === 13) {
          oldOnValueChanged.apply(this, arguments);
          if (event.type !== 'selection') {
            if (esto.editCellNoSelect) {
              esto.detectarEventoChange = 'change';
            } else {
              
              esto.loading = true;
              esto.detectarEventoChange = 'change';
              columnIndex = esto.columIndex1;
              setTimeout(() => {
                esto.selectedItemKeys.forEach((key, index) => {
                  if (key.bool_facturacion === false) {
                    grid.cellValue(esto.posiciones[index], columnIndex, e.value);
                    if (index === esto.selectedItemKeys.length - 1) {
                      esto.loading = false;
                    }
                  }
                });
                //   esto.loading = false;
              }, 100);
            }
          }
        }
      };
      event.editorOptions.onValueChanged = function (e) {
        oldOnValueChanged.apply(this, arguments);
        if (event.type !== 'selection') {
          if (esto.editCellNoSelect) {
            esto.detectarEventoChange = 'change';
          } else {
            if (esto.selectedItemKeys.length < 1) {
              return;
            }
            esto.detectarEventoChange = 'change';
            esto.loading = true;
            if (event.dataField === 'tipo_facturacion' || event.dataField === 'cliente') {
              columnIndex = esto.columIndex1;
            }
            setTimeout(() => {
              esto.selectedItemKeys.forEach((key, index) => {
                if (key.bool_facturacion === false) {
                  esto.loading = true;
                  grid.cellValue(esto.posiciones[index], columnIndex, e.value);
                  if (index === esto.selectedItemKeys.length - 1) {
                    esto.loading = false;
                  }
                }
              });
            }, 300);
          }
        }
      };
    }
  }
  /// EVENTO PARA CONTROLAR QUE FILAS SE PUEDEN EDITAR Y CUALES NO
  onEditingStart(event) {
    if (event.data.bool_facturacion === true) {
      event.cancel = true;
    } /*  else if (event.data.tabla === 'nueva') {
      event.component.columnOption('cantidad', 'allowEditing', true);

    } */  else if (event.data.tabla !== 'nueva') {
      event.component.columnOption('cantidad', 'allowEditing', false);
    }
  }

  // METODO PARA SETEAR EL MENSAJE QUE SALE EN EL LOADING CUANDO ESTAS EDITANDO ALGO, DE MOMENTO NO SE USA PORQUE NO SETEA BIEN AL ESTAR DENTRO DE UN FOR
  mensajeCargar(position, length) {
    return this.mensajeCarga = 'Modificados ' + position + ' registros de ' + length;
  }
  // METODO QUE SE ACTIVA CUANDO PULSAS SOBRE UNA CELDA DEL GRID
  onCellClick(e) {
    //  this.obtenerColumnas();
    
    if (e.rowType === 'data') {
      columnIndex = e.columnIndex;
      if (e.column.type === 'selection') {
        this.editCellNoSelect = false;
        if (e.row.isSelected) {
          rowIndex = e.rowIndex;
        }
      } else {
        if (!e.row.isSelected) {
          this.editCellNoSelect = true;
          rowIndex = e.rowIndex;
        } else {
          this.editCellNoSelect = false;
        }
      }
      if (e.row.data.posicion === 'nuevaGrid') {
        e.component.columnOption('servicio_nombre', 'allowEditing', true);
      } else {
        e.component.columnOption('servicio_nombre', 'allowEditing', false);
      }
    }
    // console.log('column Index', columnIndex);
  }
  // METODO QUE ACCEDE A LOS FILTROS
  onOptionChanged(event) {
    if (event.name === 'columns') {
      this.grid1.instance.clearSelection();
    }
    if (event.name === 'paging') {
      //  this.grid1.instance.clearSelection();
    }
    if (event.name === 'selectedRowKeys') {
      //  console.log('evento', event);
      this.selectedItemKeys = event.value;
    }
    if (event.name === 'focusedColumnIndex') {
      columnIndex = event.previousValue;
      this.columIndex1 = event.value;
      event.component.columnOption('servicio_nombre', 'allowEditing', false);
    }
  }
  // METODO QUE ACCEDE A LOS ITEMS SELECCIONADOS DEL DATA GRID
  onSelectionChanged1(data: any) {
    this.selectedItemKeys = [];
    this.posiciones = [];
    this.editCellNoSelect = false;
    let array2 = data.selectedRowsData.slice();
    const array = this.grid1.instance.getDataSource();
    array2.forEach((key) => {
    this.selectedItemKeys.push(key);
    if (array.loadOptions().group !== null) {
      this.posiciones.push(this.grid1.instance.getRowIndexByKey(key));
    } else {
      this.posiciones.push(this.grid1.instance.getDataSource().items().indexOf(key));
      const posicion = this.grid1.instance.getDataSource().items().indexOf(key);
    }
    });
    if (this.selectedItemKeys.length > 0 && this.editado === false) {
      this.btnFacturacion = false;
    } else {
      this.btnFacturacion = true;
    }
  }
  // METODO QUE ACCEDE A LOS BOTONES DEL TOOLBAR DEL DATA GRID
  onToolbarPreparing(event) {
    const esto = this;
    // esto.getPerfiles();
    const toolbarItems = event.toolbarOptions.items;
    event.toolbarOptions.items.unshift(
      
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
      }, 
      
      {
        location: 'after',
        name: 'deleteFilas',
        widget: 'dxButton',
        options: {
          icon: 'trash',
          hint: 'Eliminar filas ',
          elementAttr: { id: 'deleteFilas' },
          onClick: function () {
            esto.eliminarFilas();
          }
        },
      }
    );
    for (const item of toolbarItems) {
      if (item.name === 'saveButton') {
        item.options.type = 'success';
        item.options.width = 100;
        //  item.options.background = '#DE3916';
        item.options.onClick = function (e) {
          confirm('¿Confirma que quiere guardar los cambios efectuados?', 'Guardar cambios').then(res => {
            if (res === true) {
              esto.filasEditadas = [];
              esto.serviciosNuevos = [];
              esto.grid1.instance.saveEditData().then(() => {
                esto.facturacion.loading = true;
                esto.mensajeCarga = 'Cargando';
                esto.facturacion.modificarServicios(esto.filasEditadas).then(data => {
                  const ok = data.ok;
                  if (ok === data.ok) {
                    if (data.ok) {
                      esto.facturacion.loading = false;
                      esto.toastr.success('Se han modificado ' + data.numero + ' registros', 'Correcto');
                      esto.facturacion.getDetallesSolicitud(esto.facturacion.oidsArrayx).then(data5 => {
                        esto.facturacion.listaDetalles = data5.solicitud;
                        if (esto.facturacion.listaDetalles === data5.solicitud) {
                          esto.dataSource = new ArrayStore({
                            data: esto.facturacion.listaDetalles
                          });
                        }
                      });
                    } else {
                      esto.toastr.error('Ha habido un error', 'Error');
                      esto.facturacion.loading = false;
                    }
                  }
                  esto.detectarEventoChange = '';
                }, error => {
                  esto.toastr.error('Ha habido un error', 'Error');
                  esto.facturacion.loading = false;
                  esto.editado = false;
                });
              });
            }
          });
        };
      }
      if (item.name === 'revertButton') {
        item.options.onClick = function (e) {
          confirm('Los datos seran todos restaurados', '¿Está seguro/a?').then(res => {
            if (res === true) {
              esto.grid1.instance.cancelEditData();
              esto.detectarEventoChange = '';
            }
          });
        };
      }
      if (item.name === 'addRowButton') {
        item.options.elementAttr = { id: 'papi' };
        item.options.onClick = function (e) {
          esto.nuevoConcepto();
        };
      }
    }
  }
  nuevoConcepto() {
    this.facturacion.nuevoServicio = false;
    this.accion = 'servicio';
    const objetos = this.grid1.instance.getDataSource().items();
    const objetoCopia = objetos[0];
    this.objetoFila = new NuevaFila('', '', objetoCopia.tipo_facturacion);
    this.facturacion.popUpFilaNueva = true;
  }

  // FUNCION PARA ELIMINAR UN ELEMNTO DE UN ARRAY
  removeItemFromArr(arr, item) {
    return arr.filter(function (e) {
      return e !== item;
    });
  }
  // EVENTO QUE CALCULA EL TOTAL
  calculateCellValue(data) {
    data.total = data.cantidad * data.precio_unidad;
    return data.total;
  }
  // EVENTO PARA ELIMINAR FILAS SI HAS METIDO ALGUNA FILA DE MAS PARA AÑADIR SERVICIOS
  eliminarFilas() {
    confirm('Solo puede eliminar filas que ha insertado previamente en el grid, el resto no se eliminaran', '¿Está seguro/a?').then(res => {
      if (res) {
        const oids = [];
        this.selectedItemKeys.forEach((key) => {
          if (key.tabla === 'nueva' && key.bool_facturacion === false) {
            this.dataSource.remove(key);
            oids.push(key.oid);
          }
        });
        if (oids.length > 0) {
          this.facturacion.deleteServiciosNuevos(oids).then((data: any) => {
            if (data.ok) {
              this.toastr.success('Se han eliminado ' + data.numero + ' servicios', 'Correcto');
              this.facturacion.getDetallesSolicitud(this.facturacion.oidsArrayx).then(data => {
                this.facturacion.listaDetalles = data.solicitud;
              });
            } else {
              this.toastr.error('Ha habido un problema, intentelo más tarde', 'Error');
            }
          }, error => this.toastr.error('Ha habido un problema, intentelo más tarde', 'Error'));
          this.grid1.instance.refresh();
        } else {
          // tslint:disable-next-line:max-line-length
          this.toastr.error('Asegurese de que los servicios seleccionados no esten facturados y sean servicios creados desde este modulo', 'Error');
        }
      }
    });
  }
  

  devolverHabilitarBoton() {
    if (this.selectedItemKeys.length > 0 && this.editado === false) {
      return false;
    } else {
      return true;
    }
  }
}
