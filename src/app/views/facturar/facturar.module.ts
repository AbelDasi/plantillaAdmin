import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacturarRoutingModule } from './facturar-routing.module';
import { FacturarComponent } from './facturar.component';
import { RouterModule } from '@angular/router';
import { ImageCropperModule } from 'ngx-img-cropper';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { FormWizardModule } from 'src/app/shared/components/form-wizard/form-wizard.module';
import { TextMaskModule } from 'angular2-text-mask';
import { CustomFormsModule } from 'ng2-validation';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TagInputModule } from 'ngx-chips';
import { DevExtremeModule } from 'devextreme-angular';
import { DatePipe } from '@angular/common';
import { NgxTypeaheadModule } from 'ngx-typeahead';
import { ServiciosComponent } from './servicios/servicios.component';
import { ResumenComponent } from './resumen/resumen.component';
import { NuevaLineaComponent } from './nueva-linea/nueva-linea.component';
import {SolicitudesComponent} from './solicitudes/solicitudes.component';
import {PrefacturaComponent} from './prefactura/prefactura.component';
import { NuevaFilaComponent } from './servicios/nueva-fila/nueva-fila.component';
import { PrefacturaDetalleComponent } from './resumen/prefactura-detalle/prefactura-detalle.component';
import { NuevaFilaPreComponent } from './resumen/prefactura-detalle/nueva-fila/nueva-fila.component';
import { AgrupadosComponent } from './resumen/agrupados/agrupados.component';
import { FacturasComponent } from './facturas/facturas.component';
import { FiltrosComponent } from './filtros/filtros.component';
import { ResumenFacturaComponent } from './resumen-factura/resumen-factura.component';
import { FacturaDetalleComponent } from './resumen-factura/factura-detalle/factura-detalle.component';
import { AbonosComponent } from './facturas/abonos/abonos.component';
import { ResumenAbonoComponent } from './resumen-abono/resumen-abono.component';
import { AbonoDetalleComponent } from './resumen-abono/abono-detalle/abono-detalle.component';
import { NuevaFilaAbonoComponent } from './resumen-abono/abono-detalle/nueva-fila/nueva-fila.component';
import { ResumenRefacturasComponent } from './resumen-refacturas/resumen-refacturas.component';
import { RefacturaDetalleComponent } from './resumen-refacturas/refactura-detalle/refactura-detalle.component';
import { NuevaFilaRefacturaComponent } from './resumen-refacturas/refactura-detalle/nueva-fila-refactura/nueva-fila-refactura.component';
import { RefacturasComponent } from './facturas/refacturas/refacturas.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FacturarRoutingModule,
    ImageCropperModule,
    SharedComponentsModule,
    FormWizardModule,
    TextMaskModule,
    CustomFormsModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    DevExtremeModule,
    TagInputModule,
    NgxTypeaheadModule
  ],
  declarations: [FacturarComponent, ServiciosComponent, ResumenComponent,
  NuevaLineaComponent, SolicitudesComponent, PrefacturaComponent, NuevaFilaComponent,NuevaFilaPreComponent,NuevaFilaAbonoComponent,
  PrefacturaDetalleComponent,
  AgrupadosComponent,
  FacturasComponent,
  FiltrosComponent,
  ResumenFacturaComponent,
  FacturaDetalleComponent,
  AbonosComponent,
  ResumenAbonoComponent,
  AbonoDetalleComponent,
  ResumenRefacturasComponent,
  RefacturaDetalleComponent,
  NuevaFilaRefacturaComponent,
  RefacturasComponent],
  providers: [DatePipe]
})
export class FacturarModule { }