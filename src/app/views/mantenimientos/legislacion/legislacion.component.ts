import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { LegislacionService } from './legislacion.service';
import { Legislacion } from 'src/app/shared/models/mantenimientos/legislacion';
import { confirm } from 'devextreme/ui/dialog';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-legislacion',
  templateUrl: './legislacion.component.html',
  styleUrls: ['./legislacion.component.scss']
})
export class LegislacionComponent implements OnInit {
  @ViewChild('celdaLegislaciones', { static: false }) celdaLegislaciones: any;
  formularioLegislaciones: FormGroup;
  listaLegislaciones: Legislacion[] = [];
  legislacion: Legislacion = new Legislacion();
  alturaPantalla: number;
  divPagina: number;
  alturaReferenciaNumber: number;
  alturaReferencia: string;
  popUpLegislaciones: boolean;
  textoBoton: string = 'Crear';

  constructor(private legislacionService: LegislacionService,
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
      const sumaAltura = diferenciaAltura + this.celdaLegislaciones.nativeElement.offsetHeight - 80;
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
    this.getLegislaciones();
  }

  getLegislaciones() {
    this.legislacionService.getLegislaciones().then(data => {
      console.log(data);
      if (data.ok) {
        this.listaLegislaciones = data.legislaciones;
      }
    });
  }

  //**************************************** */
  //Metodos para el formulario
  //**************************************** */
  crearFormulario() {
    this.formularioLegislaciones = this._formBuilder.group({
      Nombre: ['', [Validators.required]],
      Descripcion: ['', [Validators.required, Validators.maxLength(500)]],
      Alias: ['', [Validators.required]],
      DescripcionIngles: ['', Validators.maxLength(500)],
    });
  }

  setearFormulario(legislacion:Legislacion) {
    this.formularioLegislaciones.controls['Nombre'].setValue(legislacion.nombre);
    this.formularioLegislaciones.controls['Descripcion'].setValue(legislacion.descripcion);
    this.formularioLegislaciones.controls['Alias'].setValue(legislacion.alias);
    this.formularioLegislaciones.controls['DescripcionIngles'].setValue(legislacion.descripcionIngles);
  }

  abrirModal(parametro?) {
    this.crearFormulario();

    if (parametro) {
      this.setearFormulario(this.legislacion);
      this.textoBoton = 'Modificar'
    }else{
      this.textoBoton = 'Crear'
    }
    
    this.popUpLegislaciones = true;
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
        name: 'addLegislacion',
        widget: 'dxButton',
        options: {
          icon: 'plus',
          hint: 'Añadir legislacion',
          elementAttr: { id: 'addLegislacion' },
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
      this.legislacionService.getLegislacion(event.data.oid).then(async data => {
        if (data.ok) {
          this.legislacion =await data.legislaciones;
          this.abrirModal('mod');
        }
      });
    }
  }

  elminarLegislacion(oid) {
    console.log(oid);
    confirm('Va a eliminar una legislacion', '¿Continuar?').then(res => {
      if (res) {
        this.legislacionService.eliminarLegislacion(oid).then(data => {
          if (data.ok) {
            this.getLegislaciones();
            this.toastr.success('Eliminado correctamente', 'CORRECTO');
          }
        }, error => {
          console.log(error);
          this.toastr.error('Ha habido un error, consulte con su administracdor', 'ERROR')
        });
      }
    });
  }

  addLegislacion(formulario) {
    if (this.textoBoton === 'Modificar') {
      this.legislacion.nombre = formulario.value.Nombre;
      this.legislacion.descripcion = formulario.value.Descripcion;
      this.legislacion.alias = formulario.value.Alias;
      this.legislacion.descripcionIngles = formulario.value.DescripcionIngles;

      this.legislacionService.modificarLegislacion(this.legislacion, this.legislacion.oid).then(data => {
        if (data.ok) {
          this.getLegislaciones();
          this.toastr.success('Se ha actualizado la observacion correctamente', 'CORRECTO');
          this.popUpLegislaciones = false;
        }
      }, error => {
        console.log(error);
        this.toastr.error('No se ha podido actualizar la observacion');
        this.popUpLegislaciones = false;
      });
    } else {
      this.legislacion.nombre = formulario.value.Nombre;
      this.legislacion.descripcion = formulario.value.Descripcion;
      this.legislacion.alias = formulario.value.Alias;
      this.legislacion.descripcionIngles = formulario.value.DescripcionIngles;
      console.log(JSON.stringify(this.legislacion));
      
      this.legislacionService.crearLegislacion(this.legislacion).then(data=> {
        if(data.ok) {
          this.getLegislaciones();
          this.toastr.success('Creada correctamente la legislacion', 'CORRECTO');
          this.popUpLegislaciones = false;
        }
      }, error => {
        console.log(error);
        this.toastr.error('No se ha podido crear la legislacion', 'ERROR');
        this.popUpLegislaciones= false;
      });
    }
  }
}
