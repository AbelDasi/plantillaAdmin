import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { ParametrosService } from './parametros.service';
import { Parametros } from 'src/app/shared/models/mantenimientos/parametros';
import { confirm } from 'devextreme/ui/dialog';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-parametros',
  templateUrl: './parametros.component.html',
  styleUrls: ['./parametros.component.scss']
})
export class ParametrosComponent implements OnInit {
  @ViewChild('celdaParametros', { static: false }) celdaParametros: any;
  formularioParametros: FormGroup;
  listaParametros: Parametros[] = [];
  parametros: Parametros = new Parametros();
  alturaPantalla: number;
  divPagina: number;
  alturaReferenciaNumber: number;
  alturaReferencia: string;
  popUpParametros: boolean;
  textoBoton: string = 'Crear';

  constructor(private parametrosService: ParametrosService,
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
      const sumaAltura = diferenciaAltura + this.celdaParametros.nativeElement.offsetHeight - 80;
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
      this.getParametros();
    }
  
    getParametros() {
      this.parametrosService.getParametros().then(data => {
        console.log(data);
        if (data.ok) {
          this.listaParametros = data.parametros;
        }
      });
    }

  //**************************************** */
  //Metodos para el formulario
  //**************************************** */
  crearFormulario() {
    this.formularioParametros= this._formBuilder.group({
      Nombre: ['', [Validators.required]],
      Descripcion: ['', Validators.maxLength(500)],
      NombreIngles: ['', [Validators.maxLength(100)]],
      DescripcionIngles: ['', Validators.maxLength(500)],
    });
  }

  setearFormulario(parametros:Parametros) {
    this.formularioParametros.controls['Nombre'].setValue(parametros.nombre);
    this.formularioParametros.controls['Descripcion'].setValue(parametros.descripcion);
    this.formularioParametros.controls['NombreIngles'].setValue(parametros.nombreIngles);
    this.formularioParametros.controls['DescripcionIngles'].setValue(parametros.descripcionIngles);
  }

  abrirModal(parametro?) {
    this.crearFormulario();

    if (parametro) {
      this.setearFormulario(this.parametros);
      this.textoBoton = 'Modificar'
    }else{
      this.textoBoton = 'Crear'
    }
    this.popUpParametros = true;
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
        name: 'addParametro',
        widget: 'dxButton',
        options: {
          icon: 'plus',
          hint: 'Añadir parametro',
          elementAttr: { id: 'addParametro' },
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
      this.parametrosService.getParametro(event.data.oid).then(async data => {
        if (data.ok) {
          this.parametros =await data.parametros;
          this.abrirModal('mod');
        }
      });
    }
  }

  elminarParametro(oid) {
    console.log(oid);
    confirm('Va a eliminar un parametro', '¿Continuar?').then(res => {
      if (res) {
        this.parametrosService.eliminarParametro(oid).then(data => {
          if (data.ok) {
            this.getParametros();
            this.toastr.success('Eliminado correctamente', 'CORRECTO');
          }
        }, error => {
          console.log(error);
          this.toastr.error('Ha habido un error, consulte con su administracdor', 'ERROR')
        });
      }
    });
  }

  addParametro(formulario) {
    if (this.textoBoton === 'Modificar') {
      this.parametros.nombre = formulario.value.Nombre;
      this.parametros.descripcion = formulario.value.Descripcion;
      this.parametros.nombreIngles = formulario.value.NombreIngles;
      this.parametros.descripcionIngles = formulario.value.DescripcionIngles;

      this.parametrosService.modificarParametros(this.parametros, this.parametros.oid).then(data => {
        if (data.ok) {
          this.getParametros();
          this.toastr.success('Se ha actualizado el parametro correctamente', 'CORRECTO');
          this.popUpParametros = false;
        }
      }, error => {
        console.log(error);
        this.toastr.error('No se ha podido actualizar el parametro');
        this.popUpParametros = false;
      });
    } else {
      this.parametros.nombre = formulario.value.Nombre;
      this.parametros.descripcion = formulario.value.Descripcion;
      this.parametros.nombreIngles = formulario.value.NombreIngles;
      this.parametros.descripcionIngles = formulario.value.DescripcionIngles;

      console.log(JSON.stringify(this.parametros));
      
      this.parametrosService.crearParametro(this.parametros).then(data=> {
        if(data.ok) {
          this.getParametros();
          this.toastr.success('Creado correctamente el parametro', 'CORRECTO');
          this.popUpParametros = false;
        }
      }, error => {
        console.log(error);
        this.toastr.error('No se ha podido crear el parametro', 'ERROR');
        this.popUpParametros= false;
      });
    }
  }
}
