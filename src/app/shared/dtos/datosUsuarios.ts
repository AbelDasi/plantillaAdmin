export class DatosUsuarios {
    oid: string;
    lastupdatetime: string;
    creationtime: string;
    nombre: string;
    login: string;
    password: string;
    color: string;
    usuario_resultados: string;
    correo: string;
    firma: string;
}

export class Permisos {
    matrices: boolean;
    legislacion: boolean;
    laboratorios: boolean;
    tarifas: boolean;
    servicios: boolean;
    ensayos: boolean;
    parametros: boolean;
    procedimientos: boolean;
    tecnicas: boolean;
    unidades: boolean;
    clientes: boolean;
    gruposClientes: boolean;
    usuarios: boolean;
    grupousuarios: boolean;
    solicitudes: boolean;
    muestras: boolean;
    serviciospormuestra: boolean;
    organizaciontrabajo: boolean;
    entradaresultados: boolean;
    validacionfases: boolean;
    plantillas: boolean;
    recogidamuestras: boolean;
    validacionresultados: boolean;
    especificacionescliente: boolean;
    serviciosconplaguicidas: boolean;
    ofertas: boolean;
    cgsa: boolean;
    tipologiasfacturacion: boolean;
    acuerdos: boolean;
    avisosainia: boolean;
    encuestassatisfaccion: boolean;
    banners: boolean;
    campanyasainia: boolean;
    serviciosainia: boolean;
    sectores: boolean;
    avisonuevorecaptado: boolean;
    ubicacioneslaboratorio: boolean;
    diluciones: boolean;
    medios: boolean;
    clasificacion: boolean;
    diluyentes: boolean;
    zonas: boolean;
    comerciales: boolean;
    colores: boolean;
    propuestasacuerdos: boolean;
    responsablesacuerdos: boolean;
    tandas: boolean;
    muestrastanda: boolean;
    ensayosmuestratanda: boolean;
    reactivos: boolean;
    pipetas: boolean;
}

// tslint:disable-next-line:class-name
export class filtrosFacturacion {
    fechainicio?: string;
    fechafin?: string;
    pedido_cabecera?: string;
    referencia_cliente?: string;
    cliente?: string;
    cliente_facturar?: string;
    servicios?: string;
    solicitud?: string;
    fechasbool?: boolean;
    factura?: string;
    abono?: string;

    constructor() {
        this.fechainicio = null;
        this.fechafin = null;
        this.pedido_cabecera = null;
        this.referencia_cliente = null;
         this.cliente = null;
        this.cliente_facturar = null;
        this.servicios = null; 
        this.solicitud = null;
        this.fechasbool = true;
        this.factura = null;
        this.abono = null;
    }
    
}
export class ServiciosDetalles {
    oid: number;
    muestra: string;
    servicio_nombre: string;
    servicio_descripcion: string;
    observaciones: string;
    servicio: number;
    cantidad: number;
    precio_unidad: number;
}
export class DetalleSolicitud {
    oid: number;
    codigo: string;
    codigo_proyecto: string;
    codigo_tarea: string;
    codigo_subtarea: string;
    cliente: string;
    acuerdo: string;
    servicios: ServiciosDetalles[];
}
export class PerfilGrid {
    usuario: number;
    nombre: string;
    configuracion: any;
    pantalla: string;
}
export class PerfilGridMod {
    usuario: number;
    nombre: string;
    configuracion: any;
    oid: number;
}
// tslint:disable-next-line:class-name
export class countFacturacion {
    Inmediata: number;
    Mensual: number;
    Retenida: number;
    SinFacturar: number;
    Prefacturas: number;
    Facturas: number;

    constructor() {
        this.Inmediata = 0;
        this.Mensual = 0;
        this.Retenida = 0;
        this.SinFacturar = 0;
        this.Prefacturas = 0;
    }
}
export class NuevaFila {
    oid:                    number;
    cliente:                number;
    tipo_facturacion:       number;
    solicitud:              string;
    servicio_nombre:        string;
    descripcion_facturacion:   string;
    observaciones:          string;
    servicio:               number;
    cantidad:               number;
    precio_unidad:          number;
    numero_facturacion:     string;
    modifcar_servicio:      boolean;
    oid_solicitud:          number;
    total:                  number;
    tabla:                  string;
    bool_facturacion:       boolean;
    posicion:               string;
    no_facturar:            boolean;
    prefactura:             number;
    abono:                  number;
    refactura:              number;

    constructor(solicitud?, oid_solicitud?, tipo_facturacion?) {
        this.cantidad = 0;
        this.precio_unidad = 0;
        this.servicio_nombre = '';
        this.descripcion_facturacion = '';
/*         this.oid_solicitud = oid_solicitud; */
        this.solicitud = null;
        this.no_facturar = false;
    //    this.oid = 0;
        this.prefactura = null;
    }
}
