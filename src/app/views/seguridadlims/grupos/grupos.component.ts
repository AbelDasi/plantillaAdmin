import { Component, OnInit } from '@angular/core';
import { SeguridadService } from '../../../shared/services/seguridad.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-grupos',
  templateUrl: './grupos.component.html',
  styleUrls: ['./grupos.component.scss']
})
export class GruposComponent implements OnInit {
  columnas = [
    { dataField: 'nombre', caption: 'Nombre', allowSorting: false, alignment: 'center',  sortOrder: 'asc',
     cellTemplate: 'cellTemplateNombre' },
    { dataField: 'descripcion', caption: 'Descripción', allowSorting: false, alignment: 'center' },
    { dataField: '', caption: 'Acciones', cellTemplate: 'cellTemplateDelete', allowSorting: false, alignment: 'center' }
  ];
  formGrupo: FormGroup;
  constructor(public _seguridad: SeguridadService,
              private modalService: NgbModal,
              private _formBuilder: FormBuilder) { }

  ngOnInit() {
    this._seguridad.getGrupos();
  }
  mostrarUsuariosDeEstePermiso(data) {
    this._seguridad.popUpGrupo = true;
    this._seguridad.getUsuariosGrupo(data.oid);
  }
  open(content, data) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' })
    .result.then((result) => {
    }, (reason) => {
      console.log('Err!', reason);
    });
  }
  crearFormulario() {
    this.formGrupo = this._formBuilder.group({
        oid: [0, Validators.required],
        nombre : ['', Validators.required],
        descripcion: ['', Validators.required]
    });
  }
  setDatosReserva( ): void {
  //  this.formGrupo.patchValue(this.objetoUsuario);
    }
}
