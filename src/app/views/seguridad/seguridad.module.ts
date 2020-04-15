import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SeguridadRoutingModule } from './seguridad.routing.module';
import { SeguridadComponent } from './seguridad.component';
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

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SeguridadRoutingModule,
    ImageCropperModule,
    SharedComponentsModule,
    FormWizardModule,
    TextMaskModule,
    CustomFormsModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    DevExtremeModule,
    TagInputModule
  ],
  declarations: [SeguridadComponent]
})
export class SeguridadModule { }
