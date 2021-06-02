export interface naipe_id {
    success: boolean;
    deck_id: string;
    remaining: number;
    shuffled: boolean;
}

export interface Imagen {
    svg: string;
    png: string;
}

export interface Carta {
    code: string;
    image: string;
    images: Imagen;
    value: string;
    suit: string;
    top?:string;
    left?:string;
    valor?:number;
    visibility?: string;
    volteado?:boolean;
    ultima_lanzada?:boolean;
}

export interface cartas {
    success: boolean;
    deck_id: string;
    cards: Carta[];
    remaining: number;
}

export interface Paquete{
    mano:Carta[],
    mesa:Carta[],
    llevadas:Carta[],
    cartas_puntos:Carta[],
    puntos:number,
    objetivo:string,
    recargar:boolean,
    mano_recargada:Carta[],
    naipe:Carta[]
}