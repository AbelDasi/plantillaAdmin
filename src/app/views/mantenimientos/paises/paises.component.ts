import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { PaisesService } from './paises.service';
import { Paises } from 'src/app/shared/models/mantenimientos/paises';
import { confirm } from 'devextreme/ui/dialog';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-paises',
  templateUrl: './paises.component.html',
  styleUrls: ['./paises.component.scss']
})
export class PaisesComponent implements OnInit {
  @ViewChild('celdaPaises', { static: false }) celdaPaises: any;
  formularioPaises: FormGroup;
  listaPaises: Paises[] = [];
  pais: Paises = new Paises();
  alturaPantalla: number;
  divPagina: number;
  alturaReferenciaNumber: number;
  alturaReferencia: string;
  popUpPaises: boolean;
  textoBoton: string = 'Crear';

  constructor(private paisService: PaisesService,
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
    const sumaAltura = diferenciaAltura + this.celdaPaises.nativeElement.offsetHeight - 80;
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
    this.getPaises();
  }

  getPaises() {
    this.paisService.getPaises().then(data => {
      console.log(data);
      if (data.ok) {
        this.listaPaises = data.paises;
      }
    });
  }

  //**************************************** */
  //Metodos para el formulario
  //**************************************** */
  crearFormulario() {
    this.formularioPaises= this._formBuilder.group({
      Nombre: ['', [Validators.required]],
      Descripcion: ['', Validators.maxLength(500)],
      PesoKilogramos: ['', Validators.required],
    });
  }

  setearFormulario(pais:Paises) {
    this.formularioPaises.controls['Nombre'].setValue(pais.nombre);
    this.formularioPaises.controls['Descripcion'].setValue(pais.descripcion);
    this.formularioPaises.controls['PesoKilogramos'].setValue(pais.pesoKilogramos);
  }

  abrirModal(parametro?) {
    this.crearFormulario();

    if (parametro) {
      this.setearFormulario(this.pais);
      this.textoBoton = 'Modificar'
    }else{
      this.textoBoton = 'Crear'
    }
    this.popUpPaises = true;
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
        name: 'addPais',
        widget: 'dxButton',
        options: {
          icon: 'plus',
          hint: 'Añadir pais',
          elementAttr: { id: 'addPais' },
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
      this.paisService.getPais(event.data.oid).then(async data => {
        if (data.ok) {
          this.pais =await data.paises;
          this.abrirModal('mod');
        }
      });
    }
  }

  elminarPais(oid) {
    console.log(oid);
    confirm('Va a eliminar un pais', '¿Continuar?').then(res => {
      if (res) {
        this.paisService.eliminarPais(oid).then(data => {
          if (data.ok) {
            this.getPaises();
            this.toastr.success('Eliminado correctamente', 'CORRECTO');
          }
        }, error => {
          console.log(error);
          this.toastr.error('Ha habido un error, consulte con su administracdor', 'ERROR')
        });
      }
    });
  }

  addPais(formulario) {
    if (this.textoBoton === 'Modificar') {
      this.pais.nombre = formulario.value.Nombre;
      this.pais.descripcion = formulario.value.Descripcion;
      this.pais.pesoKilogramos = formulario.value.PesoKilogramos;
      this.paisService.modificarPais(this.pais, this.pais.oid).then(data => {
        if (data.ok) {
          this.getPaises();
          this.toastr.success('Se ha actualizado el pais correctamente', 'CORRECTO');
          this.popUpPaises = false;
        }
      }, error => {
        console.log(error);
        this.toastr.error('No se ha podido actualizar el pais');
        this.popUpPaises = false;
      });
    } else {
      this.pais.nombre = formulario.value.Nombre;
      this.pais.descripcion = formulario.value.Descripcion;
      this.pais.pesoKilogramos = formulario.value.PesoKilogramos;
      console.log(this.pais.pesoKilogramos);
      console.log(JSON.stringify(this.pais));
      
      this.paisService.crearPais(this.pais).then(data=> {
        if(data.ok) {
          this.getPaises();
          this.toastr.success('Creado correctamente el pais', 'CORRECTO');
          this.popUpPaises = false;
        }
      }, error => {
        console.log(error);
        this.toastr.error('No se ha podido crear el pais', 'ERROR');
        this.popUpPaises= false;
      });
    }
  }
}
