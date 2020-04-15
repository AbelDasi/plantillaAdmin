export class Parametros {
    oid?: number;
    nombre: string;
    descripcion: string;
    nombreIngles:string;
    descripcionIngles:string;
    
    constructor () {
        this.nombre = null;
        this.descripcion = null;
        this.nombreIngles=null;
        this.descripcionIngles=null;
    }
}