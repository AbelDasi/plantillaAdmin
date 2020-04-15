import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { FacturacionService } from '../../facturacion.service';

@Component({
  selector: 'app-factura-detalle',
  templateUrl: './factura-detalle.component.html',
  styleUrls: ['./factura-detalle.component.scss']
})
export class FacturaDetalleComponent implements OnInit {
  @ViewChild('celdaSolicitudes', { static: false }) celdaSolicitudes: any;
  alturaReferencia: string;
  alturaPantalla: number;
  alturaReferenciaNumber: number;
  constructor(public facturacion: FacturacionService) { }

  ngOnInit() {
    this.alturaReferencia = '500px';
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
  ngAfterViewInit() {
    setTimeout(() => {
      this.onResize();
    }, 800);
  }
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
  calculateCellValue(data) {
    data.total = data.cantidad * data.precio_unidad;
    return data.total;
  }

}
