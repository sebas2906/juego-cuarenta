import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { naipe_id, cartas, Carta } from '../interfaces/carta';



@Injectable({
  providedIn: 'root'
})
export class CartasService {

  public identificador: string;
  public cartas: cartas;
  public manos: { [key: string]: Carta[] } = {};
  public puntos: Carta[] = [];
  //public mesa: Carta[] = [];
  public posiciones = []; //posiciones de las cartas lanzadas a la mesa movidas
  public posiciones_completas = []; //posiciones originales


  constructor(public http: HttpClient) { }

  /**
   * inicializa un nuevo naipe, lo baraja, crea los puntos y separa las manos
   * segun la cantidad de jugadores seteados
   * @param numero_de_jugadores 
   * indica la cantidad de jugadores
   * @returns
   * devuelve el naipe de la mesa
   */
  async inicializar(numero_de_jugadores: number) {
    if (JSON.parse(localStorage.getItem('cartas'))) {
      //obteniendo de local
      this.cartas = JSON.parse(localStorage.getItem('cartas'));
    } else {
      //obteniendo de api
      this.identificador = <string>await this.nuevoNaipe();
      this.cartas = <cartas>await this.cargarNaipe();
      localStorage.setItem('cartas', JSON.stringify(this.cartas));
    }
    this.cargarPuntos();
    this.cartas.cards = this.barajarNaipe(this.cartas.cards);
    this.asignarValores(this.cartas.cards);
    this.crearManos(numero_de_jugadores);
    return this.cartas.cards;
  }



  //seters y getters

  /**
   * Permite setear una carta del arreglo puntos a la vez
   * @param carta 
   */
   setPunto(carta:Carta){
    carta.volteado=false;
    this.puntos.push(carta);
  }

  /**
   * Setea un arreglo de puntos al arreglo
   * @param puntos 
   */
  setPuntos(puntos:Carta[]){
    this.puntos=[...puntos];
  }

  /**
   * @returns 
   * Obtengo el naipe actual
   * (no incluye a los puntos y manos)
   */
  obtenerNaipe() {
    return this.cartas.cards;
  }

  /**
   * @returns 
   * Obtiene las manos actuales
   */
  obtenerManos() {
    return this.manos;
  }

  /**
   * @returns 
   * Devuelve el arreglo actual de puntos
   */
  obtenerPuntos() {
    return this.puntos;
  }

   /**
   * Elimina una carta del arreglo puntos del servicio
   * @returns 
   * Devuelve la carta borrada
   */
    obtenerPunto(){
      return this.puntos.shift();
    }

  /**
   * Asigno valores a cada carta en orden 
   * @param cartas 
   * cartas a asignar
   */
  asignarValores(cartas: Carta[]) {
    cartas.forEach(carta => {
      if (parseInt(carta.value)) {
        carta.valor = parseInt(carta.value);
      } else {
        switch (carta.value) {
          case "ACE":
            carta.valor = 1;
            break;
          case "JACK":
            carta.valor = 8;
            break;
          case "QUEEN":
            carta.valor = 9;
            break;
          case "KING":
            carta.valor = 10;
            break;
        }
      }
    });
  }

  /**
   * Genera un nuevo naipe y regresa una promesa con el identificador del naipe
   */
  private nuevoNaipe() {
    return new Promise((resolve) => {
      this.http.get("https://deckofcardsapi.com/api/deck/new/?jokers_enabled=true").subscribe((cartas: naipe_id) => {
        resolve(cartas.deck_id);
      });
    });
  }

  /**
   * Baraja un arreglo de naipes de cualquier cantidad
   * @param cartas 
   * Arreglo de cartas 
   */
  barajarNaipe(cartas: Carta[]) {
    return this.shuffle(cartas);
  }

  /**
   * Inicializa un arreglo de jugadores que contiene cada uno 
   * 5 cartas y retira estas del naipe principal
   * @param cantidad_de_jugadores 
   * numero de jugadores
   */
  crearManos(cantidad_de_jugadores: number) {
    let j = 0;
    let arreglo_temporal: Carta[] = [];
    for (let i = 0; i < cantidad_de_jugadores; i++) {
      for (j = j; j < 5 * (i + 1); j++) {
        arreglo_temporal.push(this.cartas.cards[j]);
        this.cartas.cards.splice(j, 1);
      }
      this.manos[i] = arreglo_temporal;
      arreglo_temporal = [];
    }
  }

  /**
   * Carga un arreglo con un naipe del identificador previamente obtenido
   */
  private cargarNaipe() {
    return new Promise((resolve) => {
      this.http.get(`https://deckofcardsapi.com/api/deck/${this.identificador}/draw/?count=54`).subscribe((cartas: cartas) => {
        resolve(cartas);
      });
    });
  }

