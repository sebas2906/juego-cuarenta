import { Injectable } from '@angular/core';
import { Carta, cartas } from '../interfaces/carta';
import { CartasService } from './cartas.service';

@Injectable({
  providedIn: 'root'
})
export class JugadoresService {
  public mano: Carta[] = [];
  public turno = true;
  public llevadas: Carta[] = [];
  public cartas_puntos: Carta[] = [];
  public puntos = 0;
  public mesa: Carta[] = [];
  public notificacion_info={mensaje:'',color:'',en:false};

  constructor(public cartasService: CartasService) { }

  setMesa(cartas: Carta[]) {
    this.mesa = cartas;
  }

  /**
  * Da una mano de cartas al jugador actual
  * @param cartas 
  * mano de cartas a recibir
  */
  setMano(cartas: Carta[]) {
    this.mano = cartas;
  }

  /**
  * @return 
  * Devuelve la mano actual del jugador
  */
  obtenerMano() {
    return this.mano;
  }

  /**
   * @returns 
   * regresa las llevadas (arreglo de cartas) del jugador
   */
  obtenerLlevadas() {
    return this.llevadas;
  }

  /**
   * @returns 
   * Devuelve el arreglo de puntos del Jugador
   */
  obtenerCartasPuntos() {
    return this.cartas_puntos;
  }

  /**
  * @returns 
  * Devuelve los puntos actuales del jugador
  */
  obtenerPuntos() {
    return this.puntos;
  }

  /**
   * Setea los puntos
   * @param puntos 
   * puntos a setear
   */
  setPuntos(puntos: number) {
    this.puntos = puntos;
  }

  /**
   * Setea el arreglo de puntos
   * @param cartas 
   * Arreglo de puntos
   */
  setCartasPuntos(cartas: Carta[]) {
    this.cartas_puntos = cartas;
  }

  /**
   * Setea el arreglo de llevadas
   * @param llevadas 
   * Arreglo de llevadas a setear
   */
  setLlevadas(llevadas: Carta[]) {
    this.llevadas = llevadas;
  }

  /**
  * Determina si el indice de la carta a evaular es J,Q o K
  * @param ind_carta 
  * indice de la carta a evaluar
  * @returns 
  * Devuelve TRUE si la carta pertenece a J,Q o K
  */
  cartasJQK(ind_carta: number) {
    return (this.mano[ind_carta].valor == 8 || this.mano[ind_carta].valor == 9 || this.mano[ind_carta].valor == 10)
  }

  /**
   * Reordena los puntos del jugador cuando se requiere voltear los puntos
   * y devuelve los excedentes al arreglo de puntos del juego
   */
  reordenarPuntos() {
    if (this.puntos < 10) {
      return;
    }
    let decena = this.puntos % 10;
    let unidad = (this.puntos - decena) / 10;
    let cantidad = unidad + (decena / 2);//cantidad de cartas que conformaran los puntos
    let retirar = this.cartas_puntos.length - cantidad;//cantidad de cartas a retirar de los puntos actuales
    //Devuelvo los puntos sobrantes retirandolos desde atras hacia adelante para no remover las cartas
    //ya volteadas
    for (let i = 0; i < retirar; i++) {
      this.cartasService.setPunto(this.cartas_puntos[(this.cartas_puntos.length - 1) - i]);
      this.cartas_puntos.pop();
    }
    //agregamos mas cartas de ser necesario
    if (retirar < 0) {
      for (let index = 0; index < -retirar; index++) {
        this.cartas_puntos.push(this.cartasService.obtenerPunto());
      }
    }
    //relleno las cartas volteadas
    for (let i = 0; i < unidad; i++) {
      this.cartas_puntos[i].volteado = true;
    }

    //relleno las cartas no volteadas
    for (let i = unidad; i < cantidad; i++) {
      this.cartas_puntos[i].volteado = false
    }
  }

  /**
     * Detecta caida o llevada, si es caida suma los puntos
     * y hace un push al arreglo de puntos
     * @param ind_carta_mesa 
     * indice de la carta a evaluar
     */
  detectarCaida(ind_carta_mesa: number) {
    //Caida
    if ((ind_carta_mesa == this.mesa.length - 1) && (this.mesa[this.mesa.length - 1].ultima_lanzada)) {
      this.cartas_puntos.push(this.cartasService.obtenerPunto());
     /*  this.cartas_puntos.forEach(element => {
        element.top = "80%";
      }); */
      this.puntos = this.puntos + 2;
      this.notificacion_info=this.notificacion('Caida!, +2 puntos','warning');

      //Llevada
    } else {
      //console.log("llevada en", this.mesa[ind_carta_mesa].valor);
    }
  }

  /**
   * Reinicia el marcador de ultima carta lanzada
   */
  reiniciarUltimaLanzada() {
    this.mesa.forEach(element => {
      element.ultima_lanzada = false;
    });
  }

