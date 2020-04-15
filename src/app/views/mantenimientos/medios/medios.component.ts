import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { MediosService } from './medios.service';
import { Medios } from 'src/app/shared/models/mantenimientos/medios';
import { confirm } from 'devextreme/ui/dialog';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-medios',
  templateUrl: './medios.component.html',
  styleUrls: ['./medios.component.scss']
})
export class MediosComponent implements OnInit {
  @ViewChild('celdaMedios', { static: false }) celdaMedios: any;
  formularioMedios: FormGroup;
  listaMedios: Medios[] = [];
  medios: Medios = new Medios();
  alturaPantalla: number;
  divPagina: number;
  alturaReferenciaNumber: number;
  alturaReferencia: string;
  popUpMedios: boolean;
  textoBoton: string = 'Crear';

  constructor(private mediosService: MediosService,
    private toastr: ToastrService,
    private _formBuilder: FormBuilder) { }

  ngOnInit() {
    this.configuracionInicial();
  }
  
  //**************************************** */
  //Este metodo ajusta el grid al alto de la pantalla
  //**************************************** */
  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.alturaPantalla = window.innerHeight;
    const divPagina = document.getElementById('inicio');
    this.divPagina = divPagina.offsetHeight;
    const diferenciaAltura = this.alturaPantalla - this.divPagina;
    const sumaAltura = diferenciaAltura + this.celdaMedios.nativeElement.offsetHeight - 80;
    this.alturaReferenciaNumber = sumaAltura;
    this.alturaReferencia = sumaAltura + 'px';
  }
  
  ngAfterViewInit() {
    setTimeout(() => {
      this.onResize();
    }, 800);
  }

  //**************************************** */
  //Metodos para cargar al inicio todos los datos que queremos
  //**************************************** */
  configuracionInicial() {
    this.alturaReferencia = '500px';
    this.getMedios();
  }

  getMedios() {
    this.mediosService.getMedios().then(data => {
      console.log(data);
      if (data.ok) {
        this.listaMedios = data.medios;
      }
    });
  }

  //**************************************** */
  //Metodos para el formulario
  //**************************************** */
  crearFormulario() {
    this.formularioMedios = this._formBuilder.group({
      Nombre: ['', [Validators.required]],
      Descripcion: ['', [Validators.maxLength(500)]],
    });
  }

  setearFormulario(medios:Medios) {
    this.formularioMedios.controls['Nombre'].setValue(medios.nombre);
    this.formularioMedios.controls['Descripcion'].setValue(medios.descripcion);
}

  abrirModal(parametro?) {
    this.crearFormulario();

    if (parametro) {
      this.setearFormulario(this.medios);
      this.textoBoton = 'Modificar'
    }else{
      this.textoBoton = 'Crear'
    }
    
    this.popUpMedios = true;
  }

  //**************************************** */
  //Metodos para darle el estilo que queremos al grid
  //**************************************** */
  onCellPrepared(event) {
    if (event.rowType === 'header') {
    event.cellElement.style.border = '0px';
    event.cellElement.style = 'color: white;font-weigth: bold;text-align: center;background-color:#0B86CA;border:1px solid white;';
    } else if (event.rowType === 'data') {
      if (event.key.factura_anterior) {
      event.cellElement.style = 'color: #B93518;font-weight: bold;text-align: center;';
      }
      /*event.cellElement.style = `text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;font-size: 13px; text-align:center;`;*/
    }
  }
  onRowPrepared(event) {
    if (event.rowType === 'data') {
      if (event.key.bool_facturacion) {
        // tslint:disable-next-line:no-unused-expression
        event.rowElement.style.background = 'white';
        event.rowElement.style.color = 'green';
        event.rowElement.style.fontWeight = 'bold';
      }
      event.rowElement.style.cursor = 'pointer';
    }
  }
  onToolbarPreparing(event) {
    const esto = this;
    // esto.getPerfiles();
    event.toolbarOptions.items.unshift(
      //
      {
        location: 'after',
        name: 'addMedio',
        widget: 'dxButton',
        options: {
          icon: 'plus',
          hint: 'Añadir Medio',
          elementAttr: { id: 'addMedio' },
          onClick: function () {
            console.log("Hago click a algo");
            esto.abrirModal();
          }
        },
      }
    );
  }
  onCellClick(event) {
    const component = event.component,
    prevClickTime = component.lastClickTime;
    component.lastClickTime = new Date();
    if (prevClickTime && (component.lastClickTime - prevClickTime < 300)) {
      //Double click code  
      console.log(event.data.oid);
      this.mediosService.getMedio(event.data.oid).then(async data => {
        if (data.ok) {
          this.medios =await data.medios;
          this.abrirModal('mod');
        }
      });
    }
  }

  elminarMedio(oid) {
    console.log(oid);
    confirm('Va a eliminar un medio', '¿Continuar?').then(res => {
      if (res) {
        this.mediosService.eliminarMedio(oid).then(data => {
          if (data.ok) {
            this.getMedios();
            this.toastr.success('Eliminado correctamente', 'CORRECTO');
          }
        }, error => {
          console.log(error);
          this.toastr.error('Ha habido un error, consulte con su administracdor', 'ERROR')
        });
      }
    });
  }

  addMedio(formulario) {
    if (this.textoBoton === 'Modificar') {
      this.medios.nombre = formulario.value.Nombre;
      this.medios.descripcion = formulario.value.Descripcion;

      this.mediosService.modificarMedio(this.medios, this.medios.oid).then(data => {
        if (data.ok) {
          this.getMedios();
          this.toastr.success('Se ha actualizado el medio correctamente', 'CORRECTO');
          this.popUpMedios = false;
        }
      }, error => {
        console.log(error);
        this.toastr.error('No se ha podido actualizar el medio');
        this.popUpMedios = false;
      });
    } else {
      this.medios.nombre = formulario.value.Nombre;
      this.medios.descripcion = formulario.value.Descripcion;
      console.log(JSON.stringify(this.medios));
      
      this.mediosService.crearMedio(this.medios).then(data=> {
        if(data.ok) {
          this.getMedios();
          this.toastr.success('Creada correctamente el medio', 'CORRECTO');
          this.popUpMedios = false;
        }
      }, error => {
        console.log(error);
        this.toastr.error('No se ha podido crear el medio', 'ERROR');
        this.popUpMedios= false;
      });
    }
  }
}