  /**
   * Carga un arreglo de las cartas correspondientes a los puntos (8,9,10 y jockers)
   * y los retira del naipe principal
   */
  private cargarPuntos() {
    let arreglo_temporal: Carta[] = [];
    this.cartas.cards.forEach((carta: Carta) => {
      if (carta.value === "8" || carta.value === "9" || carta.value === "10" || carta.value === "JOKER") {
        carta.volteado=false;
        this.puntos.push(carta);
      } else {
        arreglo_temporal.push(carta);
      }
    });
    this.cartas.cards = [];
    this.cartas.cards = arreglo_temporal;
  }

  /**
   * Regresa un nuevo arreglo con el contenito ordenado aleatoriamente
   * @param arreglo1 
   * arreglo a ingresar
   */
  shuffle(arreglo1: any) {
    let arreglo = [...arreglo1];
    for (let i = arreglo.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arreglo[i], arreglo[j]] = [arreglo[j], arreglo[i]];
    }
    return arreglo;
  }

  /**
   * Esparce el naipe aleatoriamente en las coordenadas fijadas, devuelve
   * TRUE si no se pueden esparcir mas cartas. Estas coordenadas son seteadas
   * en la ultima carta de la mesa
   * @param mesa 
   * Arreglo de cartas de mesa donde se asignará la nueva posición
   * @param multijugador
   * TRUE setea al metodo en modo multijugador
   */
  esparcir(mesa: Carta[], multijugador=false) {
    this.posiciones_completas = [//posiciones fijas
      {
        top: "51%",
        left: "37%"
      },
      {
        top: "35%",
        left: "21%"
      },
      {
        top: "43%",
        left: "3%"
      },
      {
        top: "58%",
        left: "25%"
      },
      {
        top: "58%",
        left: "15%"
      },
      {
        top: "35%",
        left: "31%"
      },
      {
        top: "36%",
        left: "54%"
      },
      {
        top: "38%",
        left: "43%"
      },
      {
        top: "31%",
        left: "9%"
      },
      {
        top: "50%",
        left: "28%"
      },
      {
        top: "58%",
        left: "2%"
      },
      {
        top: "12%",
        left: "49%"
      },
      {
        top: "52%",
        left: "47%"
      },
      {
        top: "47%",
        left: "55%"
      },
      {
        top: "34%",
        left: "62%"
      }
    ];

    mesa[mesa.length - 1].top = '0%';
    mesa[mesa.length - 1].left = '0%';
    mesa[mesa.length - 1].visibility = 'hidden';
    //Es psoible evitar esto poniendo en el constructor que las posiciones se inicializen
    if (mesa.length <= (multijugador?2:1)) {
      this.posiciones = this.shuffle(this.posiciones_completas);
    }
    if (this.posiciones.length) {
      mesa[mesa.length - 1].top = this.posiciones[0].top;
      mesa[mesa.length - 1].left = this.posiciones[0].left;
      mesa[mesa.length - 1].visibility = 'visible';
      this.posiciones.shift();
    } else {
     console.error("No se puede mostrar mas cartas en la mesa");
      return true;
    }
    return false;
  }

  /**
   * Libera la posición de la carta de la mesa que ha sido retirada para que
   * pueda volver a ser usada por otra carta
   * @param indice 
   * indice de la carta retirada de la mesa
   */
  /* liberarPosicion(indice1: number, indice2: number) {
    this.indices_cartas_retiradas = [indice1, indice2];
  } */

  /**
   * Regresa la información de posición para que pueda ser usada por una nueva carta en la mesa
   * @param mesa 
   * mesa actual del juego
   */
  devolverPosicion(mesa: Carta[]) {
    for (let i = 0; i < this.posiciones_completas.length; i++) {
      let indicador = this.posiciones.findIndex(item => item.top === this.posiciones_completas[i].top);
      if (indicador == -1) {
        indicador = mesa.findIndex(item => item.top === this.posiciones_completas[i].top);
        if (indicador == -1) {
          this.posiciones.push(this.posiciones_completas[i]);
          break;
        }
      }
    }
  }

  /**
   * Invierte las cartas de izquierda a derecha una a la vez
   * @param puntos 
   * Arreglo de cartas de los puntos
   * @returns 
   * Regresa un arreglo con las cartas volteadas retirando 
   * las que no han sido volteadas previamente
   */
  devolverPuntos(puntos:Carta[]){
    /* console.log("Carta volteada");
    let arreglo_invertido=[...puntos];
    arreglo_invertido.reverse();
    let indice=arreglo_invertido.findIndex(element=>element.volteado==true);
    if(indice!=-1){
      puntos[puntos.length-indice].volteado=true;
    }else{
      puntos[0].volteado=true;
    }
    //Devolver los puntos al servicio
    return puntos.filter(element=>element.volteado); */
  }

}