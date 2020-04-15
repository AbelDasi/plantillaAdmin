import { Component, OnInit, Input, ViewChild, Output, EventEmitter, HostListener } from '@angular/core';
// servicios
import { MetodosService } from 'src/app/shared/services/metodos.service';
import { confirm } from 'devextreme/ui/dialog';
import { ToastrService } from 'ngx-toastr';
import { FacturacionService } from '../facturacion.service';
import { DxDataGridComponent } from 'devextreme-angular';
import { trigger, style, animate, transition, state } from '@angular/animations';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PrefacturaDetalleComponent } from './prefactura-detalle/prefactura-detalle.component';
import { GuardarPreFactura, MandarFactura, ObjetoUnificar } from 'src/app/shared/models/factura';
import { DatePipe } from '@angular/common';
//import ArrayStore from 'devextreme/data/array_store';
//import { Factura } from 'src/app/shared/models/factura';


@Component({
  selector: 'app-resumen',
  templateUrl: './resumen.component.html',
  styleUrls: ['./resumen.component.scss'],
  animations: [
    trigger('fade', [
      state('show', style({
        display: 'initial'
      })),
      state('hide', style({
        display: 'none'
      })),
      transition('show => hide', animate('600ms ease-out')),
      transition('hide => show', animate('1000ms ease-in')),
    ])
  ]
})
export class ResumenComponent implements OnInit {
  // input
  @Input() public componente: string;
  // viewchild
  @ViewChild('grid1', { static: false }) grid1: DxDataGridComponent;
  @ViewChild('prefactura', { static: false }) prefactura: PrefacturaDetalleComponent;
  // objeto unificar
  Unificar: ObjetoUnificar = new ObjetoUnificar();
  // any
  objetoFactura: any;
  selectedItemKeys: any;
  oidsPrefactura: any[] = [];
  listaServicios: any[] = [];
  oidsSolicitudes: any[] = [];
  cabecerasDistintas: number;
  cabecera: any;
  dataSource: any;
  // string
  detectarEventoChange: string;
  navegacion: string;
  altura: string;
  // boolean
  vistaServicios: boolean = true;
  mostrarDiv: boolean;
  serviciosResumenBol: boolean;
  valido: boolean;
  verMenu = true;
  cambioFormulario: boolean = false;
  loading: boolean;
  seeDetails: boolean = false;
  // form
  formCabecera: FormGroup;
  // number
  longitudSolicitudes: number = 0;
  oidPrefactura: number;
  posicion = 0;
  fecha: Date = new Date();
  fechaAMandar = '';
  tipoFactura: string = '';

  lookupData: { paginate: boolean; pageSize: number; store: any[]; };
  popUpConfirmFactura: boolean;
  mostrarPopUpUnificar: boolean;
  constructor(public facturacion: FacturacionService, private metodos: MetodosService, private toastr: ToastrService, private _formBuilder: FormBuilder,
    private router: Router, private datePipe: DatePipe) {
    this.hashChangeHandler();
  }
  @HostListener('window:hashchange', ['$event'])
  hashChangeHandler(e?) {
    window.location.hash = "dontgoback";
  }
  ngOnInit() {

    if (this.facturacion.oidsPrefactura.length < 1) {
      return;
    }
    this.detectarEventoChange = '';
    this.crearFormulario();
    this.filtroClientes();
    this.comprobarUnificar();
    this.oidPrefactura = this.facturacion.oidsPrefactura[0];

    this.getPrefacturasDetalle();
  }
  getPrefacturasDetalle() {
    this.facturacion.getDetallePrefactura(this.oidPrefactura).then((data: any) => {

      this.facturacion.listaDetalles = data.servicios;
      this.cabecera = data.cabecera;
      this.valido = data.cabecera.valido;
      this.setearForm();
      this.seeDetails = true;
      setTimeout(() => {
        this.longitudSolicitudes = this.prefactura.conseguirOidSolicitudes(this.facturacion.listaDetalles);
      }, 500);
    });
  }

