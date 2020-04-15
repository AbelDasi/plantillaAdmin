import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { FacturacionService } from '../facturacion.service';
import { MetodosService } from 'src/app/shared/services/metodos.service';
import { Router } from '@angular/router';
import { AbonosComponent } from './abonos/abonos.component';
import { CountFacturas } from 'src/app/shared/models/factura';
import Swal from 'sweetalert2'
import { DatePipe } from '@angular/common';
import { locale, loadMessages  } from 'devextreme/localization';
import { RefacturasComponent } from './refacturas/refacturas.component';
declare var require: any;
const messagesES = require('src/assets/api/devextreme/es.json');


@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.scss']
})
export class FacturasComponent implements OnInit {
  @ViewChild('celdaSolicitudes', { static: false }) celdaSolicitudes: any;
  @ViewChild('abonos', { static: false }) abonoChild: AbonosComponent;
  @ViewChild('refactura', { static: false }) refacturaChild: RefacturasComponent;
  lookupData: { paginate: boolean; pageSize: number; store: any[]; };
  alturaPantalla: number;
  divPagina: number;
  alturaReferenciaNumber: number;
  alturaReferencia: string;
  facturas: any[] = [];
  parametroFiltroTipo = 'factura';
  oidFactura: any;
  mostrarBtn: boolean = false;
  opcion: string;
  oidAbono: any;
  constructor(public facturacion: FacturacionService, private metodos: MetodosService, private router: Router, private datePipe: DatePipe) { 
    loadMessages(messagesES);
    locale(navigator.language);
  }

  ngOnInit() {

    this.filtroClientes();
    this.alturaReferencia = '500px';
    this.facturacion.getCountFacturas().then((data: any) => {
      this.facturacion.countFacturas = data.numero;
    });
  }
  deteccionCambios(detectarEventoChange: boolean) {
    if (detectarEventoChange) {
      this.facturacion.getCountFacturas().then((data: any) => {
        this.facturacion.countFacturas = data.numero;

      });
    }
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
  ngAfterViewInit() {
    setTimeout(() => {
      this.onResize();
    }, 800);
  }

  onRowPrepared(event) {
    if (event.rowType === 'data') {
      if (event.key.bool_facturacion) {
        // tslint:disable-next-line:no-unused-expression
        event.rowElement.style.background = 'white';
        event.rowElement.style.color = 'green';
        event.rowElement.style.fontWeight = 'bold';
      }
      event.rowElement.style.cursor = 'pointer';
    }
  }
  // METODO QUE PREPARA LA CELDA PARA PONERLE ESTILO CSS //
  onCellPrepared(event) {
    if (event.rowType === 'header') {
      event.cellElement.style.border = '0px';
      event.cellElement.style = 'color: white;font-weigth: bold;text-align: center;background-color:#0B86CA;border:1px solid white;';
    } else if (event.rowType === 'data') {
      if (event.key.factura_anterior) {
        event.cellElement.style = 'color: #B93518;font-weight: bold;text-align: center;';
      }
      event.cellElement.style = `text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;font-size: 13px; text-align:center;`;
    }
  }

  onCellClick(event) {

    const component = event.component,
    prevClickTime = component.lastClickTime;
    component.lastClickTime = new Date();
    if (prevClickTime && (component.lastClickTime - prevClickTime < 300)) {
      if (!event.data.factura_anterior) {
        //Double click code  
        this.router.navigateByUrl(`facturar/resumen-factura/${event.data.oid}`);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error...',
          text: 'La factura ya tiene un abono asoaciado'

        })
      }
    }
    else {
      //Single click code   
    }
  }

  onSelectionChanged(event?) {
    this.oidFactura = event.selectedRowsData[0].oid;
    if (event.selectedRowsData[0].factura_anterior) {
      this.facturacion.mostrarBtn = false;
    } else {
      this.facturacion.mostrarBtn = true;
    }
  }

  verDetalle() {
    
    if (this.facturacion.parametroFiltroTipo === 'factura') {
      this.facturacion.mostrarBtn = false;
      this.router.navigateByUrl(`facturar/resumen-factura/${this.oidFactura}`);
    } else if (this.facturacion.parametroFiltroTipo.includes('abono'))  {
      this.facturacion.mostrarBtn = false; 
      this.abonoChild.detalleAbono(this.oidAbono);
    } else {
      this.refacturaChild.detalleRefactura(this.facturacion.oidRefactura);
    }
  }
  eventoChanges1(event) {
    this.oidAbono = event;
    
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

      this.seleccionBotones(this.facturacion.parametroFiltroTipo);
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

  seleccionBotones(parametro, opcion?) {
    this.facturacion.parametroFiltroTipo = parametro;

    switch (this.facturacion.parametroFiltroTipo) {
      case 'factura':
        const desde = this.datePipe.transform(this.facturacion.fechaInicio, 'yyyy-MM-dd');
        const hasta = this.datePipe.transform(this.facturacion.fechaFin, 'yyyy-MM-dd');

        this.facturacion.getFacturas(desde, hasta).then((data: any) => {
          if (data.ok) {
            this.facturas = data.facturas;
          }
        });
        break;
      case 'abono':
        setTimeout(() => {
          this.abonoChild.getAbonos();
        }, 500);
        break;
      case 'preabono':
        setTimeout(() => {
          this.abonoChild.getPreAbonos();
        }, 300);
        break;
        
          case 'refactura':
            
              this.facturacion.parametroFiltroTipo = 'refactura';
              setTimeout(() => {
                
                this.refacturaChild.getReFacturas();
              }, 500);
            
        
          break;
          case 'prerefactura':
            setTimeout(() => {
              this.refacturaChild.getPreReFacturas();
            }, 500);  
            break;
      default:
        break;
    }
  }
  buscar() {
    this.seleccionBotones(this.facturacion.parametroFiltroTipo);
  }
  volverSolicitudes() {
    this.router.navigateByUrl('facturar/solicitudes');
  }

}
