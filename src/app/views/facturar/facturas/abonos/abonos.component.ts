import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { FacturacionService } from '../../facturacion.service';
import { MetodosService } from 'src/app/shared/services/metodos.service';
import { DxValidationGroupComponent } from 'devextreme-angular';
import { NuevoAbono } from 'src/app/shared/models/factura';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
let oidAbono: number;

@Component({
  selector: 'app-abonos',
  templateUrl: './abonos.component.html',
  styleUrls: ['./abonos.component.scss']
})
export class AbonosComponent implements OnInit {
  popUpFactura: boolean;
  @ViewChild('val1', { static: false }) validationGroup: DxValidationGroupComponent;
  @Output() eventoChanges: EventEmitter<Boolean>;
  @Output() eventoChanges1: EventEmitter<Number>;

  nuevoAbono: NuevoAbono = new NuevoAbono();

  constructor(private facturacion: FacturacionService, private metodos: MetodosService, private toast: ToastrService,
    private router: Router, private datePipe: DatePipe) {
    this.eventoChanges = new EventEmitter();
    this.eventoChanges1 = new EventEmitter();
    
  }
  abonos: any[] = [];
  lookupData: { paginate: boolean; pageSize: number; store: any[]; };
  ngOnInit() {
    this.facturacion.mostrarBtn = false;
    this.filtroClientes();

  }
  getPreAbonos() {
    
    const desde = this.datePipe.transform(this.facturacion.fechaInicio, 'yyyy-MM-dd');
    const hasta = this.datePipe.transform(this.facturacion.fechaFin, 'yyyy-MM-dd');
    this.facturacion.getpreAbonos(desde, hasta).then((data: any) => {
      if (data.ok) {
        this.abonos = data.abonos;
      }
    });

  }
  deteccionEvento() {
    this.eventoChanges.emit(true);
  }
  deteccionEvento1(parametro) {
    this.eventoChanges1.emit(parametro);
  }
  getAbonos() {
    
    const desde = this.datePipe.transform(this.facturacion.fechaInicio, 'yyyy-MM-dd');
    const hasta = this.datePipe.transform(this.facturacion.fechaFin, 'yyyy-MM-dd');
    this.facturacion.getAbonos(desde, hasta).then((data: any) => {
      if (data.ok) {
        this.abonos = data.abonos;
      }
    });
  }
  detalleAbono(oid) {
    this.router.navigateByUrl(`facturar/resumen-abono/${oid}`);
  }
  onRowPrepared(event) {
    if (event.rowType === 'data') {
      event.rowElement.style.cursor = 'pointer';
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
      event.cellElement.style = 'color: white;font-weigth: bold;text-align: center;background-color:#0B86CA;border:1px solid white;';
    } else if (event.rowType === 'data') {
      if (event.key.validar) {
        event.cellElement.style = 'color: green;font-weight: bold;text-align: center;';
      }
      event.cellElement.style =`text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;font-size: 13px; text-align:center;`;
    }
  }
  onCellClick(event) {
    const component = event.component,
    prevClickTime = component.lastClickTime;
    component.lastClickTime = new Date();
    if (prevClickTime && (component.lastClickTime - prevClickTime < 300)) {
      //Double click code  
      this.router.navigateByUrl(`facturar/resumen-abono/${event.data.oid}`);
    }
    else {
      //Single click code   
    }
  }
  onToolbarPreparing(event) {
    const esto = this;
    // esto.getPerfiles();
    event.toolbarOptions.items.unshift(

      //
      {
        location: 'after',
        name: 'addPrefactura',
        widget: 'dxButton',
        options: {
          icon: 'plus',
          hint: 'Añadir prefactura',
          elementAttr: { id: 'addPrefactura' },
          onClick: function () {
            esto.popUpFactura = true;
          }
        },
      }
    );
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
      this.lookupData = {
        paginate: true,
        pageSize: 20,
        store: this.facturacion.clientes
      };

    });
  }
  onSelectionChanged(event) {
    oidAbono = event.selectedRowsData[0].oid;
    this.deteccionEvento1(oidAbono);
    
    this.facturacion.mostrarBtn = true;
    
  }

  devolverNombreCliente(oid?) {
    const nombreCliente = this.facturacion.clientes.find(key => key.oid === oid);
    return nombreCliente.nombre;
  }
  devolverNombreClienteFacturar(oid?) {
    const nombreCliente = this.facturacion.clientes.find(key => key.oid === oid);
    return nombreCliente.nombre;
  }
  setearCfacturar() {
    this.nuevoAbono.cliente_facturar = this.nuevoAbono.cliente;
  }

  addAbono() {
    this.nuevoAbono.asociado_facturar = false;
    this.nuevoAbono.abonado = false;
    this.nuevoAbono.no_enviar = false;
    this.nuevoAbono.email_envio = 'sin correo';
    const result = this.validationGroup.instance.validate();
    if (!result.isValid) {
      return this.toast.error('Los campos son obligatorios', 'Error');
    }
    const jsonData = '{"abono":' + JSON.stringify(this.nuevoAbono) + '}';
    this.facturacion.nuevoPreAbono(jsonData).then((data: any) => {
      if (data.ok) {
        this.toast.success('Se ha hecho un pre-abono correctamente', 'CORRECTO');
        this.abonos = data.abonos;
        setTimeout(() => {
          this.facturacion.getCountFacturas().then((data: any) => {
          this.facturacion.countFacturas = data.numero;
          });
          this.popUpFactura = false;
        }, 500);
      } else {
        this.toast.error('No se ha podido realizar el pre-abono, contacte con su administrador', 'ERROR');
      }
    });
  }

}
