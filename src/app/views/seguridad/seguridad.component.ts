import { Component, OnInit } from '@angular/core';
import { SeguridadService } from '../../shared/services/seguridad.service';
import { confirm } from 'devextreme/ui/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-seguridad',
  templateUrl: './seguridad.component.html',
  styleUrls: ['./seguridad.component.scss']
})
export class SeguridadComponent implements OnInit {
  columnas = [
    { dataField: 'nombre', caption: 'Nombre', allowSorting: false, alignment: 'center',  sortOrder: 'asc' },
    { dataField: 'login', caption: 'Login', allowSorting: false, alignment: 'center'},
    { dataField: 'color', caption: 'Color', allowSorting: false, alignment: 'center', cellTemplate: 'cellTemplateColor' },
    { dataField: 'correo', caption: 'Correo', allowSorting: false, alignment: 'center'},
    { dataField: '', caption: 'Acciones', cellTemplate: 'cellTemplateDelete', alignment: 'center', width: '100'}
  ];
  objetoUsuario: any;
  parametro: string;
  imagenSubir: any;
  imagenTemp: string | ArrayBuffer;
  constructor(public _seguridad: SeguridadService,
              private modalService: NgbModal,
              private _formBuilder: FormBuilder,
              private toastr: ToastrService) { }
  formUsuario: FormGroup;
  ngOnInit() {
    this._seguridad.getUsuarios();
  }
  eliminarUsuario(oid) {
    confirm('El usuario sera eliminado permanentemente', '¿Está seguro/a?').then(res => {
      if (res === true) {
        this._seguridad.deleteUsuario(oid).then(data => {
          if (data.ok) {
            this.toastr.success(data.msg, 'Correcto', { timeOut: 3000 });
            this._seguridad.getUsuarios();
          }
        }, error => {
          if (!error.error.ok) {
            this.toastr.error(error.error.msg, 'Error', { timeOut: 3000 });
          }
        });
      }
    });
  }
  open(content, data) {
    this._seguridad.getUsuario(data.oid).then(data1 => {
      this.objetoUsuario = data1.user;
      this.parametro = 'mod';
      if (this.objetoUsuario === data1.user) {
        this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' })
        .result.then((result) => {
      // console.log(result);
        }, (reason) => {
       // console.log('Err!', reason);
        });
        this.crearFormulario();
        this.setDatosReserva();
      }
    });
  }
  crearFormulario() {
    this.formUsuario = this._formBuilder.group({
        oid: [0, Validators.required],
        nombre : ['', Validators.required],
        login : ['', Validators.required],
        password : ['', Validators.required],
        color : [''],
        usuario_resultados: [-1],
        correo : ['']
    });
  }
  setDatosReserva( ): void {
    this.formUsuario.patchValue(this.objetoUsuario);
    }
    ModificarUsuario(formUsuario , parametro) {
      console.log('parametro', parametro);
      if (parametro === 'mod') {
        if (formUsuario.value.color.includes('#')) {
          const colorNum = formUsuario.value.color.split('#');
          console.log(colorNum);
          const colorNum1 = colorNum[1];
          this.formUsuario.value.color = colorNum1;
        }
        this._seguridad.modificarUsuario(formUsuario.value).then(data => {
          if (data.ok) {
         //   this.subirImagen();
            this.modalService.dismissAll();
            this._seguridad.getUsuarios();
            this.toastr.success('Usuario modificado correctamente', 'Correcto', { timeOut: 3000 });
          }
        });
      } else {
        if (formUsuario.value.color.includes('#')) {
          const colorNum = formUsuario.value.color.split('#');
          console.log(colorNum);
          const colorNum1 = colorNum[1];
          this.formUsuario.value.color = colorNum1;
        }
        this._seguridad.AltaUsuario(formUsuario.value).then(data => {
          if (data.ok) {
            this.objetoUsuario = data.usuario;
            if (this.objetoUsuario === data.usuario) {
            this.modalService.dismissAll();
            this._seguridad.getUsuarios();
            this.toastr.success('Usuario dado de alta correctamente', 'Correcto', { timeOut: 3000 });
        //    this.subirImagen();
            }
           }
        });
      }
    }
    open1(content) {
      this.parametro = 'alta';
      this.crearFormulario();
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' })
    .result.then((result) => {
  // console.log(result);
    }, (reason) => {
   // console.log('Err!', reason);
    });
    }

    seleccionImage( archivo: File ) {
      console.log(archivo);

      if ( !archivo ) {
        this.imagenSubir = null;
        return;
      }
      if ( archivo.type.indexOf('image') < 0 ) {
      //  swal('Sólo imágenes', 'El archivo seleccionado no es una imagen', 'error');
        this.toastr.error('El archivo seleccionado no es una imagen', 'Error');
        this.imagenSubir = null;
        return;
      }

      this.imagenSubir = archivo;

      const reader = new FileReader();
      const urlImagenTemp = reader.readAsDataURL( archivo );

      reader.onloadend = () => this.imagenTemp = reader.result;
    //  this.subirImagen();
    }
    /*
    subirImagen() {
      if (this.imagenSubir !== null) {
        this._seguridad.subirArchivo( this.imagenSubir, 'usuarios', this.objetoUsuario.oid )
            .then( data => {

              if (data.ok) {
                this.toastr.success('Imagen subida');
              } else {
                this.toastr.error('No se ha podido subir la imagen');
              }

            })
            .catch( err => {
              console.log( 'Error en la carga... ');
            });

      }
    }
    */


}
