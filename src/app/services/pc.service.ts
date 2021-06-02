import { Injectable } from '@angular/core';
import { Carta } from '../interfaces/carta';
import { JugadoresService } from './jugadores.service';

@Injectable({
  providedIn: 'root'
})
export class PcService extends JugadoresService {

  public puntos = 0;
  public cartas_puntos: Carta[] = [];
  public responderCarta = new Audio('assets/sonidos/mesa/responder.mp3');

  /**
   * Da la mano a la PC
   * @param cartas 
   * mano de cartas a recibir
   */
  setMano(cartas: Carta[]) {
    this.mano = cartas;
  }

  /**
   * Devuelve una carta aleatoria de la mano de jugador PC y la elimina de la mano
   * @return 
   * Devuelve la carta lanzada
   */
  lanzarCarta() {
    let indice = -1;
    let carta: Carta = this.cartasService.barajarNaipe(this.mano)[0];
    this.mano.forEach((card, i) => {
      if (card === carta) {
        indice = i;
      }
    });
    this.mano.splice(indice, 1);
    return carta;
  }

  /**
   * Devuelve el indice de una de las cartas que completan la suma de la carta lanzada
   * @param carta 
   * carta a comparar
   * @param mesa 
   * mesa actual del juego
   * @return
   * devuelve el indice de uno de los sumandos
   */
  detectarSuma(carta: Carta) {
    //ignorar las sumas con j,q,k
    if (carta.valor == 8 || carta.valor == 9 || carta.valor == 10) {
      return -1;
    }
    for (let i = 0; i < this.mesa.length; i++) {
      let suma = this.mesa.findIndex(item => {
        if (item.valor != this.mesa[i].valor) {//evito que se sume a si mismo
          return (item.valor + this.mesa[i].valor) === carta.valor
        }
      });
      if (suma != -1) {
        return i;
      }
    }
    return -1;
  }

  /**
   * Procesos del juego de PC
   * @returns
   * Devuelve TRUE si ha finalizado su turno
   */
  jugar() {
    let carta = this.lanzarCarta();
    let indice_suma = this.detectarSuma(carta);
    let indice = -1;
    let finalizado = false;
    if (indice_suma != -1) {//suma
      let ind = this.mesa.findIndex(item => item.valor === ((carta.valor) - (this.mesa[indice_suma].valor)));
      this.mesa.push(carta);
      finalizado = this.cartasService.esparcir(this.mesa);
      this.llevarCartas(0, true, [ind, indice_suma]);
      this.reiniciarUltimaLanzada();
    } else {
      indice = this.mesa.findIndex(item => item.value === carta.value);
      if (indice != -1) {//caida/llevada
        this.detectarCaida(indice);
      }
      //solo haria el lanzar si no es caida o llevada
      this.mesa.push(carta);
      finalizado = this.cartasService.esparcir(this.mesa);
    //}
    if (indice != -1) {//caida/llevada
      //reemplazo las posiciones para simular que se hiso caida
      let numero = this.mesa[indice].top.slice(0, this.mesa[indice].top.length - 1);
      let str = (parseInt(numero) + 5).toLocaleString();
      this.mesa[this.mesa.length - 1].top = this.mesa[indice].top.replace(numero, str);
      this.mesa[this.mesa.length - 1].left = this.mesa[indice].left;
      // setTimeout(() => {
      this.llevarCartas(indice);
      this.reiniciarUltimaLanzada();
      // }, 600);
    } else {
      this.reiniciarUltimaLanzada();
      this.mesa[this.mesa.length - 1].ultima_lanzada = true;
    }
  }
  //al finalizar el metodo (en comun)
    this.responderCarta.play();
    if(this.contarPuntos()){
     console.log('La computadora ha ganado!!');
    }
    return finalizado;
  }

}
