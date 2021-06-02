import { Component, OnInit, OnDestroy } from '@angular/core';
import { CartasService } from '../../services/cartas.service';
import { Carta, Paquete } from '../../interfaces/carta';
import { PcService } from '../../services/pc.service';
import { JugadorService } from '../../services/jugador.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MultijugadorService } from '../../services/multijugador.service';
import { Subscription } from 'rxjs';

import { ChatVozService } from 'src/app/services/chat-voz.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit, OnDestroy {
  public microfono = false;
  public img_microfono_abierto = '/assets/voz/microfono-abierto.png';
  public img_microfono = '/assets/voz/microfono.png';
  public manos: { [key: string]: Carta[] } = {};
  public naipe: Carta[] = [];
  public cargando = true;
  public cantidad_jugadores = 2;
  public mesa: Carta[] = [];
  public disabledLanzar = false;
  public disabledLanzarPC = false;
  public naipesReversa: Carta[] = [];
  public turno = true;
  public llevadasPC: Carta[] = [];
  public llevadas: Carta[] = [];
  public cartas_puntosPC: Carta[] = [];
  public cartas_puntos: Carta[] = [];
  public multijugador = false;
  public suscripcion: Subscription;
  public firefox: boolean;
  public firefox_invitado = false;
  //public multijugadorService: MultijugadorService;
  public chatVozService: ChatVozService;



  public paquete_enviado: Paquete = {
    mano: [],
    mesa: [],
    llevadas: [],
    cartas_puntos: [],
    puntos: 0,
    objetivo: '',
    recargar: false,
    mano_recargada: [],
    naipe: []
  };

  public paquete_recibido: { paquete: Paquete };

  //Este tipo de intanciacion genera instancias independientes
  public jugadorService = new JugadorService(this.cartasService);
  public jugador2 = new JugadorService(this.cartasService);



  constructor(public cartasService: CartasService, public pcService: PcService, private ruta: ActivatedRoute, public router: Router, public multijugadorService: MultijugadorService) {
    this.ruta.params.subscribe(parametro => {
      if (parametro.id === "multijugador") {
        //this.multijugadorService=new MultijugadorService();
        this.multijugadorService.iniciar();
        this.chatVozService = new ChatVozService(this.multijugadorService, 150);
        this.chatVozService.inicializar();
        this.suscripcion = this.multijugadorService.escucharPartida().subscribe(paquete => {
          this.paquete_recibido = paquete as { paquete: Paquete };
          this.recibirPaquete();
          this.turno = true;
        });
        this.disabledLanzar = true;
        this.multijugador = true;
        this.turno = false;
        if (localStorage.getItem('usuario')) {
          this.jugadorService.nombre = localStorage.getItem('usuario');
          this.multijugadorService.setNombre(this.jugadorService.nombre);
          this.multijugadorService.logearUsuario();
        } else {
          this.router.navigateByUrl('/');
        }
      }
    });
    this.inicializar();
  }

  ngOnInit() {



  }

  ngOnDestroy() {
    this.suscripcion.unsubscribe();
  }


  transmitir() {
    this.microfono = !this.microfono;
    if (this.chatVozService.getEstadoTransmision()) {
      this.chatVozService.parar();
      return;
    }
    this.chatVozService.transmitir().then(() => {
    });
  }

  /**
   * Asigno al jugador 2 con su nombre y si es o no un invitado
   * @param objeto 
   * Objeto en formato string, debe contener nombre:string, invitado:boolean
   */
  setJugador2(objeto: string) {
    let json = JSON.parse(objeto) as { nombre: string, invitado: boolean };
    if (json.invitado) {
      this.jugador2.nombre = json.nombre;
      this.turno = true;
    } else {
      this.jugador2.nombre = json.nombre;
      this.turno = false;
      this.enviarPaquete(true);
    }
    this.chatVozService.setReceptor(this.jugador2.nombre);
  }

  /**
   * Inicializa el juego de cartas
   */
  async inicializar() {
    this.naipe = await this.cartasService.inicializar(this.cantidad_jugadores);
    this.manos = this.cartasService.obtenerManos();
    //Importante a la hora de reiniciar el juego
    localStorage.setItem('naipe', JSON.stringify(this.naipe));
    //*****PUNTEROS********
    this.jugadorService.setMano(this.manos[0]);
    this.jugadorService.setMesa(this.mesa);
    this.jugadorService.setLlevadas(this.llevadas);
    this.jugadorService.setCartasPuntos(this.cartas_puntos);
    this.punterosContrincante();
    this.separacionNaipes(this.naipe, 75, 0.1);
    //Revisar bien que sucede aca
    this.naipesReversa = [...this.naipe].reverse();
    this.cargando = false;
  }

  /**
   * Conjunto de punteros relevantes para el juego, se asocia segun el tipo de jugador
   */
  punterosContrincante() {
    if (this.multijugador) {
      this.jugador2.setMano(this.manos[1]);
      this.jugador2.setMesa(this.mesa);
      this.jugador2.setLlevadas(this.llevadasPC);
      this.jugador2.setCartasPuntos(this.cartas_puntosPC);
      return;
    }
    this.pcService.setMano(this.manos[1]);
    this.pcService.setMesa(this.mesa);
    this.pcService.setLlevadas(this.llevadasPC);
    this.pcService.setCartasPuntos(this.cartas_puntosPC);
  }

  /**
   * Reinicia la partida
   */
  reiniciarPartida() {
    this.llevadasPC.splice(0, this.llevadasPC.length);
    this.llevadas.splice(0, this.llevadas.length);
    this.mesa.forEach(() => {
      this.cartasService.devolverPosicion(this.mesa);
    });
    this.mesa.splice(0, this.mesa.length);
    this.naipe = JSON.parse(localStorage.getItem('naipe'));
    this.naipe = this.cartasService.barajarNaipe(this.naipe);
    this.separacionNaipes(this.naipe, 75, 0.1);
    this.cargarManos();
  }

  /**
   * Lanza la carta seleccionada y llama al jugador PC
   * @param jugador
   * identifica la mano que va a lanzar
   */
  lanzarCarta() {
    if (this.naipe.length || this.manos[0].length) {
      this.jugadorService.lanzarCarta(this.multijugador);
      this.llevadas.forEach(element => {
        element.top = "80%";
      });
      //this.separacionNaipes(this.llevadas, 1, 1);
      this.turno = false;
      this.cargarManos();
      if(this.multijugador){
        this.enviarPaquete();
      }
      this.siguienteTurno();
    } else {
      //console.log('No hay mas cartas');
    }
  }

  /**
   * Reemplaza un arreglo por otro sin alterar la referencia
   * (puntero) del arreglo1
   * @param arreglo1 
   * arreglo al que se le quiere cambiar sus elementos
   * @param arreglo2 
   * arreglo con el que se llenaran los elementos al arreglo1
   */
  reemplazarArreglo(arreglo1: Carta[], arreglo2: Carta[]) {
    arreglo1.splice(0);
    arreglo2.forEach(elemento => {
      arreglo1.push(elemento);
    });
  }

  /**
   * Asigna el paquete de cartas para el juego desde el otro jugador
   */
  recibirPaquete() {
    this.reemplazarArreglo(this.jugador2.cartas_puntos, this.paquete_recibido.paquete.cartas_puntos);
    this.reemplazarArreglo(this.jugador2.llevadas, this.paquete_recibido.paquete.llevadas);
    this.reemplazarArreglo(this.jugador2.mano, this.paquete_recibido.paquete.mano);
    this.reemplazarArreglo(this.jugador2.mesa, this.paquete_recibido.paquete.mesa);
    this.jugador2.puntos = this.paquete_recibido.paquete.puntos;
    if (this.paquete_recibido.paquete.recargar) {
      this.reemplazarArreglo(this.jugadorService.mano, this.paquete_recibido.paquete.mano_recargada);
      this.reemplazarArreglo(this.naipe, this.paquete_recibido.paquete.naipe);
      this.paquete_recibido.paquete.recargar = false;
    }
    if (this.mesa.length > 0) {
      this.cartasService.posiciones = this.cartasService.posiciones.filter(posicion => !((posicion.top === this.mesa[this.mesa.length - 1].top) && (posicion.left === this.mesa[this.mesa.length - 1].left)));
    }

    this.llevadasPC.forEach(element => {
      element.top = "1%";
    });
    let ultima_separacion = this.separacionNaipes(this.llevadasPC, 50, 1);
    this.cartas_puntosPC.forEach(element => {
      element.top = "1%";
    });
    this.separacionNaipes(this.cartas_puntosPC, ultima_separacion + 10, 1);
  }

  /**
   * envio el conjunto de información de la partida actual por sockets
   */
  enviarPaquete(recargarMano = false) {
    this.paquete_enviado.cartas_puntos = this.jugadorService.cartas_puntos;
    this.paquete_enviado.llevadas = this.jugadorService.llevadas;
    this.paquete_enviado.mano = this.jugadorService.mano;
    this.paquete_enviado.mesa = this.mesa;
    this.paquete_enviado.puntos = this.jugadorService.puntos;
    this.paquete_enviado.objetivo = this.jugador2.nombre;
    this.paquete_enviado.recargar = recargarMano;
    this.paquete_enviado.mano_recargada = this.jugador2.mano;
    this.paquete_enviado.naipe = this.naipe
    this.multijugadorService.enviarPartida(this.paquete_enviado);
  }

  /**
   * Selecciona el siguiente turno segun el tipo de juego
   */
  siguienteTurno() {
    if (this.multijugador) {
      if (this.naipe.length || this.manos[1].length) {
        // console.warn("Turno del jugador2");
      } else {
        console.warn('No hay mas cartas');
      }
      return;
    }
    this.TurnoPC();
  }

  /**
   * Recarga las manos de los jugadores moviendolas del naipe
   */
  cargarManos() {
    let j = 0;
    if (this.naipe.length) {
      //Cuando aun hay cartas en el naipe
      if (!this.manos[0].length && !this.manos[1].length) {
        for (let i = 0; i < this.cantidad_jugadores; i++) {
          for (j = j; j < 5 * (i + 1); j++) {
            this.manos[i].push(this.naipe[j]);
          }
        }
        this.naipesReversa = this.naipe.slice().reverse();
        this.naipe.splice(0, this.cantidad_jugadores * 5);
        this.naipesReversa.splice(this.naipesReversa.length - 5 * this.cantidad_jugadores, this.naipesReversa.length);
      }
      //cuando no existen mas cartas en el naipe ni en las manos
    } else if (!this.manos[0].length && !this.manos[1].length) {
      this.jugadorService.conteoFinal();
      this.multijugador ? this.jugador2.conteoFinal() : this.pcService.conteoFinal();

      this.cartas_puntos.forEach(element => {
        element.top = "80%";
      });
      this.llevadas.forEach(element => {
        element.top = "80%";
      });

      this.llevadasPC.forEach(element => {
        element.top = "1%";
      });
      this.cartas_puntosPC.forEach(element => {
        element.top = "1%";
      });
      
       this.separacionNaipes(this.cartas_puntos, (this.llevadas.length - 1) + 10, 1);
      this.separacionNaipes(this.cartas_puntosPC, 80, 1); 
      //Reinicio la partida
      this.reiniciarPartida();
    }
    if(this.multijugador){
    this.enviarPaquete(true);
    }
  }


  async escuharNotificacion(){
    if(this.jugadorService.notificacion_info.en){
      setTimeout(() => {
        this.jugadorService.notificacion_info.en=false;
      }, 2000);
    }
  }

  /**
   * Identifica cuando el jugador a terminado de seleccionar cartas de la mesa
   * @param i 
   * indice de la carta de la mesa seleccionada
   */
  seleccionarCartaMesa(i: number) {
    if (this.jugadorService.seleccionarCartaMesa(i)) {
      this.escuharNotificacion();
      this.cartas_puntos.forEach(element => {
        element.top = "80%";
      });
      this.llevadas.forEach(element => {
        element.top = "80%";
      });
      let ultima_distancia = this.separacionNaipes(this.llevadas, 1, 1);
      this.separacionNaipes(this.cartas_puntos, ultima_distancia + 10, 1);
      this.turno = false;
      this.cargarManos();
      if(this.multijugador){
        this.enviarPaquete();
      }  
      this.siguienteTurno();
    }
  }

  /**
   * Pone sobre la mesa una carta aleatoria del PC y juega
   */
  TurnoPC() {
    this.jugadorService.reiniciarSeleccionMesa();
    this.cargando = true;
    if (!this.disabledLanzarPC) {
      setTimeout(() => {
        this.disabledLanzar = this.pcService.jugar();
        this.llevadasPC.forEach(element => {
          element.top = "1%";
        });
        let ultima_separacion = this.separacionNaipes(this.llevadasPC, 50, 1);
        this.cartas_puntosPC.forEach(element => {
          element.top = "1%";
        });
        this.separacionNaipes(this.cartas_puntosPC, ultima_separacion + 10, 1);
        this.turno = true;
        this.cargando = false;
        this.cargarManos();
        this.disabledLanzar = true;
      }, 600);
    }
  }

  /**
   * Da una separación pequeña entre cartas del naipe para colocarlos en el mazo
   * @param naipe 
   * naipe a ser separado
   * @param valor_inicial 
   * valor de posicion de la primera carta
   * @param separacion 
   * separacion entre cada carta
   * @returns
   * devuelve la posicion de la carta separada
   */
  separacionNaipes(naipe: Carta[], valor_inicial: number, separacion: number) {
    let c = valor_inicial;
    let valor = "";
    naipe.forEach(carta => {
      c = c + separacion;
      valor = c.toString() + "%";
      carta.left = valor;
    });
    return c;
  }

}
