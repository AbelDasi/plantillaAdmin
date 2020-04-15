import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { DilucionesService } from './diluciones.service';
import { Diluciones } from 'src/app/shared/models/mantenimientos/diluciones';
import { confirm } from 'devextreme/ui/dialog';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-diluciones',
  templateUrl: './diluciones.component.html',
  styleUrls: ['./diluciones.component.scss']
})
export class DilucionesComponent implements OnInit {
  @ViewChild('celdaDiluciones', { static: false }) celdaDiluciones: any;
  formularioDiluciones: FormGroup;
  listaDiluciones: Diluciones[] = [];
  diluciones: Diluciones = new Diluciones();
  alturaPantalla: number;
  divPagina: number;
  alturaReferenciaNumber: number;
  alturaReferencia: string;
  popUpDiluciones: boolean;
  textoBoton: string = 'Crear';

  constructor(private dilucionesService: DilucionesService,
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
    const sumaAltura = diferenciaAltura + this.celdaDiluciones.nativeElement.offsetHeight - 80;
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
    this.getDiluciones();
  }
  
  getDiluciones() {
    this.dilucionesService.getDiluciones().then(data => {
      console.log(data);
      if (data.ok) {
        this.listaDiluciones = data.diluciones;
      }
    });
  }

  //**************************************** */
  //Metodos para el formulario
  //**************************************** */
  crearFormulario() {
    this.formularioDiluciones = this._formBuilder.group({
      Nombre: ['', [Validators.required]],
      Descripcion: ['', [Validators.maxLength(500)]],
    });
  }

  setearFormulario(diluciones:Diluciones) {
    this.formularioDiluciones.controls['Nombre'].setValue(diluciones.nombre);
    this.formularioDiluciones.controls['Descripcion'].setValue(diluciones.descripcion);
}

  abrirModal(parametro?) {
    this.crearFormulario();

    if (parametro) {
      this.setearFormulario(this.diluciones);
      this.textoBoton = 'Modificar'
    }else{
      this.textoBoton = 'Crear'
    }
    
    this.popUpDiluciones = true;
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
        name: 'addDilucion',
        widget: 'dxButton',
        options: {
          icon: 'plus',
          hint: 'Añadir dilucion',
          elementAttr: { id: 'addDilucion' },
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
      this.dilucionesService.getDilucion(event.data.oid).then(async data => {
        if (data.ok) {
          this.diluciones =await data.diluciones;
          this.abrirModal('mod');
        }
      });
    }
  }

  elminarDilucion(oid) {
    console.log(oid);
    confirm('Va a eliminar una dilucion', '¿Continuar?').then(res => {
      if (res) {
        this.dilucionesService.eliminarDilucion(oid).then(data => {
          if (data.ok) {
            this.getDiluciones();
            this.toastr.success('Eliminado correctamente', 'CORRECTO');
          }
        }, error => {
          console.log(error);
          this.toastr.error('Ha habido un error, consulte con su administracdor', 'ERROR')
        });
      }
    });
  }

  addDilucion(formulario) {
    if (this.textoBoton === 'Modificar') {
      this.diluciones.nombre = formulario.value.Nombre;
      this.diluciones.descripcion = formulario.value.Descripcion;

      this.dilucionesService.modificarDilucion(this.diluciones, this.diluciones.oid).then(data => {
        if (data.ok) {
          this.getDiluciones();
          this.toastr.success('Se ha actualizado la dilucion correctamente', 'CORRECTO');
          this.popUpDiluciones = false;
        }
      }, error => {
        console.log(error);
        this.toastr.error('No se ha podido actualizar la dilucion');
        this.popUpDiluciones = false;
      });
    } else {
      this.diluciones.nombre = formulario.value.Nombre;
      this.diluciones.descripcion = formulario.value.Descripcion;
      console.log(JSON.stringify(this.diluciones));
      
      this.dilucionesService.crearDilucion(this.diluciones).then(data=> {
        if(data.ok) {
          this.getDiluciones();
          this.toastr.success('Creada correctamente el medio', 'CORRECTO');
          this.popUpDiluciones = false;
        }
      }, error => {
        console.log(error);
        this.toastr.error('No se ha podido crear el medio', 'ERROR');
        this.popUpDiluciones= false;
      });
    }
  }
}
