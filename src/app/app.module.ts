import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './shared/inmemory-db/inmemory-db.service';
import { HttpClientModule } from '@angular/common/http';
import { NgxTypeaheadModule } from 'ngx-typeahead';
// localización
import { LOCALE_ID } from '@angular/core';
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeEs);
import { locale, loadMessages  } from 'devextreme/localization';
import { VerificaTokenGuard } from './shared/services/verifica-token-guard.service';



declare var require: any;
const messagesES = require('src/assets/api/devextreme/es.json');
loadMessages(messagesES);
locale('es');
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    SharedModule,
    HttpClientModule,
    BrowserAnimationsModule,
    InMemoryWebApiModule.forRoot(InMemoryDataService, { passThruUnknownUrl: true }),
    AppRoutingModule,
    NgxTypeaheadModule
  ],
  providers: [{provide: LOCALE_ID, useValue: 'es' }, VerificaTokenGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
