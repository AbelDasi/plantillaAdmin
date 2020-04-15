import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
/* import { AuthGaurd } from 'src/app/shared/services/auth.gaurd';
import { VerificaTokenGuard } from 'src/app/shared/services/verifica-token-guard.service'; */
import { UbicacionesMuestrasComponent } from './ubicaciones-muestras/ubicaciones-muestras.component';
import { ObservacionesComponent } from './observaciones/observaciones.component';
import { PaisesComponent } from './paises/paises.component';
import { LegislacionComponent } from './legislacion/legislacion.component';
import { ZonasComponent } from './zonas/zonas.component';
import { ParametrosComponent } from './parametros/parametros.component';
import { MediosComponent } from './medios/medios.component';
import { DilucionesComponent } from './diluciones/diluciones.component';
import { AcronimosComponent } from './acronimos/acronimos.component';

const routes: Routes = [
    {
      path: 'ubicaciones-muestras',
      component: UbicacionesMuestrasComponent
    },
    {
      path: 'observaciones',
      component: ObservacionesComponent
    },
    {
      path: 'paises',
      component: PaisesComponent
    },
    {
      path: 'legislacion',
      component: LegislacionComponent
    },
    {
      path: 'zonas',
      component: ZonasComponent
    },
    {
      path: 'parametros',
      component: ParametrosComponent
    },
    {
      path: 'medios',
      component: MediosComponent
    },
    {
      path: 'diluciones',
      component: DilucionesComponent
    },
    {
      path: 'acronimos',
      component: AcronimosComponent
    },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class MantenimientosRoutingModule { }
