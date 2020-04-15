import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { ZonasService } from './zonas.service';
import { Zonas } from 'src/app/shared/models/mantenimientos/zonas';
import { confirm } from 'devextreme/ui/dialog';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-zonas',
  templateUrl: './zonas.component.html',
  styleUrls: ['./zonas.component.scss']
})
export class ZonasComponent implements OnInit {
  @ViewChild('celdaZonas', { static: false }) celdaZonas: any;
  formularioZonas: FormGroup;
  listaZonas: Zonas[] = [];
  zonas: Zonas = new Zonas();
  alturaPantalla: number;
  divPagina: number;
  alturaReferenciaNumber: number;
  alturaReferencia: string;
  popUpZonas: boolean;
  textoBoton: string = 'Crear';

  constructor(private zonasService: ZonasService,
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
    const sumaAltura = diferenciaAltura + this.celdaZonas.nativeElement.offsetHeight - 80;
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
    this.getZonas();
  }

  getZonas() {
    this.zonasService.getZonas().then(data => {
      console.log(data);
      if (data.ok) {
        this.listaZonas = data.zonas;
      }
    });
  }

   //**************************************** */
  //Metodos para el formulario
  //**************************************** */
  crearFormulario() {
    this.formularioZonas= this._formBuilder.group({
      Nombre: ['', [Validators.required]],
      Descripcion: ['', Validators.maxLength(500)],
    });
  }

  setearFormulario(pais:Zonas) {
    this.formularioZonas.controls['Nombre'].setValue(pais.nombre);
    this.formularioZonas.controls['Descripcion'].setValue(pais.descripcion);
  }

  abrirModal(parametro?) {
    this.crearFormulario();

    if (parametro) {
      this.setearFormulario(this.zonas);
      this.textoBoton = 'Modificar'
    }else{
      this.textoBoton = 'Crear'
    }
    this.popUpZonas = true;
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
        name: 'addZona',
        widget: 'dxButton',
        options: {
          icon: 'plus',
          hint: 'Añadir zona',
          elementAttr: { id: 'addZona' },
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
      this.zonasService.getZona(event.data.oid).then(async data => {
        if (data.ok) {
          this.zonas =await data.zonas;
          this.abrirModal('mod');
        }
      });
    }
  }

  elminarZona(oid) {
    console.log(oid);
    confirm('Va a eliminar una zona', '¿Continuar?').then(res => {
      if (res) {
        this.zonasService.eliminarZona(oid).then(data => {
          if (data.ok) {
            this.getZonas();
            this.toastr.success('Eliminado correctamente', 'CORRECTO');
          }
        }, error => {
          console.log(error);
          this.toastr.error('Ha habido un error, consulte con su administracdor', 'ERROR')
        });
      }
    });
  }

  addZona(formulario) {
    if (this.textoBoton === 'Modificar') {
      this.zonas.nombre = formulario.value.Nombre;
      this.zonas.descripcion = formulario.value.Descripcion;
      this.zonasService.modificarZona(this.zonas, this.zonas.oid).then(data => {
        if (data.ok) {
          this.getZonas();
          this.toastr.success('Se ha actualizado la zona correctamente', 'CORRECTO');
          this.popUpZonas= false;
        }
      }, error => {
        console.log(error);
        this.toastr.error('No se ha podido actualizar la zona');
        this.popUpZonas = false;
      });
    } else {
      this.zonas.nombre = formulario.value.Nombre;
      this.zonas.descripcion = formulario.value.Descripcion;
      this.zonas.creationtime = formulario.value.Creationtime;
      this.zonas.lastupdated = formulario.value.Lastupdatetime;

      this.zonasService.crearZona(this.zonas).then(data=> {
        if(data.ok) {
          this.getZonas();
          this.toastr.success('Creado correctamente la zona', 'CORRECTO');
          this.popUpZonas = false;
        }
      }, error => {
        console.log(error);
        this.toastr.error('No se ha podido crear la zona', 'ERROR');
        this.popUpZonas= false;
      });
    }
  }

}
