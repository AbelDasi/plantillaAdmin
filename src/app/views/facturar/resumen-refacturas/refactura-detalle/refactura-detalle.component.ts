import { Component, OnInit, ViewChild, Output, EventEmitter, Input, HostListener } from '@angular/core';
import { DxDataGridComponent, DxValidationGroupComponent } from 'devextreme-angular';
import ArrayStore from 'devextreme/data/array_store';
import { NuevaFila, PerfilGrid, PerfilGridMod } from 'src/app/shared/dtos/datosUsuarios';
import { FacturacionService } from '../../facturacion.service';
import { ToastrService } from 'ngx-toastr';
import { confirm } from 'devextreme/ui/dialog';
import { Router } from '@angular/router';
let columnIndex: number;
let rowIndex: number;

@Component({
  selector: 'app-refactura-detalle',
  templateUrl: './refactura-detalle.component.html',
  styleUrls: ['./refactura-detalle.component.scss']
})
export class RefacturaDetalleComponent implements OnInit {

  @ViewChild('grid1', { static: false }) grid1: DxDataGridComponent;
  @ViewChild('val1', { static: false }) validationGroup: DxValidationGroupComponent;
  @ViewChild('val2', { static: false }) validationGroup1: DxValidationGroupComponent;
  @ViewChild(DxDataGridComponent, { static: false }) grid: DxDataGridComponent;
  @ViewChild('celdaSolicitudes', { static: false }) celdaSolicitudes: any;
  // output
  @Output() eventoChanges: EventEmitter<String>;
  @Output() cambiarCabecera: EventEmitter<Object>;
  // input
  @Input() public detectarEventoChange: string;
  @Input() public oidRefactura: any;
  // array store de devextreme
  dataSourcex: ArrayStore;

  // any
  columIndex1: any;
  selectedItemKeys: any[] = [];
  posiciones: any[] = [];
  clientes: any[] = [];
  serviciosNuevos: any[] = [];
  filasEditadas: any[] = [];
  perfiles: any[] = [];
  tiposFacturacion: any[] = [];
  oidsSolicitudes: any[] = [];
  codigosSolicitud: any[] = [];
  // boolean
  public loading: boolean;
  editCellNoSelect: boolean;
  paginacionGrid: boolean;
  cambiaEstado: boolean;
  btnFacturacion: boolean;
  seleccionGridBool: boolean;
  editado: boolean;
  // string y nuevafila
  objetoFila: NuevaFila;
  textoSeleccion: string;
  seleccionGrid: string;
  alturaReferencia: string;
  accion: string;
  mensajeCarga: string;
  nombrePerfil: string;
  // number
  seleccionado: number;
  alturaPantalla: number;
  alturaReferenciaNumber: number;
  pantalla: string = 'serviciosFacturasAbonos';

