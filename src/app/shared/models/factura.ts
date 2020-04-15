export class Factura {
    FacturaDe: string;
    Solicitante: string;
    Pedido_factura: string;
    FechaRegistro: string;
    FechaVencimiento: string;
    CodTerminos: string;
    EmailEnvio: string;
    NoCopia: boolean;
    Nombre: string;
    Direccion: string;
    CodPostal: string;
    Poblacion: string;
    Provincia: string;
    Contacto: string;
    Total: number;
    IVA: number;
    ImporteIva: number;
    TotalFactura: number;
/*     DetalleFactura: DetalleFactura[]; */
    constructor() {
        this.FacturaDe = '';
        this.Solicitante = '';
        this.Pedido_factura = '';
        this.FechaRegistro = '';
        this.FechaVencimiento = '';
        this.CodTerminos = '';
        this.EmailEnvio = '';
        this.NoCopia = false;
        this.Nombre = '';
        this.Direccion = '';
        this.CodPostal = '';
        this.Poblacion = '';
        this.Provincia = '';
        this.Contacto = '';
        this.Total = 0;
        this.IVA = 0;
        this.ImporteIva = 0;
        this.TotalFactura = 0;
/*         this.DetalleFactura = []; */
    }
}

export class DetalleFactura {
    Solicitud: string;
    Pedido: string;
    OtraInfo: string;
    Servicio: number;
    NombreServicio: string;
    NServicios: string;
    PrecioUnidad: number;
    Coste: number;
}

export class GuardarPreFactura {
    oids: number[];
    factura_a: number;
    oid_prefactura: number;
    email_envio: string;
    pedido: string;
    no_enviar: boolean;

    constructor() {
        this.email_envio = '';
        this.pedido = '';
        this.no_enviar = false;
    }
}

export class GuardarPreAbono {
    oid: number;
    factura_a: number;
    email_envio: string;
    pedido: string;
    no_enviar: boolean;

    constructor() {
        this.email_envio = '';
        this.pedido = '';
        this.no_enviar = false;
    }
}

export class GuardarPreReFactura {
    oid: number;
    factura_a: number;
    email_envio: string;
    pedido: string;
    no_enviar: boolean;

    constructor() {
        this.email_envio = '';
        this.pedido = '';
        this.no_enviar = false;
    }
}

export class NuevaPrefactura {
    cliente: number;
    cliente_facturar: number;

  
}
export class NuevoAbono {
    cliente: number;
    cliente_facturar: number;
    asociado_facturar: boolean;
    abonado: boolean;
    factura?: number;
    pedido: string;
    no_enviar: boolean;
    email_envio: string;

}

export class NuevaRefactura {
    cliente: number;
    cliente_facturar: number;
    asociado_abono: boolean;
    abono?: number;
    pedido: string;
    no_enviar: boolean;
    email_envio: string; 
}

export class MandarFactura {
    oids: number [];
    fecha_factura: string;
}

export class CountFacturas {
    Facturas: number;
    Preabonos: number;
    Abonos: number;
    PreRefacturas: number;
    Refacturas: number;
}

export class ObjetoUnificar  {
    oid: number;
    oids: number[];
}