  /**
   * Realiza el conteo de puntos ganados en las llevadas y los agrega tanto
   * a el arreglo de cartas de puntos como a los puntos numéricos
   */
   conteoFinal() {
    this.puntos = this.contarPuntosExtra(this.llevadas, this.puntos);
    this.cargarPuntosExtra(this.puntos);
  }

  /**
   * LLevo las cartas de la mesa que cumplan con caida llevada 
   * o suma y las cartas en serie
   * @param ind_carta_mesa 
   * indice de la carta de la mesa seleccionada
   * @param modo_suma 
   * TRUE lleva la cantidad de cartas del arreglo indice
   * @param indice 
   * arreglo de los indices de las cartas de la mesa a ser
   * llevaddos (para el modo suma)
   */
  llevarCartas(ind_carta_mesa: number, modo_suma = false, indice?: number[]) {
    //llevo la carta lanzada de la mano
    if (modo_suma) {
      //llevo las cartas implicadas y las borro
      indice.forEach(element => {
        this.llevadas.push(this.mesa[element]);
      });
      //remuevo el valor que coincida con el elemento del indice
      for (let i = 0; i < indice.length; i++) {
        let ind = this.mesa.findIndex(element => this.llevadas[this.llevadas.length - (i + 1)].valor === element.valor);
        this.mesa.splice(ind, 1);
        this.cartasService.devolverPosicion(this.mesa);
      }
    } else {
      this.llevadas.push(this.mesa[ind_carta_mesa]);
      this.mesa.splice(ind_carta_mesa, 1);
      this.cartasService.devolverPosicion(this.mesa);
    }
    //En comun
    this.llevadas.push(this.mesa[this.mesa.length - 1]);
    let ultima_carta = this.mesa.splice(this.mesa.length - 1, 1);
    this.cartasService.devolverPosicion(this.mesa);
    this.llevarCartasExtra(ultima_carta[0]);
  }

  /**
   * Cuenta los puntos ganados extras de las llevadas
   * @param llevadas 
   * llevadas del jugador
   * @param puntos 
   * puntos actuales del jugador
   * @returns 
   * devuelve los puntos que ya tenia el jugador mas los puntos ganados
   */
  contarPuntosExtra(llevadas: Carta[], puntos: number) {
    if (llevadas.length > 19) {
      let total_puntos = (llevadas.length - 19) + 5;
      if (!(total_puntos % 2)) {
        puntos += total_puntos;
      } else {
        puntos += total_puntos + 1;
      }
    } else {
      console.warn("Las llevadas no suman puntos");
    }
    return puntos;
  }

  /**
  * Borra todos los puntos del jugador y los vuelve a cargar 
  * con el valor especificado
  * @param puntos 
  * puntos a agregar
  */
  cargarPuntosExtra(puntos: number) {
    this.cartas_puntos.forEach(element => {
      this.cartasService.setPunto(element);
    });
    this.cartas_puntos.splice(0, this.cartas_puntos.length);

    if (puntos < 10) {
      for (let i = 0; i < (puntos / 2); i++) {
        this.cartas_puntos.push(this.cartasService.obtenerPunto());
      }
    } else {
      let str = puntos.toString();
      let num1 = Number(str.slice(0, 1));
      let num2 = Number(str.slice(1));
      for (let i = 0; i < num1; i++) {
        this.cartas_puntos.push(this.cartasService.obtenerPunto());
        this.cartas_puntos[i].volteado = true;
      }
      for (let i = 0; i < (num2 / 2); i++) {
        this.cartas_puntos.push(this.cartasService.obtenerPunto());
      }
    }
  }

  /**
   * Lleva las cartas extra en serie de la ultima carta lanzada por 
   * un jugador
   * @param carta 
   * ultima carta lanzada por algun jugador
   */
  llevarCartasExtra(carta: Carta) {
    let valor = carta.valor;
    //evito que sea alterado mesa.length en cada iteracion
    let cantidad_mesa = this.mesa.length;
    for (let i = 0; i < cantidad_mesa; i++) {
      valor++;
      let indice = this.mesa.findIndex(item => item.valor == valor);
      if (indice != -1) {
        this.llevadas.push(this.mesa[indice]);
        this.mesa.splice(indice, 1);
        this.cartasService.devolverPosicion(this.mesa);
      } else {
        break;
      }
    }
    //Limpia
    if (!this.mesa.length) {
      this.puntos = this.puntos + 2;
      this.cartas_puntos.push(this.cartasService.obtenerPunto());
      this.notificacion_info=this.notificacion('Limpia!, +2 puntos','warning');
    }
  }

  /**
   * Detecta eventos relacionados al conteo de puntos
   * @returns 
   * TRUE si el jugador ha ganado
   */
  contarPuntos(){
    if(this.puntos>=40){
      return true;
    }
    return false;
  }

  notificacion(mensaje,color){
    let en=true;
    return {mensaje,color,en};
  }

}
