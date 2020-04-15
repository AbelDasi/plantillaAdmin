import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MantenimientosRoutingModule} from './mantenimientos-routing.module';
import { UbicacionesMuestrasComponent } from './ubicaciones-muestras/ubicaciones-muestras.component';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { FormWizardModule } from 'src/app/shared/components/form-wizard/form-wizard.module';
import { TextMaskModule } from 'angular2-text-mask';
import { CustomFormsModule } from 'ng2-validation';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DevExtremeModule } from 'devextreme-angular';
import { TagInputModule } from 'ngx-chips';
import { NgxTypeaheadModule } from 'ngx-typeahead';
import { LaboratoriosComponent } from './laboratorios/laboratorios.component';
import { ObservacionesComponent } from './observaciones/observaciones.component';
import { PaisesComponent } from './paises/paises.component';
import { LegislacionComponent } from './legislacion/legislacion.component';
import { ZonasComponent } from './zonas/zonas.component';
import { ParametrosComponent } from './parametros/parametros.component';
import { MediosComponent } from './medios/medios.component';
import { DilucionesComponent } from './diluciones/diluciones.component';
import { AcronimosComponent } from './acronimos/acronimos.component';
import { MaquinasComponent } from './maquinas/maquinas.component';


@NgModule({
  declarations: [UbicacionesMuestrasComponent, LaboratoriosComponent, ObservacionesComponent, PaisesComponent, LegislacionComponent, ZonasComponent, ParametrosComponent, MediosComponent, DilucionesComponent, AcronimosComponent, MaquinasComponent],
  imports: [
    CommonModule,
    MantenimientosRoutingModule,
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
  ]
})
export class MantenimientosModule { }
