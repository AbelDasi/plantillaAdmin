import { Component, OnInit, Output, EventEmitter, Input, ViewChild, HostListener } from '@angular/core';
import { FacturacionService } from '../facturacion.service';
import { MetodosService } from 'src/app/shared/services/metodos.service';
import { DxDataGridComponent, DxValidationGroupComponent } from 'devextreme-angular';
import { NuevaPrefactura } from 'src/app/shared/models/factura';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-prefactura',
  templateUrl: './prefactura.component.html',
  styleUrls: ['./prefactura.component.scss']
})
export class PrefacturaComponent implements OnInit {
  @ViewChild('val1', { static: false }) validationGroup: DxValidationGroupComponent;
  @ViewChild(DxDataGridComponent, { static: false }) grid: DxDataGridComponent;
  @ViewChild('celdaSolicitudes', { static: false }) celdaSolicitudes: any;
  @Output() recogerSeleccionadas: EventEmitter<number>;
  @Output() longitudPre: EventEmitter<number>;
  @Input() seleccion: boolean;
  prefacturas: any[] = [];
  seleccionados: number;
  lookupData: { paginate: boolean; pageSize: number; store: any; };
  solicitudesSeleccionadas: any;
  alturaPantalla: number;
  divPagina: number;
  alturaReferenciaNumber: number;
  alturaReferencia: string;
  popUpPrefactura: boolean;
  nuevaPrefactura: NuevaPrefactura = new NuevaPrefactura();
  constructor(private facturacion: FacturacionService, private metodos: MetodosService, private toast: ToastrService) {
    this.recogerSeleccionadas = new EventEmitter();
    this.longitudPre = new EventEmitter();
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
    this.alturaReferencia = '500px';
    this.facturacion.getPrefacturas().then((resp: any) => {
      this.prefacturas = resp.prefacturas;
      this.seleccionados = 0;
      this.deteccionEvento();
    });
    this.filtroClientes();
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.onResize();
    }, 800);
  }
  deteccionEvento() {
    this.recogerSeleccionadas.emit(this.seleccionados);
    this.longitudPre.emit(this.prefacturas.length);
  }
  verDetallesPrefactura() {
    this.facturacion.pantallaModulo = 'solicitudes';
    this.facturacion.oidsArrayx = this.facturacion.oidsArray;
    this.facturacion.solicitudesBol =false;
    this.facturacion.serviciosBol   =false;
    this.facturacion.prefacturaBol  =false;
    this.facturacion.resumenBol     =true;
    this.facturacion.nuevalineaBol  =false;
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
  devolverNombreCliente(oid?) {
    const nombreCliente = this.facturacion.clientes.find(key => key.oid === oid);
    return nombreCliente.nombre;
  }
  devolverNombreClienteFacturar(oid?) {
    const nombreCliente = this.facturacion.clientes.find(key => key.oid === oid);
    return nombreCliente.nombre;
  }
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
  onSelectionChanged(event) {
    this.solicitudesSeleccionadas = event.selectedRowKeys;
    

    const oids = [];
    for (const item of this.solicitudesSeleccionadas) {
      oids.push(item.oid);
    }
    this.facturacion.oidsPrefactura = oids;
    this.facturacion.codigosPrefactura = this.solicitudesSeleccionadas.map(key => {
      return {oid: key.oid, codigo: key.codigo}
    });
    this.seleccionados = this.facturacion.oidsPrefactura.length;
    this.deteccionEvento();
    this.facturacion.validacionRequisitos = this.solicitudesSeleccionadas.map(key => {
      return { requisito: key.pedido_requerido, pedido: key.pedido }
    });
  }
  probandoVainas(argumento) {
    if (argumento) {
      this.grid.instance.selectAll();
    } else {
      this.grid.instance.clearSelection();
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
            esto.popUpPrefactura = true;
      /*       esto.eliminarFilas(); */
          }
        },
      }
    );
  }
  setearCfacturar() {
    this.nuevaPrefactura.cliente_facturar = this.nuevaPrefactura.cliente;
  }
  addPrefactura() {
    const result = this.validationGroup.instance.validate();
    
    if (!result.isValid) {
      return this.toast.error('Los campos son obligatorios', 'Error');
    }
     const jsonData = '{"prefactura":' + JSON.stringify(this.nuevaPrefactura) + '}';
     this.facturacion.nuevaPrefactura(jsonData).then((data: any) => {
      if (data.ok) {
        this.toast.success('Se ha creado la prefactura correctamente', 'Correcto');
        this.prefacturas = data.prefacturas;
        this.nuevaPrefactura = new NuevaPrefactura();
        this.popUpPrefactura = false;
      }
    });  

  }
  
}
