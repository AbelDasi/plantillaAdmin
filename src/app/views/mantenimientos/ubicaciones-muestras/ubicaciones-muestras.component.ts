import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { UbicacionesService } from './ubicaciones.service';
import { Ubicaciones } from 'src/app/shared/models/ubicaciones';
import { LaboratoriesService } from '../laboratorios/laboratories.service';
import { Laboratorios } from 'src/app/shared/models/mantenimientos/laboratorios';
import { confirm } from 'devextreme/ui/dialog';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-ubicaciones-muestras',
  templateUrl: './ubicaciones-muestras.component.html',
  styleUrls: ['./ubicaciones-muestras.component.scss']
})
export class UbicacionesMuestrasComponent implements OnInit {
  @ViewChild('celdaUbicaciones', { static: false }) celdaUbicaciones: any;
  formularioUbicaciones: FormGroup;
  listaUbicaciones: Ubicaciones[] = [];
  ubicacion: Ubicaciones = new Ubicaciones();
  listaLaboratorios: Laboratorios[] = [];
  alturaPantalla: number;
  divPagina: number;
  alturaReferenciaNumber: number;
  alturaReferencia: string;
  popUpUbicaciones: boolean;
  textoBoton: string = 'Crear';
  constructor(private ubicacionService: UbicacionesService,
              private laboratioService: LaboratoriesService,
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
    const sumaAltura = diferenciaAltura + this.celdaUbicaciones.nativeElement.offsetHeight - 80;
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
    this.getUbicaciones();
    this.getLaboratorios();
  }
  getUbicaciones() {
    this.ubicacionService.getUbicaciones().then(data => {
      console.log(data);
      if (data.ok) {
        this.listaUbicaciones = data.ubicaciones;
      }

    });
  }
  getLaboratorios() {
    this.laboratioService.getLaboratorios().then(data => {
      console.log(data);
      if (data.ok) {
        this.listaLaboratorios = data.laboratorios;
        console.log(this.listaLaboratorios);
        
      }
    });
  }
  //**************************************** */
  //Metodos para el formulario
  //**************************************** */
  crearFormulario() {
    this.formularioUbicaciones = this._formBuilder.group({
      Nombre: ['', Validators.required],
      Descripcion: ['', [Validators.maxLength(500)]],
      Laboratorio: ['', [Validators.required, Validators.maxLength(500)]],
      
  });
  }
  setearFormulario(ubicacion:Ubicaciones) {
    this.formularioUbicaciones.controls['Nombre'].setValue(ubicacion.nombre);
    this.formularioUbicaciones.controls['Descripcion'].setValue(ubicacion.descripcion);
    this.formularioUbicaciones.controls['Laboratorio'].setValue(ubicacion.laboratorio);
  }

   abrirModal(parametro?) {
    
    this.crearFormulario();
    if (parametro) {
      this.setearFormulario(this.ubicacion);
      this.textoBoton = 'Modificar'
    }
    this.popUpUbicaciones = true;
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
      event.cellElement.style = `text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;font-size: 13px; text-align:center;`;
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
        name: 'addPrefactura',
        widget: 'dxButton',
        options: {
          icon: 'plus',
          hint: 'Añadir ubicacion',
          elementAttr: { id: 'addUbicacion' },
          onClick: function () {
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
      this.ubicacionService.getUbicacion(event.data.oid).then(async data => {
        if (data.ok) {
          this.ubicacion =await data.ubicaciones;
          this.abrirModal('mod');
        }
      });
    }
    
  }
  elminarUbicacion(oid) {
    console.log(oid);
    confirm('Va a eliminar una ubicación de las muestras', '¿Continuar?').then(res => {
      if (res) {
        this.ubicacionService.eliminarUbicacion(oid).then(data => {
          if (data.ok) {
            this.getUbicaciones();
            this.toastr.success('Eliminado correctamente', 'CORRECTO');
          }
        }, error => {
          console.log(error);
          this.toastr.error('Ha habido un error, consulte con su administracdor', 'ERROR')
          
        });
      }
    });
  }
  addUbicacion(formulario) {
    if (this.textoBoton === 'Modificar') {
      this.ubicacion.descripcion = formulario.value.Descripcion;
      this.ubicacion.nombre = formulario.value.Nombre;
      this.ubicacion.laboratorio =  parseInt(formulario.value.Laboratorio);
      this.ubicacionService.modificarUbicacion(this.ubicacion, this.ubicacion.oid).then(data => {
        if (data.ok) {
          this.getUbicaciones();
          this.toastr.success('Se ha actualizado la ubicación correctamente', 'CORRECTO');
        }
      }, error => {
        console.log(error);
        this.toastr.error('No se ha podido actualizar la ubicación');
      });
    } else {
      this.ubicacion.descripcion = formulario.value.Descripcion;
      this.ubicacion.nombre = formulario.value.Nombre;
      this.ubicacion.laboratorio = parseInt(formulario.value.Laboratorio);
      console.log(JSON.stringify(this.ubicacion));
      
      this.ubicacionService.CrearUbicacion(this.ubicacion).then(data=> {
        if(data.ok) {
          this.getUbicaciones();
          this.toastr.success('Creada correctamente la ubicación', 'CORRECTO');
          this.popUpUbicaciones = false;
        }
      }, error => {
        console.log(error);
        this.toastr.error('No se ha podido crear la ubicación', 'ERROR');
        this.popUpUbicaciones = false;
      });
    }
  }


}
