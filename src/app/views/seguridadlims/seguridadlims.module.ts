import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeguridadLimsRoutingModule } from './seguridadlims-routing.module';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { GruposComponent } from './grupos/grupos.component';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { FormWizardModule } from 'src/app/shared/components/form-wizard/form-wizard.module';
import { TextMaskModule } from 'angular2-text-mask';
import { CustomFormsModule } from 'ng2-validation';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TagInputModule } from 'ngx-chips';
import { DevExtremeModule } from 'devextreme-angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedComponentsModule,
    SeguridadLimsRoutingModule,
    FormWizardModule,
    TextMaskModule,
    CustomFormsModule,
    ReactiveFormsModule,
    NgbModule,
    DevExtremeModule,
    TagInputModule
  ],
  declarations: [GruposComponent, UsuariosComponent]
})
export class SeguridadLimsModule { }