  crearFormulario() {
    this.formCabecera = this._formBuilder.group({
      FacturaDe: [{ value: '', disabled: true }],
      Solicitante: [{ value: '', disabled: true }],
      Pedido: ['', Validators.required],
      ClienteFacturar: ['', Validators.required],
      FechaRegistro: [{ value: '', disabled: true }],
      FechaVencimiento: [{ value: '', disabled: true }],
      CodPago: [{ value: '', disabled: true }],
      EmailEnvio: ['', Validators.required],
      NoCopia: [false, Validators.required],
      Nombre: [{ value: '', disabled: true }],
      Direccion: [{ value: '', disabled: true }],
      CodPostal: [{ value: '', disabled: true }],
      Poblacion: [{ value: '', disabled: true }],
      Provincia: [{ value: '', disabled: true }],
      Contacto: [{ value: '', disabled: true }]
    });
  }
  setearForm() {
    this.formCabecera.controls['Nombre'].setValue(this.cabecera.nombre);
    this.formCabecera.controls['Contacto'].setValue(this.cabecera.contacto);
    this.formCabecera.controls['Direccion'].setValue(this.cabecera.direccion);
    this.formCabecera.controls['CodPostal'].setValue(this.cabecera.cp);
    this.formCabecera.controls['Poblacion'].setValue(this.cabecera.poblacion);
    this.formCabecera.controls['EmailEnvio'].setValue(this.cabecera.email_envio);
    this.formCabecera.controls['Provincia'].setValue(this.cabecera.provincia);
    this.formCabecera.controls['Solicitante'].setValue(this.cabecera.cliente);
    this.formCabecera.controls['ClienteFacturar'].setValue(this.cabecera.cliente_facturar);
    this.formCabecera.controls['Pedido'].setValue(this.cabecera.pedido);
    this.formCabecera.controls['NoCopia'].setValue(this.cabecera.no_enviar);
    this.cambioFormulario = false;
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
   guardar() {
    const guardarPre: GuardarPreFactura = new GuardarPreFactura();
    guardarPre.oids = this.prefactura.oidsSolicitudes;
    guardarPre.factura_a = this.formCabecera.value.ClienteFacturar;
    guardarPre.oid_prefactura = this.oidPrefactura;
    guardarPre.email_envio = this.formCabecera.value.EmailEnvio;
    guardarPre.pedido = this.formCabecera.value.Pedido;
    guardarPre.no_enviar = this.formCabecera.value.NoCopia;
    confirm('¿Confirma que quiere guardar los cambios efectuados?', 'Guardar cambios').then(res => {
      if (res === true) {
        this.facturacion.guardarCabeceraPrefactura(guardarPre).then(async(data: any) => {
          if (data.ok) {
            if (this.detectarEventoChange === 'change') {
            this.prefactura.guardarDatosGrid();
            }
            this.toastr.success(data.mensaje, 'Correcto');
            this.getPrefacturasDetalle();
            this.cambioFormulario = false;
    
            this.facturacion.getPrefacturas().then((data: any) => {
              if (data.ok) {
                this.facturacion.validacionRequisitos.map(key => {
                  return { requisito: key.pedido_requerido, pedido: key.pedido }
                });
              }
            });
          } else {
            this.toastr.error('No se han podido realizar los cambios, contacte con su administrador web');
          }
        });
      }
    });
  }
  detectarCambioForm(event) {
    this.cambioFormulario = true;
  }
  ocultarMenu() {
    this.verMenu = !this.verMenu;
  }
  deteccionCambios(detectarEventoChange: string) {
    this.detectarEventoChange = detectarEventoChange;
  }
  deteccionCambiosCabecera(cabecera: Object) {
    this.cabecera = cabecera;

  }
  mostrarDetalleFactura(posicion) {
    this.objetoFactura = this.facturacion.oidsPrefactura[posicion];
  }

  // FUNCIONES PARA LOS BOTONES DEL MENU //
  siguiente(parametro) {
    if (this.detectarEventoChange === 'change' || this.cambioFormulario) {
      confirm('No ha guardado los cambios que ha realizado, se perderan los datos', '¿Está seguro/a?').then(res => {
        if (res) {
          this.detectarEventoChange = '';
          this.comprobarSiguiente(parametro);
        }
      });
    } else {
      this.comprobarSiguiente(parametro);
    }
  }
  comprobarSiguiente(parametro) {
    if (parametro > 1) {
      if (this.posicion === this.facturacion.oidsPrefactura.length - 1) return;
      this.posicion = this.facturacion.oidsPrefactura.length - 1;
      this.oidPrefactura = this.facturacion.oidsPrefactura[this.posicion];
      this.vistaServicios = false;
      this.getPrefacturasDetalle();
      setTimeout(() => {
        this.vistaServicios = true;

      }, 300);

    } else {
      if (this.posicion < this.facturacion.oidsPrefactura.length - 1) {
        this.posicion += parametro;
        this.oidPrefactura = this.facturacion.oidsPrefactura[this.posicion];
        this.vistaServicios = false;
        this.getPrefacturasDetalle();
        setTimeout(() => {
          this.vistaServicios = true;

        }, 300);

      } else {
        this.posicion = this.facturacion.oidsPrefactura.length - 1;
        return;
      }
    }
  }
  comprobarAnterior(parametro) {

    if (parametro === 0) {
      if (this.posicion === 0) {
        return;
      }

      this.posicion = 0;
      this.oidPrefactura = this.facturacion.oidsPrefactura[this.posicion];
      this.vistaServicios = false;
      //  this.longitudSolicitudes = 0;
      this.getPrefacturasDetalle();
      setTimeout(() => {
        this.vistaServicios = true;

      }, 300);

    } else {
      this.posicion -= parametro;
      if (this.posicion < 0) {
        this.posicion = 0;
        return;
      } else {
        this.oidPrefactura = this.facturacion.oidsPrefactura[this.posicion];
        this.vistaServicios = false;
        this.getPrefacturasDetalle();
        setTimeout(() => {
          this.vistaServicios = true;

        }, 300);

      }
    }
  }
  anterior(parametro) {
    if (this.detectarEventoChange === 'change' || this.cambioFormulario) {
      confirm('No ha guardado los cambios que ha realizado, se perderan los datos', '¿Está seguro/a?').then(res => {
        if (res) {
          this.detectarEventoChange = '';
          this.comprobarAnterior(parametro);
        }
      });
    } else {
      this.comprobarAnterior(parametro);
    }
  }
  recogerNombreCliente(item) {
    const nombreCliente = this.facturacion.clientes.find(key => key.oid === item);
    return nombreCliente.nombre;
  }
  cambiarVista() {
    this.vistaServicios = !this.vistaServicios;
  }
  validar() {
    this.facturacion.validarPrefactura(this.oidPrefactura).then((data: any) => {

      if (data.ok) {
        this.toastr.success(data.mensaje, 'Correcto');
        this.valido = data.valido;
      }
    });
  }
  retroceder() {
    confirm('Esta seguro/a de que quiere retroceder esta prefactura', '¿Está seguro/a?').then(res => {
      if (res) {
        if (this.detectarEventoChange === 'change' || this.cambioFormulario) {
          confirm('No ha guardado los cambios que ha realizado, se perderan los datos', '¿Está seguro/a?').then(res => {
            if (res) {
              this.metodoRetroceso();
              this.detectarEventoChange = '';
            }
          });
        } else {
          this.metodoRetroceso();
        }
      }
    });

  }
  metodoRetroceso() {
    this.facturacion.oidsPrefactura.splice(this.posicion, 1);
    this.facturacion.codigosPrefactura.splice(this.posicion, 1);
    if (this.facturacion.oidsPrefactura.length < 1) {
      return;
    }

    if (this.posicion === this.facturacion.oidsPrefactura.length) {
      this.oidPrefactura = this.facturacion.oidsPrefactura[this.oidsPrefactura.length];
      this.posicion = this.facturacion.oidsPrefactura.length - 1;

      this.getPrefacturasDetalle();
      this.comprobarUnificar();
    } else {

      this.oidPrefactura = this.facturacion.oidsPrefactura[this.posicion];
      this.getPrefacturasDetalle();
      this.comprobarUnificar();
    }
  }
  quitarFacturacion() {
    confirm('Va a quitar una factura de la lista', '¿Continuar?').then(res => {
      if (res) {
        const factura = this.facturacion.oidsPrefactura.find(key => key === this.objetoFactura);
        const index = this.facturacion.oidsPrefactura.indexOf(factura);
        if (factura !== undefined) {
          this.facturacion.oidsPrefactura.splice(index, 1);
        } else {
          this.toastr.error('No hay mas elementos que eliminar', 'Error')
        }
        setTimeout(() => {
          if (index !== this.facturacion.oidsPrefactura.length) {
            this.mostrarDetalleFactura(index);
            this.comprobarUnificar();
          } else {
            if (factura !== undefined) {
              if (this.facturacion.oidsPrefactura.length > 0) {
                this.posicion = index - 1;
                this.mostrarDetalleFactura(index - 1);
              } else {
                this.mostrarDiv = false;
                this.objetoFactura = null;
                this.toastr.error('No hay mas elementos que eliminar', 'Error')
              }
            }
          }
        }, 250);
      }
    });
  }
  eliminarPrefactura() {
    confirm('Esta prefactura va a ser eliminada de forma permanente', '¿Está seguro/a?').then(res => {
      if (res) {
        this.facturacion.eliminarPrefactura(this.oidPrefactura).then((data: any) => {
          if (data.ok) {
            this.toastr.success(data.mensaje, 'Correcto');
            this.metodoRetroceso();
          }
        });
      }
    });
  }
  modificarLineas() {
    this.navegacion = 'resumen';
    this.altura = '650px';
    this.facturacion.serviciosResumenBol = true;
  }
  facturar(parametro) {

    this.tipoFactura = parametro;
    if (parametro === 'una') {
      if (this.cabecera.pedido_requerido && this.cabecera.pedido === null) {
        this.toastr.error('Esta prefactura no cumple con los requisitos, reviselo', 'ERROR');
      } else {
        this.popUpConfirmFactura = true;
      }
    } else {
      const buscador = this.facturacion.validacionRequisitos.find(key => key.requisito && key.pedido === null);
      if (!buscador) {
        this.popUpConfirmFactura = true;
      } else {
        this.toastr.error('Tiene alguna prefactura que no cumple con alguno de los requisitos', 'ERROR');
      }
    }
  }

  metodoFacturar() {
    this.fechaAMandar = this.datePipe.transform(this.fecha, 'yyyy-MM-dd');
    let prefacturas = [];
    if (this.tipoFactura === 'una') {
      prefacturas.push(this.oidPrefactura);
      const objetcFactura = new MandarFactura();
      objetcFactura.oids = prefacturas;
      objetcFactura.fecha_factura = this.fechaAMandar;
      this.facturacion.mandarAFacturar(objetcFactura).then((data: any) => {
        if (data.ok) {
          this.toastr.success('Se ha facturado la solicitud correctamente', 'Correcto');
          this.metodoRetroceso();
          this.popUpConfirmFactura = false;
        }
      });
    } else {
      const objetcFactura = new MandarFactura();
      objetcFactura.oids = this.facturacion.oidsPrefactura;
      objetcFactura.fecha_factura = this.fechaAMandar;
      this.facturacion.mandarAFacturar(objetcFactura).then((data: any) => {
        if (data.ok) {
          this.toastr.success('Se han facturado todas las solicitudes');
          this.facturacion.oidsPrefactura = [];
          this.popUpConfirmFactura = false;
        }
      });
    }
  }
  salir() {
    if (this.detectarEventoChange === 'change' || this.cambioFormulario) {
      confirm('No ha guardado los cambios que ha realizado, se perderan los datos', '¿Está seguro/a?').then(res => {
        if (res) {
          this.facturacion.pantallaModulo = '';
          this.router.navigateByUrl('facturar/solicitudes');
        }
      });
    } else {
      this.facturacion.pantallaModulo = '';
      this.router.navigateByUrl('facturar/solicitudes');
    }
    this.facturacion.modoBusqueda = 'prefactura';
  }
  comprobarUnificar() {
    const jsonData = '{"oids":' + JSON.stringify(this.facturacion.oidsPrefactura) + '}';
    this.facturacion.ComprobarUnificar(jsonData).then((data: any) => {
      if (data.ok) {
        this.cabecerasDistintas = data.comprobarCabeceras.length;
      }
    });
  }
  unificar() {
    if (this.cabecerasDistintas > 1) {
      this.mostrarPopUpUnificar = true;
      return;
    } else {
      confirm('Va a unificar estas prefacturas en una sola', '¿Está seguro/a?').then(res => {
        if (res) {
          this.metodoUnificar();
        }
      });
    }
  }
  metodoUnificar() {
    this.Unificar.oid = this.oidPrefactura;
    const oids = this.facturacion.oidsPrefactura.filter(key => key !== this.oidPrefactura);
    this.Unificar.oids = oids;
    const jsonData = '{"unificar":' + JSON.stringify(this.Unificar) + '}';
    this.facturacion.unificar(jsonData).then((data: any) => {
      if (data.ok) {
        this.facturacion.oidsPrefactura = [];
        this.facturacion.oidsPrefactura.push(this.oidPrefactura);
        this.cabecera = data.cabecera;
        this.facturacion.listaDetalles = data.servicios;
        this.toastr.success('Se han unificado las prefacturas correctamente', 'Correcto');
        setTimeout(() => {
          this.longitudSolicitudes = this.prefactura.conseguirOidSolicitudes(this.facturacion.listaDetalles);
          this.mostrarPopUpUnificar = false;
        }, 500);

      }
    }); 
  }
}

