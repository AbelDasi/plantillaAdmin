import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FacturarComponent } from './facturar.component';
import { SolicitudesComponent } from './solicitudes/solicitudes.component';
import { ServiciosComponent } from './servicios/servicios.component';
import { ResumenComponent } from './resumen/resumen.component';
import { AuthGaurd } from 'src/app/shared/services/auth.gaurd';
import { VerificaTokenGuard } from 'src/app/shared/services/verifica-token-guard.service';
import { FiltrosComponent } from './filtros/filtros.component';
import { FacturasComponent } from './facturas/facturas.component';
import { ResumenFacturaComponent } from './resumen-factura/resumen-factura.component';
import { ResumenAbonoComponent } from './resumen-abono/resumen-abono.component';
import { ResumenRefacturasComponent } from './resumen-refacturas/resumen-refacturas.component';

const routes: Routes = [
    {
        path: '',
        component: FacturarComponent
    },
    {
        path: 'solicitudes',
        canActivate: [AuthGaurd, VerificaTokenGuard],
        component: SolicitudesComponent
    }, 
    {
        path: 'servicios',
        canActivate: [AuthGaurd, VerificaTokenGuard],
        component: ServiciosComponent
    },
    {
        path: 'resumen',
        canActivate: [AuthGaurd, VerificaTokenGuard],
        component: ResumenComponent
    },
    {
        path: 'filtros',
        canActivate: [AuthGaurd, VerificaTokenGuard],
        component: FiltrosComponent
    },
    {
        path: 'facturas',
        canActivate: [AuthGaurd, VerificaTokenGuard],
        component: FacturasComponent
    },
    {
        path: 'resumen-factura/:id',
        canActivate: [AuthGaurd, VerificaTokenGuard],
        component: ResumenFacturaComponent
    },
    {
        path: 'resumen-abono/:id',
        canActivate: [AuthGaurd, VerificaTokenGuard],
        component: ResumenAbonoComponent
    },
    {
        path: 'resumen-refacturas/:id',
        canActivate: [AuthGaurd, VerificaTokenGuard],
        component: ResumenRefacturasComponent
    }



];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FacturarRoutingModule { }