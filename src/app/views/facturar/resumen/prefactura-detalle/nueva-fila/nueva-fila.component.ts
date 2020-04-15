import { Component, OnInit, Input } from '@angular/core';
import { NuevaFila } from 'src/app/shared/dtos/datosUsuarios';
import { ToastrService } from 'ngx-toastr';
import ArrayStore from 'devextreme/data/array_store';
import { FacturacionService } from '../../../facturacion.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-nuevapre-fila',
  templateUrl: './nueva-fila.component.html',
  styleUrls: ['./nueva-fila.component.scss']
})
export class NuevaFilaPreComponent implements OnInit {
  @Input() public nuevaFila: NuevaFila;
  @Input() public accion: string;
  @Input() public codigos: any[];
  @Input() public oidPrefactura: any;

  lookupData: { paginate: boolean; pageSize: number; store: any[]; };
  servicios: { paginate: boolean; pageSize: number; store: any[]; };
  texto: string;
  serviciosNuevos: any[] = [];
  dataSource: ArrayStore;
  constructor(public facturacion: FacturacionService, private toastr: ToastrService) { }

  ngOnInit() {
    this.obtenerServicios();
    this.filtroClientes();
    this.texto = 'SI';
  }
  ngAfterViewInit() {
    this.deshabilitarScroll();
  }
  obtenerServicios() {
    if (this.accion === 'servicio') {
      this.facturacion.getServicios().then((data: any) => {
        this.servicios = {
          paginate: true,
          pageSize: 20,
          store: data.servicios
        };
      });
    } else {
      this.nuevaFila.servicio_nombre = '999';
    }
  }
  calcularTotal() {
    this.nuevaFila.total = this.nuevaFila.cantidad * this.nuevaFila.precio_unidad;
  }
  filtroClientes() {
    this.lookupData = {
      paginate: true,
      pageSize: 20,
      store: this.codigos
    };
  }
  noFacturar(event) {
    if (event.target.checked) {
      this.texto = 'NO';
    } else {
      this.texto = 'SI'
    }
  }
  addFila(fNuevaFila: NgForm) {
    if (fNuevaFila.invalid) {
      this.toastr.error('Faltan campos por rellenar', 'Error');
      return;
    }
    //  console.log(this.nuevaFila);
    this.nuevaFila.prefactura = this.oidPrefactura;
    this.serviciosNuevos.push(this.nuevaFila);
    if (this.nuevaFila.cantidad === 0 || this.nuevaFila.precio_unidad === 0 || this.nuevaFila.descripcion_facturacion === '') {
      this.toastr.error('Revise los datos y vuelva a intentarlo', 'Error');
      this.serviciosNuevos = [];
    } else {
      this.facturacion.insertarServicios(this.serviciosNuevos).then(data => {
        if (data.ok) {
          this.toastr.success('Servicio añadido con exito');
          this.facturacion.getDetallePrefactura(this.oidPrefactura).then((data: any) => {
            this.facturacion.listaDetalles = data.servicios;
            if (this.facturacion.listaDetalles === data.servicios) {
              this.facturacion.popUpFilaNueva = false;
            }
          });
        }
      });
    }
  }
  servicioCambia(event) {
    const servicio = this.servicios.store.find(key => key.oid === event.value);
    const nombre = servicio.nombre.split('-');
    this.nuevaFila.servicio = servicio.oid;
    this.nuevaFila.descripcion_facturacion = nombre[1];
    this.nuevaFila.servicio_nombre = nombre[0];


  }
  /* recogerCodigo(event) {
    const solicitud = this.lookupData.store.find(key => key.oid === event.value);
    if (solicitud) {
      this.nuevaFila.solicitud = solicitud.codigo;
    }
  } */
  deshabilitarScroll() {
    const input = document.getElementById('numerico1');
    const input2 = document.getElementById('numerico2');

    input.addEventListener('wheel', function (event) {
      event.preventDefault();
    });
    input2.addEventListener('wheel', function (event) {
      event.preventDefault();
    });
  }
}

