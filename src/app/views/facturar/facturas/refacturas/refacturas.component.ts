import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { FacturacionService } from '../../facturacion.service';
import { MetodosService } from 'src/app/shared/services/metodos.service';
import { DxValidationGroupComponent } from 'devextreme-angular';
import { NuevoAbono, NuevaRefactura } from 'src/app/shared/models/factura';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
let oidRefactura: number;

@Component({
  selector: 'app-refacturas',
  templateUrl: './refacturas.component.html',
  styleUrls: ['./refacturas.component.scss']
})
export class RefacturasComponent implements OnInit {

  popUpReFactura: boolean;
  @ViewChild('val1', { static: false }) validationGroup: DxValidationGroupComponent;
  @Output() eventoChanges: EventEmitter<Boolean>;
  @Output() eventoChanges1: EventEmitter<Number>;

//  nuevoAbono: NuevoAbono = new NuevoAbono();
  nuevaRefactura: NuevaRefactura = new NuevaRefactura();

  constructor(private facturacion: FacturacionService, private metodos: MetodosService, private toast: ToastrService,
    private router: Router, private datePipe: DatePipe) {
    this.eventoChanges = new EventEmitter();
    this.eventoChanges1 = new EventEmitter();
    
  }
  refacturas: any[] = [];
  lookupData: { paginate: boolean; pageSize: number; store: any[]; };
  ngOnInit() {
    this.facturacion.mostrarBtn = false;
    this.filtroClientes();
  //  this.geReFacturas();

  }
  
  deteccionEvento() {
    this.eventoChanges.emit(true);
  }
  deteccionEvento1(parametro) {
    this.eventoChanges1.emit(parametro);
  }
  getPreReFacturas() {
    
    const desde = this.datePipe.transform(this.facturacion.fechaInicio, 'yyyy-MM-dd');
    const hasta = this.datePipe.transform(this.facturacion.fechaFin, 'yyyy-MM-dd');
    this.facturacion.getPreRefacturas(desde, hasta).then((data: any) => {
      if (data.ok) {
        this.refacturas = data.refacturas;
      }

    });

  }
  getReFacturas() {
    
    const desde = this.datePipe.transform(this.facturacion.fechaInicio, 'yyyy-MM-dd');
    const hasta = this.datePipe.transform(this.facturacion.fechaFin, 'yyyy-MM-dd');
    this.facturacion.getRefacturas(desde, hasta).then((data: any) => {
      
      if (data.ok) {
        this.refacturas = data.refacturas;
      }

    });

  }

  
  detalleRefactura(oid) {
    this.router.navigateByUrl(`facturar/resumen-refacturas/${oid}`);
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
    if (event.rowType === 'filter') return;
    

    const component = event.component,
      prevClickTime = component.lastClickTime;
    component.lastClickTime = new Date();
    if (prevClickTime && (component.lastClickTime - prevClickTime < 300)) {
      //Double click code  
      this.router.navigateByUrl(`facturar/resumen-refacturas/${event.data.oid}`);
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
          hint: 'Añadir Pre-refactura',
          elementAttr: { id: 'addPrefactura' },
          onClick: function () {
            esto.popUpReFactura = true;
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
    this.facturacion.oidRefactura = event.selectedRowsData[0].oid;
    
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
    this.nuevaRefactura.cliente_facturar = this.nuevaRefactura.cliente;
  }

  addRefactura() {
    this.nuevaRefactura.asociado_abono = false;
    this.nuevaRefactura.no_enviar = false;
    this.nuevaRefactura.email_envio = '';
    const result = this.validationGroup.instance.validate();

    if (!result.isValid) {
      return this.toast.error('Los campos son obligatorios', 'Error');
    }

    const jsonData = '{"refactura":' + JSON.stringify(this.nuevaRefactura) + '}';
     this.facturacion.nuevaPreReFactura(jsonData).then((data: any) => {
      if (data.ok) {
        this.toast.success('Se ha hecho una pre-refactura correctamente', 'CORRECTO');
        this.refacturas = data.refacturas;
        setTimeout(() => {
          this.facturacion.getCountFacturas().then((data: any) => {

            this.facturacion.countFacturas = data.numero;
          });
          this.popUpReFactura = false;
        }, 500);
      } else {
        this.toast.error('No se ha podido realizar la pre-refactura, contacte con su administrador', 'ERROR');
      }
    }); 

  }
}
