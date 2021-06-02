import { Injectable } from '@angular/core';
import { Carta } from '../interfaces/carta';
import { JugadoresService } from './jugadores.service';

@Injectable({
  providedIn: 'root',
})


export class JugadorService extends JugadoresService {

  //Parametros
  public colocarCarta = new Audio('assets/sonidos/mesa/poner.mp3');
  public sel = [false, false, false, false, false];
  public disabledLanzar = true;
  public modo_suma = false;
  public sel_mesa: boolean[] = [];
  public nombre='';

  /**
   * Setea el arreglo de llevadas
   * @param llevadas 
   * Arreglo de llevadas a setear
   */
  setLlevadas(llevadas: Carta[]) {
    this.llevadas = llevadas;
  }

  /**
   * Identifica la carta seleccionada de la mano
   * @param indice 
   * recibe el indice de la carta clickeada
   */
  seleccionarCarta(indice: number) {
    this.sel = [false, false, false, false, false];
    this.sel[indice] = !this.sel[indice];
    this.disabledLanzar = false;
  }

  /**
   * Coloca una carta en la mesa sin evaluar la jugada
   */
  lanzarCarta(multijugador=false) {
    this.reiniciarUltimaLanzada();
    let posicion = this.sel.findIndex(elemento => elemento);
    this.mesa.push(this.mano[posicion]);
    this.mesa[this.mesa.length - 1].ultima_lanzada = true;
    this.mano.splice(posicion, 1);
    this.cartasService.esparcir(this.mesa,multijugador);
    this.colocarCarta.play();
    this.reiniciarSeleccion();
  }



  /**
   * Identifica la carta seleccionada de la mesa
   * @param indice 
   * recibe el indice de la carta clickeada de la mesa
   * @returns 
   * devueleve true si ya ha terminado el turno del jugador
   */
  seleccionarCartaMesa(indice: number) {
    if (this.sel.findIndex(element => element) + 1) {
      if (!this.modo_suma) {
        this.reiniciarSeleccionMesa();
      }
      this.sel_mesa[indice] = !this.sel_mesa[indice];
      return this.detectarJuego();
    }
    return false;
  }

  /**
   * Retira la seleccion de la mesa
   */
  reiniciarSeleccionMesa() {
    this.sel_mesa = [];
    this.mesa.forEach(() => {
      this.sel_mesa.push(false);
    });
  }

  /**
   * Retira la seleccion de la mano
   */
  reiniciarSeleccion() {
    this.sel = [false, false, false, false, false];
    this.disabledLanzar = true;
  }

  /**
   * Revisa si la carta de mesa y la de mano actuales forman algun juego (caida,llevada,suma y limpia)
   * @returns
   * devuelve true si ha finalizado el turno
   */
  detectarJuego() {
    let finalizado = false;
    //Identifico el indice de seleccion de la mesa y la mano
    let ind_carta_mesa = this.sel_mesa.findIndex(element => element == true);
    let ind_carta_mano = this.sel.findIndex(element => element == true);
    //si estan seleccionadas ambas
    if (ind_carta_mano + 1 && ind_carta_mesa + 1) {
      //cartas coinciden
      if (this.mesa[ind_carta_mesa].valor === this.mano[ind_carta_mano].valor) {
        this.detectarCaida(ind_carta_mesa);
        this.mesa.push(this.mano[ind_carta_mano]);
        this.mano.splice(ind_carta_mano, 1);
        this.llevarCartas(ind_carta_mesa);
        this.colocarCarta.play();
        this.reiniciarSeleccionMesa();
        this.reiniciarSeleccion();
        finalizado = true;
        //modo suma
      } else if ((this.mesa[ind_carta_mesa].valor < this.mano[ind_carta_mano].valor) && !(this.cartasJQK(ind_carta_mano))) {
        finalizado = this.modoSuma(ind_carta_mano);
      } else {//si la carta mesa es mayor a la de la mano (no entra en ningun modo)
        this.modo_suma = false;
        this.reiniciarSeleccionMesa();
        this.reiniciarSeleccion();
      }
    }
    //al finalizar el metodo (en comun)
    this.reiniciarUltimaLanzada();
    if(this.contarPuntos()){
      if(this.nombre!=''){
        console.log(`!!!${this.nombre} a ganado`);
      }else{
        console.log('Has ganado');
      }
    }
    return finalizado
  }

  /**
   * Modo suma para un jugador real
   * @param ind_carta_mano 
   * @return
   * devuelve true si la suma es correcta
   */
  modoSuma(ind_carta_mano: number) {
    //Inicialización del modo suma
    let suma = 0;
    this.modo_suma = true;
    let indice = [];//indices de las seleccionadas
    //sumo la carta mano con cada una de las cartas mesa seleccionadas
    for (let i = 0; i < this.sel_mesa.length; i++) {
      if (this.sel_mesa[i] === true) {
        indice.push(i);
        suma = suma + this.mesa[indice[indice.length - 1]].valor;
      }
    }
    //casos segun el resultado de la suma
    if (suma == this.mano[ind_carta_mano].valor) {//si la suma es correcta
      ///llevar para suma
      //devuelvo las posiciones ocupadas de la mesa********
      this.modo_suma = false;
      this.mesa.push(this.mano[ind_carta_mano]);
      this.mano.splice(ind_carta_mano, 1);
      this.llevarCartas(0, true, indice);
      this.colocarCarta.play();
      this.reiniciarSeleccionMesa();
      this.reiniciarSeleccion();
      return true;
    } else if (suma < this.mano[ind_carta_mano].valor) {//si la suma es menor
      return false;
    } else {//si la suma se pasa
      this.modo_suma = false;
      this.reiniciarSeleccionMesa();
      this.reiniciarSeleccion();
      return false;
    }
  }

}

