import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { LoginService } from './login.service';
import { Router } from '@angular/router';

@Injectable()
export class VerificaTokenGuard implements CanActivate {

  constructor(
    public _usuarioService: LoginService,
    private router: Router
  ) { }

  canActivate(): Promise<boolean> | boolean {


    const token = this._usuarioService.getToken();
    const payload = JSON.parse( atob( token.split('.')[1] ));

    const expirado = this.expirado( payload.exp );
    
    if ( expirado ) {
      this.router.navigateByUrl('/sessions/signin');
      return false;
    } else {
      
    }


    return this.verificaRenueva( payload.exp );
  }


  verificaRenueva( fechaExp: number ): Promise<boolean>  {

    return new Promise( (resolve, reject) => {

      const tokenExp = new Date( fechaExp * 1000 );
      const ahora = new Date();

      ahora.setTime( ahora.getTime() + ( 1 * 60 * 60 * 1000 ) );

      // console.log( tokenExp );
      // console.log( ahora );

      if ( tokenExp.getTime() > ahora.getTime() ) {
        resolve(true);
      } else {
        
        
        this._usuarioService.renuevaToken()
              .then( () => {
                resolve(true);
              }, () => {
                this.router.navigate(['/login']);
                reject(false);
              });
      }

    });

  }


  expirado( fechaExp: number ) {

    const ahora = new Date().getTime() / 1000;

    if ( fechaExp < ahora ) {
      return true;
    } else {
      return false;
    }


  }



}