  constructor(public facturacion: FacturacionService,
    private toastr: ToastrService, private router: Router
  ) {
    this.cambiarCabecera = new EventEmitter();
    this.eventoChanges = new EventEmitter();
  }
  @HostListener('window:resize', ['$event'])
  onResize(event?) {

    this.alturaPantalla = window.innerHeight;
    const divPagina = document.getElementById('card-service');
    const diferenciaAltura = this.alturaPantalla - divPagina.offsetHeight;
    const sumaAltura = diferenciaAltura + this.celdaSolicitudes.nativeElement.offsetHeight - 300;
    this.alturaReferenciaNumber = sumaAltura;
    this.alturaReferencia = sumaAltura + 'px';

  }
  ngOnInit() {
    //  this.obtenerCodigosSolicitud();
    this.alturaReferencia = '500px';
    this.btnFacturacion = true;
    this.mensajeCarga = 'Cargando';
    this.seleccionGrid = 'page';
    this.tiposFacturacion = [{ oid: 0, nombre: 'Sin Factura' }, { oid: 1, nombre: 'Factura Inmediata' }, { oid: 2, nombre: 'Factura Mensual' }];
    this.configuracionPanelServicios();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.onResize();
    }, 800);
  }

  deteccionEvento() {
    this.eventoChanges.emit(this.detectarEventoChange);
  }
  obtenerCodigosSolicitud(oidsSolicitud) {
    this.facturacion.getCodigosSolicitud(oidsSolicitud).then(resp => {
      if (resp.ok) {
        this.codigosSolicitud = resp.solicitudes;
      }
    });
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
    //  this.loading = true;
    this.detectarEventoChange = '';
    this.paginacionGrid = true;
    columnIndex = null;
    this.dataSourcex = new ArrayStore({
      data: this.facturacion.listaDetalles
    });
    setTimeout(() => {
      this.conseguirOidSolicitudes(this.facturacion.listaDetalles);
    }, 500);


    this.loading = false;
    this.cambiaEstado = true;
        this.getPerfiles();
        this.getPerfilSeleccionado(); 
  }
  conseguirOidSolicitudes(servicios) {
    this.oidsSolicitudes = [];
    for (const oid of servicios) {

      const oidEncontrado = this.oidsSolicitudes.find(key => key === oid.oid_solicitud);
      if (!oidEncontrado) {
        if (oid.solicitud !== '') {
          this.oidsSolicitudes.push(oid.oid_solicitud);
        }
      }
    }
    this.obtenerCodigosSolicitud(this.oidsSolicitudes);
    return this.oidsSolicitudes.length;
  }

  onInitialized(e) {
    setTimeout(() => {
      e.component.option('stateStoring', { ignoreColumnOptionNames: [] });
    }, 100);
  }
  ///// BLOQUE DE LA GESTION DE LOS PERFILES
  getPerfiles() {
    this.facturacion.getPerfilesUsuario(this.pantalla).then((data: any) => {
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
      const configuracion = sessionStorage.getItem('serviciosFacGrid');
      let datos: PerfilGrid = new PerfilGrid();
      datos.usuario = parseInt(sessionStorage.getItem('oid'));
      datos.nombre = this.nombrePerfil;
      datos.configuracion = configuracion;
      datos.pantalla = 'serviciosFacturasAbonos';
      this.facturacion.crearPerfil(datos).then((data: any) => {
        if (data.ok) {
          this.seleccionado = data.perfil.oid;
          this.toastr.success(data.msg, 'Correcto');
          this.facturacion.getPerfilesUsuario(this.pantalla).then((data1: any) => {
            this.perfiles = data1.perfil;
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
      const configuracion = sessionStorage.getItem('serviciosFacGrid');
      // tslint:disable-next-line:prefer-const
      let datos: PerfilGridMod = new PerfilGridMod();
      // tslint:disable-next-line:radix
      datos.usuario = parseInt(sessionStorage.getItem('oid'));
      datos.nombre = this.nombrePerfil;
      datos.configuracion = configuracion;
      datos.oid = this.seleccionado;
      this.facturacion.modificarPerfil(datos, this.seleccionado).then((data: any) => {
        if (data.ok) {
          this.getPerfiles();
          this.grid1.instance.state();
          this.grid1.instance.refresh();
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
    metodoCambiarPerfil() {
      this.facturacion.getPerfil(this.seleccionado, this.pantalla).then((data: any) => {
        if (data.ok) {
          const perfil = JSON.parse(data.perfil.configuracion);
          sessionStorage.setItem('serviciosFacGrid', JSON.stringify(perfil));
          this.refrescar(perfil);
          this.facturacion.verListaPerfiles = false;
        }
      });
    }
    quitarPerfilPredeterminado() {
      this.facturacion.quitarPerfil(this.seleccionado,this.pantalla).then((data: any) => {
        if (data.ok) {
          this.toastr.success('Se ha quitado el perfil predeterminado con exito');
          this.seleccionado = null;
          this.facturacion.verListaPerfiles = false;
          const config = JSON.parse(`{"columns":[{"visibleIndex":0,"dataField":"tabla",
          "dataType":"string","visible":true},{"visibleIndex":1,"dataField":"codigo",
          "dataType":"string","visible":"false"},{"visibleIndex":2,"dataField":"servicio_nombre",
          "dataType":"string","visible":true},{"visibleIndex":3,"dataField":"servicio_descripcion",
          "dataType":"string","visible":true},{"visibleIndex":4,"dataField":"observaciones","dataType":"string",
          "visible":true},{"visibleIndex":5,"dataField":"cantidad","dataType":"number","visible":true},
          {"visibleIndex":6,"dataField":"precio_unidad","dataType":"number","visible":true},{"visibleIndex":7,
          "dataField":"total","dataType":"number","visible":true},{"visibleIndex":8,"dataField":"pedido",
          "dataType":"string","visible":true}],"allowedPageSizes":[50,100,200],"filterPanel":{"filterEnabled":true},
          "filterValue":null,"searchText":"","pageIndex":0,"pageSize":100}`);
          sessionStorage.setItem('serviciosFacGrid',JSON.stringify(`{"columns":[{"visibleIndex":0,"dataField":"tabla",
          "dataType":"string","visible":true},{"visibleIndex":1,"dataField":"codigo",
          "dataType":"string","visible":"false"},{"visibleIndex":2,"dataField":"servicio_nombre",
          "dataType":"string","visible":true},{"visibleIndex":3,"dataField":"servicio_descripcion",
          "dataType":"string","visible":true},{"visibleIndex":4,"dataField":"observaciones","dataType":"string",
          "visible":true},{"visibleIndex":5,"dataField":"cantidad","dataType":"number","visible":true},
          {"visibleIndex":6,"dataField":"precio_unidad","dataType":"number","visible":true},{"visibleIndex":7,
          "dataField":"total","dataType":"number","visible":true},{"visibleIndex":8,"dataField":"pedido",
          "dataType":"string","visible":true}],"allowedPageSizes":[50,100,200],"filterPanel":{"filterEnabled":true},
          "filterValue":null,"searchText":"","pageIndex":0,"pageSize":100}`));
          this.grid.instance.state(config);
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

    customLoad() {

      const value = sessionStorage.getItem('serviciosFacGrid');
      return value ? JSON.parse(value) : {};
    }
    customSave(gridState) {
      const value = JSON.stringify(gridState);
      sessionStorage.setItem('serviciosFacGrid', value);
    }

    getPerfilSeleccionado() {
      this.facturacion.getPerfilSeleccionado(this.pantalla).then((data: any) => {
          if (data.ok) {
            this.seleccionado = data.perfil.oid;
            this.grid1.instance.state(JSON.parse(data.perfil.configuracion));
          }
      });
    }
  // METODOS PARA VOLVER AL COMPONENTE PADRE


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
  }
  /////////////////////// EVENTOS PARA GRID DE SERVICIOS ////////////////////
  // DEVUELVE LAS FILAS EDITADAS
  setEditedValue(valueChangedEventArg, cellInfo) {
    this.detectarEventoChange = 'change';
    this.deteccionEvento();
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
              //  esto.loading = true;
              setTimeout(() => {
                esto.selectedItemKeys.forEach((key, index) => {
                  if (key.bool_facturacion === false) {
                    //    esto.loading = true;
                    grid.cellValue(esto.posiciones[index], columnIndex, e.value);
                    //  esto.mensajeCargar(index, esto.selectedItemKeys.length);
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
            esto.detectarEventoChange = 'change';
            esto.loading = true;
            if (event.dataField === 'tipo_facturacion' || event.dataField === 'cliente') {
              columnIndex = esto.columIndex1;
            }
            setTimeout(() => {
              esto.selectedItemKeys.forEach((key, index) => {
                // const posicion = esto.grid1.instance.getDataSource().items().indexOf(key);
                if (key.bool_facturacion === false) {
                  esto.loading = true;
                  grid.cellValue(esto.posiciones[index], columnIndex, e.value);
                  if (index === esto.selectedItemKeys.length - 1) {
                    esto.loading = false;
                  }
                  //  esto.mensajeCargar(index, esto.selectedItemKeys.length);
                }
              });
              //  esto.loading = false;
            }, 100);
          }
        }

      };
    }
    esto.deteccionEvento();
  }
  /// EVENTO PARA CONTROLAR QUE FILAS SE PUEDEN EDITAR Y CUALES NO
  onEditingStart(event) {
    if (event.data.bool_facturacion === true) {
      event.cancel = true;
    } else if (event.data.tabla === 'nueva') {
      event.component.columnOption('cantidad', 'allowEditing', true);

    } else if (event.data.tabla !== 'nueva') {
      event.component.columnOption('cantidad', 'allowEditing', false);
    }
  }
  // tslint:disable-next-line:max-line-length
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
    // tslint:disable-next-line:prefer-const
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

                      esto.facturacion.getDetalleRefactura(esto.oidRefactura).then((data5: any) => {
                        esto.facturacion.listaDetalles = data5.servicios;
                        esto.cambiarCabecera.emit(data5.cabecera);
                        esto.dataSourcex = new ArrayStore({
                          data: esto.facturacion.listaDetalles
                        });
                      });
                    } else {
                      esto.toastr.error('Ha habido un error', 'Error');
                      esto.facturacion.loading = false;
                    }
                  }
                  esto.detectarEventoChange = '';
                  esto.deteccionEvento();
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
              esto.deteccionEvento();
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
    if (objetoCopia) {
      this.objetoFila = new NuevaFila('', '', objetoCopia.tipo_facturacion);
    } else {
      this.objetoFila = new NuevaFila('', '', '');
    }

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
    confirm('Si estos servicios pertenecian a un abono previo solo seran borrados de la refactura', '¿Continuar?').then(res => {
      if (res) {

        const oids = [];

        this.selectedItemKeys.forEach((key) => {
          this.dataSourcex.remove(key);
          oids.push(key.oid);
        });
        if (oids.length > 0) {
          let objetoEliminarRefactura: any = {
            oids: oids,
            refactura: this.oidRefactura
          };

          this.facturacion.deleteServiciosRefactura(objetoEliminarRefactura).then((data: any) => {
            if (data.ok) {
              this.toastr.success('Se han eliminado ' + data.numero + ' servicios', 'Correcto');
              this.facturacion.getDetalleRefactura(this.oidRefactura).then((data: any) => {
                this.facturacion.listaDetalles = data.servicios;
              });
            } else {
              this.toastr.error('Ha habido un problema, intentelo más tarde', 'Error');
            }
          }, error => this.toastr.error('Ha habido un problema, intentelo más tarde', 'Error'));
          this.grid1.instance.refresh();
        } else {
          // tslint:disable-next-line:max-line-length
          this.toastr.error('Asegurese de que ha seleccionado algun tipo de servicio', 'Error');
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
