import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { FacturacionService } from '../facturacion.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MetodosService } from 'src/app/shared/services/metodos.service';
import { NuevoAbono } from 'src/app/shared/models/factura';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-resumen-factura',
  templateUrl: './resumen-factura.component.html',
  styleUrls: ['./resumen-factura.component.scss']
})
export class ResumenFacturaComponent implements OnInit {
  oidFactura: number;
  cabecera: any;
  seeDetails: boolean;
  formCabecera: FormGroup;
  verMenu = true;
  lookupData: { paginate: boolean; pageSize: number; store: any[]; };
  nuevoAbono: NuevoAbono = new NuevoAbono();
  constructor(private route: ActivatedRoute, private facturacion: FacturacionService,
              private _formBuilder: FormBuilder, private router: Router, private metodos: MetodosService, private toast: ToastrService) {
    this.oidFactura=parseInt(this.route.snapshot.paramMap.get('id'));
    
    
   }

  ngOnInit() {
  this.crearFormulario();
  this.filtroClientes();
  this.getFacturasDetalle();
  }
  getFacturasDetalle() {
    this.facturacion.getDetalleFactura(this.oidFactura).then((data: any) => {
      this.facturacion.listaDetalles = data.servicios;
      this.cabecera = data.cabecera;
      
      this.setearForm();
      this.seeDetails = true;
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
      NoCopia: [{ value: '', disabled: true }],
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
  abonar() {
    this.nuevoAbono.asociado_facturar = true;
    this.nuevoAbono.cliente = this.cabecera.cliente;
    this.nuevoAbono.cliente_facturar = this.cabecera.cliente_facturar;
    this.nuevoAbono.factura = this.oidFactura;
    this.nuevoAbono.abonado = false;
    this.nuevoAbono.pedido = this.cabecera.pedido;
    this.nuevoAbono.no_enviar = this.cabecera.no_enviar;
    this.nuevoAbono.email_envio = this.cabecera.email_envio;
    const jsonData = '{"abono":' + JSON.stringify(this.nuevoAbono) + '}';
    this.facturacion.nuevoPreAbonoConFactura(jsonData).then((data: any) => {
      if (data.ok) {
        this.toast.success('Se ha pre-abonado correctamente', 'CORRECTO');
        setTimeout(() => {
          this.facturacion.getCountFacturas().then((data: any) => {
          this.facturacion.countFacturas = data.numero;
          });
          this.router.navigateByUrl('facturar/facturas');
        }, 500);
      }else {
        this.toast.error('No se ha podido pre-abonar la factura');
      }
    });

    
  }
  salir() {
    this.router.navigateByUrl('facturar/facturas');
  }
  irSolicitudes() {
    this.router.navigateByUrl('facturar/solicitudes');
  }

}
