import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { ObservacionesService } from './observaciones.service';
import { Observaciones } from 'src/app/shared/models/mantenimientos/observaciones';
import { confirm } from 'devextreme/ui/dialog';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-observaciones',
  templateUrl: './observaciones.component.html',
  styleUrls: ['./observaciones.component.scss']
})
export class ObservacionesComponent implements OnInit {
  @ViewChild('celdaObservaciones', { static: false }) celdaObservaciones: any;
  formularioObservaciones: FormGroup;
  listaObservaciones: Observaciones[] = [];
  observacion: Observaciones = new Observaciones();
  alturaPantalla: number;
  divPagina: number;
  alturaReferenciaNumber: number;
  alturaReferencia: string;
  popUpObservaciones: boolean;
  textoBoton: string = 'Crear';

  constructor(private observacionService: ObservacionesService,
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
    const sumaAltura = diferenciaAltura + this.celdaObservaciones.nativeElement.offsetHeight - 80;
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
    this.getObservaciones();
  }

  getObservaciones() {
    this.observacionService.getObservaciones().then(data => {
      console.log(data);
      if (data.ok) {
        this.listaObservaciones = data.observaciones;
      }
    });
  }

  //**************************************** */
  //Metodos para el formulario
  //**************************************** */
  crearFormulario() {
    this.formularioObservaciones = this._formBuilder.group({
      Filtro: ['', [Validators.required]],
      Texto: ['', Validators.required],
    });
  }

  setearFormulario(observacion:Observaciones) {
    this.formularioObservaciones.controls['Filtro'].setValue(observacion.filtro);
    this.formularioObservaciones.controls['Texto'].setValue(observacion.texto);
  }

  abrirModal(parametro?) {
    this.crearFormulario();

    if (parametro) {
      this.setearFormulario(this.observacion);
      this.textoBoton = 'Modificar'
    }else{
      this.textoBoton = 'Crear'
    }
    
    this.popUpObservaciones = true;
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
        name: 'addObservacion',
        widget: 'dxButton',
        options: {
          icon: 'plus',
          hint: 'Añadir observacion',
          elementAttr: { id: 'addObservacion' },
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
      this.observacionService.getObservacion(event.data.oid).then(async data => {
        if (data.ok) {
          this.observacion =await data.obsevaciones;
          this.abrirModal('mod');
        }
      });
    }
  }

  elminarObservacion(oid) {
    console.log(oid);
    confirm('Va a eliminar una observacion', '¿Continuar?').then(res => {
      if (res) {
        this.observacionService.eliminarObservacion(oid).then(data => {
          if (data.ok) {
            this.getObservaciones();
            this.toastr.success('Eliminado correctamente', 'CORRECTO');
          }
        }, error => {
          console.log(error);
          this.toastr.error('Ha habido un error, consulte con su administracdor', 'ERROR')
        });
      }
    });
  }

  addObservacion(formulario) {
    if (this.textoBoton === 'Modificar') {
      this.observacion.texto = formulario.value.Texto;
      this.observacion.filtro = formulario.value.Filtro;
      this.observacionService.modificarObservacion(this.observacion, this.observacion.oid).then(data => {
        if (data.ok) {
          this.getObservaciones();
          this.toastr.success('Se ha actualizado la observacion correctamente', 'CORRECTO');
        }
      }, error => {
        console.log(error);
        this.toastr.error('No se ha podido actualizar la observacion');
      });
    } else {
      this.observacion.texto = formulario.value.Texto;
      this.observacion.filtro = formulario.value.Filtro;
      console.log(JSON.stringify(this.observacion));
      
      this.observacionService.crearObservacion(this.observacion).then(data=> {
        if(data.ok) {
          this.getObservaciones();
          this.toastr.success('Creada correctamente la observacion', 'CORRECTO');
          this.popUpObservaciones = false;
        }
      }, error => {
        console.log(error);
        this.toastr.error('No se ha podido crear la observacion', 'ERROR');
        this.popUpObservaciones= false;
      });
    }
  }

}
