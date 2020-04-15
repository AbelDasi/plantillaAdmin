import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { AcronimosService } from './acronimos.service';
import { Acronimos } from 'src/app/shared/models/mantenimientos/acronimos';
import { MaquinasService } from '../maquinas/maquinas.service';
import { Maquinas } from 'src/app/shared/models/mantenimientos/maquinas';
import { confirm } from 'devextreme/ui/dialog';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-acronimos',
  templateUrl: './acronimos.component.html',
  styleUrls: ['./acronimos.component.scss']
})
export class AcronimosComponent implements OnInit {
  @ViewChild('celdaAcronimos', { static: false }) celdaAcronimos: any;
  formularioAcronimos: FormGroup;
  listaAcronimos: Acronimos[] = [];
  acronimos: Acronimos = new Acronimos();
  listaMaquinas: Maquinas[] = [];
  alturaPantalla: number;
  divPagina: number;
  alturaReferenciaNumber: number;
  alturaReferencia: string;
  popUpAcronimos: boolean;
  textoBoton: string = 'Crear';

  constructor(private acronimosService: AcronimosService,
    private maquinasService: MaquinasService,
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
      const sumaAltura = diferenciaAltura + this.celdaAcronimos.nativeElement.offsetHeight - 80;
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
      this.getAcronimos();
      this.getMaquinas();
    }
    getAcronimos() {
      this.acronimosService.getAcronimos().then(data => {
        console.log(data);
        if (data.ok) {
          this.listaAcronimos = data.acronimos;
        }
  
      });
    }
    getMaquinas() {
      this.maquinasService.getMaquinas().then(data => {
        console.log(data);
        if (data.ok) {
          this.listaMaquinas = data.maquinas;
          console.log(this.listaMaquinas);
          
        }
      });
    }

    //**************************************** */
  //Metodos para el formulario
  //**************************************** */
  crearFormulario() {
    this.formularioAcronimos = this._formBuilder.group({
      Nombre: ['', Validators.required],
      Descripcion: ['', [Validators.maxLength(500)]],
      Maquinas: ['', [Validators.required]],
      
  });
  }
  setearFormulario(acronimos:Acronimos) {
    this.formularioAcronimos.controls['Nombre'].setValue(acronimos.nombre);
    this.formularioAcronimos.controls['Descripcion'].setValue(acronimos.descripcion);
    this.formularioAcronimos.controls['Maquinas'].setValue(acronimos.maquina);
  }

   abrirModal(parametro?) {
    
    this.crearFormulario();
    if (parametro) {
      this.setearFormulario(this.acronimos);
      this.textoBoton = 'Modificar'
    }
    this.popUpAcronimos = true;
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
        name: 'addAcronimo',
        widget: 'dxButton',
        options: {
          icon: 'plus',
          hint: 'Añadir acronimo',
          elementAttr: { id: 'addAcronimo' },
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
      this.acronimosService.getAcronimo(event.data.oid).then(async data => {
        if (data.ok) {
          this.acronimos =await data.acronimos;
          this.abrirModal('mod');
        }
      });
    } 
  }

  elminarAcronimo(oid) {
    console.log(oid);
    confirm('Va a eliminar un acronimo', '¿Continuar?').then(res => {
      if (res) {
        this.acronimosService.eliminarAcronimo(oid).then(data => {
          if (data.ok) {
            this.getAcronimos();
            this.toastr.success('Eliminado correctamente', 'CORRECTO');
          }
        }, error => {
          console.log(error);
          this.toastr.error('Ha habido un error, consulte con su administracdor', 'ERROR')
          
        });
      }
    });
  }
  addAcronimo(formulario) {
    if (this.textoBoton === 'Modificar') {
      this.acronimos.descripcion = formulario.value.Descripcion;
      this.acronimos.nombre = formulario.value.Nombre;
      this.acronimos.maquina =  formulario.value.Maquinas;

      this.acronimosService.modificarAcronimo(this.acronimos, this.acronimos.oid).then(data => {
        if (data.ok) {
          this.getAcronimos();
          this.toastr.success('Se ha actualizado el acronimo correctamente', 'CORRECTO');
          this.popUpAcronimos = false;
        }
      }, error => {
        console.log(error);
        this.toastr.error('No se ha podido actualizar la ubicación');
        this.popUpAcronimos = false;
      });
    } else {
      this.acronimos.descripcion = formulario.value.Descripcion;
      this.acronimos.nombre = formulario.value.Nombre;
      this.acronimos.maquina = formulario.value.Maquinas;

      console.log(JSON.stringify(this.acronimos));
      
      this.acronimosService.crearAcronimo(this.acronimos).then(data=> {
        if(data.ok) {
          this.getAcronimos();
          this.toastr.success('Creada correctamente el acronimo', 'CORRECTO');
          this.popUpAcronimos = false;
        }
      }, error => {
        console.log(error);
        this.toastr.error('No se ha podido crear el acronimo', 'ERROR');
        this.popUpAcronimos = false;
      });
    }
  }
}
