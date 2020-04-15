import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FacturacionService } from '../facturacion.service';
import { MetodosService } from 'src/app/shared/services/metodos.service';
import { confirm } from 'devextreme/ui/dialog';
import { GuardarPreAbono, NuevaRefactura } from 'src/app/shared/models/factura';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-resumen-refacturas',
  templateUrl: './resumen-refacturas.component.html',
  styleUrls: ['./resumen-refacturas.component.scss']
})
export class ResumenRefacturasComponent implements OnInit {
  nuevaRefactura: NuevaRefactura = new NuevaRefactura();
  oidRefactura: number;
  cabecera: any;
  seeDetails: boolean;
  formCabecera: FormGroup;
  verMenu = true;
  habilitarAcciones: boolean = false;
  lookupData: { paginate: boolean; pageSize: number; store: any[]; };
  popUpConfirmRefactura: boolean;
  fecha: Date = new Date();
  fechaAMandar = '';
  constructor(private route: ActivatedRoute, private facturacion: FacturacionService,
    private _formBuilder: FormBuilder, private router: Router, private metodos: MetodosService, private toast: ToastrService,
    private datePipe: DatePipe) {
      this.oidRefactura=parseInt(this.route.snapshot.paramMap.get('id'));
     }

  ngOnInit() {
  this.crearFormulario();
  this.filtroClientes();
  this.getRefacturaDetalle();
  }

   getRefacturaDetalle() {
    this.facturacion.getDetalleRefactura(this.oidRefactura).then((data: any) => {
      
      this.facturacion.listaDetalles = data.servicios;
      this.cabecera = data.cabecera;
      
      this.setearForm();
      this.seeDetails = true;
      if (this.cabecera.numero_refactura !== null) {
        this.habilitarAcciones = true;
      }
      this.setearForm();
    });
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
  ocultarMenu() {
    this.verMenu = !this.verMenu;
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
    
  }

  salir() {
    this.router.navigateByUrl('facturar/facturas');
  }
  irSolicitudes() {
    this.router.navigateByUrl('facturar/solicitudes');
  }
  refacturar() {
    this.popUpConfirmRefactura = true;
  //  this.metodoAbonar();
  }

   eliminarPreRefactura() {
    confirm('Este Preabono va a ser eliminado de forma permanente', '¿Está seguro/a?').then(res => {
      if (res) {
        this.facturacion.eliminarPreRefactura(this.oidRefactura).then((data: any) => {
          if (data.ok) {
            this.toast.success(data.mensaje, 'Correcto');
            setTimeout(() => {
              this.facturacion.getCountFacturas().then((data: any) => {
                
                this.facturacion.countFacturas = data.numero;
              });
              this.router.navigateByUrl('facturar/facturas');
            }, 500);
          }
        });
      }
    });
  } 

  metodoRefacturar() {
    this.fechaAMandar = this.datePipe.transform(this.fecha, 'yyyy-MM-dd');
    let objetoEnviar: any = {
      
      refactura: this.oidRefactura,
      fecha: this.fechaAMandar
    };
    
    this.facturacion.refacturar(objetoEnviar).then((data: any)=> {
      if (data.ok) {
        this.toast.success('Se ha hecho el abono de forma correcta', 'CORRECTO');
        setTimeout(() => {
          this.facturacion.getCountFacturas().then((data: any) => {
            this.facturacion.countFacturas = data.numero;
          });
          this.router.navigateByUrl('facturar/facturas');
        }, 500);

      } else {
        this.toast.error('No se ha podido hacer el abono, intentelo más tarde', 'ERROR');
      }
    });
  }

  guardar() {
    const guardarPreA: GuardarPreAbono = new GuardarPreAbono();
    guardarPreA.oid = this.oidRefactura;
    guardarPreA.factura_a = this.formCabecera.value.ClienteFacturar;
    guardarPreA.email_envio = this.formCabecera.value.EmailEnvio;
    guardarPreA.pedido = this.formCabecera.value.Pedido;
    guardarPreA.no_enviar = this.formCabecera.value.NoCopia;

     this.facturacion.guardarCabeceraPreRefactura(guardarPreA).then((data: any) => {
      if (data.ok) {
        this.toast.success(data.mensaje, 'Correcto');
        this.getRefacturaDetalle();
      //  this.cambioFormulario = false;
      } else {
        this.toast.error('No se han podido realizar los cambios, contacte con su administrador web');
      }
    }); 
  }

  

}
