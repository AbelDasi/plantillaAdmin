import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MetodosService {

  constructor() { }
  formatearArrayAString(cadena) {
    const cadenas: any = cadena;
    let montajeCadena = '';
    for (const item of cadenas) {
      montajeCadena += item + ',';
    }
    const montajeCadena1 = montajeCadena.slice(0, -1);
    return montajeCadena1;
  }
  formatFech(parametro) {
    if (parametro === null) {
      return '';
    }
    const particion = parametro.split('-');
    const subCadena = particion[2].substring(0, 2);
    const FechaLimpia = subCadena + '-' + particion[1] + '-' + particion[0];
    return FechaLimpia;

  }
  compare(a, b) {
    if (a.nombre < b.nombre) {
      return -1;
    }
    if (a.nombre > b.nombre) {
      return 1;
    }
    return 0;
  }
}
