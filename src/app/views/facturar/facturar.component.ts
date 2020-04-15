import { Component, OnInit } from '@angular/core';
import {SeguridadService} from '../../shared/services/seguridad.service';
import {FacturacionService} from './facturacion.service';
 
@Component({
  selector: 'app-facturar',
  templateUrl: './facturar.component.html',
  styleUrls: ['./facturar.component.scss']
})
export class FacturarComponent implements OnInit {

  constructor(private seguridad: SeguridadService, public facturacion: FacturacionService) { }

  ngOnInit() {
/*     this.facturacion.solicitudesBol =true;
    this.facturacion.serviciosBol   =false;
    this.facturacion.prefacturaBol  =false;
    this.facturacion.resumenBol     =false;
    this.facturacion.nuevalineaBol  =false;
    this.facturacion.gridSolicitudesBol = true; */
  }

}
