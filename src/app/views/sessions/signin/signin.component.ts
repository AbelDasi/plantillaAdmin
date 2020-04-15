import { Component, OnInit } from '@angular/core';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { Router, RouteConfigLoadStart, ResolveStart, RouteConfigLoadEnd, ResolveEnd } from '@angular/router';
import { LoginService } from '../../../shared/services/login.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.scss'],
    animations: [SharedAnimations]
})
export class SigninComponent implements OnInit {
    loading: boolean;
    loadingText: string;
    signinForm: FormGroup;
    constructor(
        private fb: FormBuilder,
        private auth: AuthService,
        private router: Router,
        public _login: LoginService,
        private toastr: ToastrService
    ) { }

    ngOnInit() {
        this.router.events.subscribe(event => {
            if (event instanceof RouteConfigLoadStart || event instanceof ResolveStart) {
                this.loadingText = 'Entrando a Fichajes...';

                this.loading = true;
            }
            if (event instanceof RouteConfigLoadEnd || event instanceof ResolveEnd) {
                this.loading = false;
            }
        });

        this.signinForm = this.fb.group({
            Email: ['', Validators.required],
            Password: ['', Validators.required]
        });
    }

   async signin() {
        if (this.signinForm.invalid === false) {
            this.loading = true;
            this.loadingText = 'Entrando a Fichajes';
        /*
        this.auth.signin(this.signinForm.value)
            .subscribe(res => {
                this.router.navigateByUrl('/dashboard/v1');
                this.loading = false;
            });
        */
        const valido = await this._login.validarUsuario(this.signinForm.value);
        if (valido) {
            this.loading = false;
            this.router.navigateByUrl('/dashboard/v1');
            this.loading = false;
         } else {
             this.loading = false;
            this.toastr.error(this._login.mensajeError, 'Incorrecto', { timeOut: 3000 });
         }
        }
    }

}
