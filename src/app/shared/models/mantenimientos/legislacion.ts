export class Legislacion {
    oid?: number;
    nombre: string;
    descripcion: string;
    alias: string;
    descripcionIngles:string;

    constructor () {
        this.nombre = null;
        this.descripcion = null;
        this.alias = null;
        this.descripcionIngles = null;
    }
}