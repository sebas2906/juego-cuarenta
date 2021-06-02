"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.HomeComponent = void 0;
var core_1 = require("@angular/core");
var jugador_service_1 = require("../../services/jugador.service");
var chat_voz_service_1 = require("src/app/services/chat-voz.service");
var HomeComponent = /** @class */ (function () {
    function HomeComponent(cartasService, pcService, ruta, router, multijugadorService) {
        var _this = this;
        this.cartasService = cartasService;
        this.pcService = pcService;
        this.ruta = ruta;
        this.router = router;
        this.multijugadorService = multijugadorService;
        this.microfono = false;
        this.img_microfono_abierto = '/assets/voz/microfono-abierto.png';
        this.img_microfono = '/assets/voz/microfono.png';
        this.manos = {};
        this.naipe = [];
        this.cargando = true;
        this.cantidad_jugadores = 2;
        this.mesa = [];
        this.disabledLanzar = false;
        this.disabledLanzarPC = false;
        this.naipesReversa = [];
        this.turno = true;
        this.llevadasPC = [];
        this.llevadas = [];
        this.cartas_puntosPC = [];
        this.cartas_puntos = [];
        this.multijugador = false;
        this.firefox_invitado = false;
        this.paquete_enviado = {
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
        //Este tipo de intanciacion genera instancias independientes
        this.jugadorService = new jugador_service_1.JugadorService(this.cartasService);
        this.jugador2 = new jugador_service_1.JugadorService(this.cartasService);
        this.ruta.params.subscribe(function (parametro) {
            if (parametro.id === "multijugador") {
                //this.multijugadorService=new MultijugadorService();
                _this.multijugadorService.iniciar();
                _this.chatVozService = new chat_voz_service_1.ChatVozService(_this.multijugadorService, 150);
                _this.chatVozService.inicializar();
                _this.suscripcion = _this.multijugadorService.escucharPartida().subscribe(function (paquete) {
                    _this.paquete_recibido = paquete;
                    _this.recibirPaquete();
                    _this.turno = true;
                });
                _this.disabledLanzar = true;
                _this.multijugador = true;
                _this.turno = false;
                if (localStorage.getItem('usuario')) {
                    _this.jugadorService.nombre = localStorage.getItem('usuario');
                    _this.multijugadorService.setNombre(_this.jugadorService.nombre);
                    _this.multijugadorService.logearUsuario();
                }
                else {
                    _this.router.navigateByUrl('/');
                }
            }
        });
        this.inicializar();
    }
    HomeComponent.prototype.ngOnInit = function () {
    };
    HomeComponent.prototype.ngOnDestroy = function () {
        this.suscripcion.unsubscribe();
    };
    HomeComponent.prototype.transmitir = function () {
        this.microfono = !this.microfono;
        if (this.chatVozService.getEstadoTransmision()) {
            this.chatVozService.parar();
            return;
        }
        this.chatVozService.transmitir().then(function () {
        });
    };
    /**
     * Asigno al jugador 2 con su nombre y si es o no un invitado
     * @param objeto
     * Objeto en formato string, debe contener nombre:string, invitado:boolean
     */
    HomeComponent.prototype.setJugador2 = function (objeto) {
        var json = JSON.parse(objeto);
        if (json.invitado) {
            this.jugador2.nombre = json.nombre;
            this.turno = true;
        }
        else {
            this.jugador2.nombre = json.nombre;
            this.turno = false;
            this.enviarPaquete(true);
        }
        this.chatVozService.setReceptor(this.jugador2.nombre);
    };
    /**
     * Inicializa el juego de cartas
     */
    HomeComponent.prototype.inicializar = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.cartasService.inicializar(this.cantidad_jugadores)];
                    case 1:
                        _a.naipe = _b.sent();
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
                        this.naipesReversa = __spreadArrays(this.naipe).reverse();
                        this.cargando = false;
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Conjunto de punteros relevantes para el juego, se asocia segun el tipo de jugador
     */
    HomeComponent.prototype.punterosContrincante = function () {
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
    };
    /**
     * Reinicia la partida
     */
    HomeComponent.prototype.reiniciarPartida = function () {
        var _this = this;
        this.llevadasPC.splice(0, this.llevadasPC.length);
        this.llevadas.splice(0, this.llevadas.length);
        this.mesa.forEach(function () {
            _this.cartasService.devolverPosicion(_this.mesa);
        });
        this.mesa.splice(0, this.mesa.length);
        this.naipe = JSON.parse(localStorage.getItem('naipe'));
        this.naipe = this.cartasService.barajarNaipe(this.naipe);
        this.separacionNaipes(this.naipe, 75, 0.1);
        this.cargarManos();
    };
    /**
     * Lanza la carta seleccionada y llama al jugador PC
     * @param jugador
     * identifica la mano que va a lanzar
     */
    HomeComponent.prototype.lanzarCarta = function () {
        if (this.naipe.length || this.manos[0].length) {
            this.jugadorService.lanzarCarta(this.multijugador);
            this.llevadas.forEach(function (element) {
                element.top = "80%";
            });
            //this.separacionNaipes(this.llevadas, 1, 1);
            this.turno = false;
            this.cargarManos();
            if (this.multijugador) {
                this.enviarPaquete();
            }
            this.siguienteTurno();
        }
        else {
            //console.log('No hay mas cartas');
        }
    };
    /**
     * Reemplaza un arreglo por otro sin alterar la referencia
     * (puntero) del arreglo1
     * @param arreglo1
     * arreglo al que se le quiere cambiar sus elementos
     * @param arreglo2
     * arreglo con el que se llenaran los elementos al arreglo1
     */
    HomeComponent.prototype.reemplazarArreglo = function (arreglo1, arreglo2) {
        arreglo1.splice(0);
        arreglo2.forEach(function (elemento) {
            arreglo1.push(elemento);
        });
    };
    /**
     * Asigna el paquete de cartas para el juego desde el otro jugador
     */
    HomeComponent.prototype.recibirPaquete = function () {
        var _this = this;
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
            this.cartasService.posiciones = this.cartasService.posiciones.filter(function (posicion) { return !((posicion.top === _this.mesa[_this.mesa.length - 1].top) && (posicion.left === _this.mesa[_this.mesa.length - 1].left)); });
        }
        this.llevadasPC.forEach(function (element) {
            element.top = "1%";
        });
        var ultima_separacion = this.separacionNaipes(this.llevadasPC, 50, 1);
        this.cartas_puntosPC.forEach(function (element) {
            element.top = "1%";
        });
        this.separacionNaipes(this.cartas_puntosPC, ultima_separacion + 10, 1);
    };
    /**
     * envio el conjunto de información de la partida actual por sockets
     */
    HomeComponent.prototype.enviarPaquete = function (recargarMano) {
        if (recargarMano === void 0) { recargarMano = false; }
        this.paquete_enviado.cartas_puntos = this.jugadorService.cartas_puntos;
        this.paquete_enviado.llevadas = this.jugadorService.llevadas;
        this.paquete_enviado.mano = this.jugadorService.mano;
        this.paquete_enviado.mesa = this.mesa;
        this.paquete_enviado.puntos = this.jugadorService.puntos;
        this.paquete_enviado.objetivo = this.jugador2.nombre;
        this.paquete_enviado.recargar = recargarMano;
        this.paquete_enviado.mano_recargada = this.jugador2.mano;
        this.paquete_enviado.naipe = this.naipe;
        this.multijugadorService.enviarPartida(this.paquete_enviado);
    };
    /**
     * Selecciona el siguiente turno segun el tipo de juego
     */
    HomeComponent.prototype.siguienteTurno = function () {
        if (this.multijugador) {
            if (this.naipe.length || this.manos[1].length) {
                // console.warn("Turno del jugador2");
            }
            else {
                console.warn('No hay mas cartas');
            }
            return;
        }
        this.TurnoPC();
    };
    /**
     * Recarga las manos de los jugadores moviendolas del naipe
     */
    HomeComponent.prototype.cargarManos = function () {
        var j = 0;
        if (this.naipe.length) {
            //Cuando aun hay cartas en el naipe
            if (!this.manos[0].length && !this.manos[1].length) {
                for (var i = 0; i < this.cantidad_jugadores; i++) {
                    for (j = j; j < 5 * (i + 1); j++) {
                        this.manos[i].push(this.naipe[j]);
                    }
                }
                this.naipesReversa = this.naipe.slice().reverse();
                this.naipe.splice(0, this.cantidad_jugadores * 5);
                this.naipesReversa.splice(this.naipesReversa.length - 5 * this.cantidad_jugadores, this.naipesReversa.length);
            }
            //cuando no existen mas cartas en el naipe ni en las manos
        }
        else if (!this.manos[0].length && !this.manos[1].length) {
            this.jugadorService.conteoFinal();
            this.multijugador ? this.jugador2.conteoFinal() : this.pcService.conteoFinal();
            this.cartas_puntos.forEach(function (element) {
                element.top = "80%";
            });
            this.llevadas.forEach(function (element) {
                element.top = "80%";
            });
            this.llevadasPC.forEach(function (element) {
                element.top = "1%";
            });
            this.cartas_puntosPC.forEach(function (element) {
                element.top = "1%";
            });
            this.separacionNaipes(this.cartas_puntos, (this.llevadas.length - 1) + 10, 1);
            this.separacionNaipes(this.cartas_puntosPC, 80, 1);
            //Reinicio la partida
            this.reiniciarPartida();
        }
        if (this.multijugador) {
            this.enviarPaquete(true);
        }
    };
    HomeComponent.prototype.escuharNotificacion = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (this.jugadorService.notificacion_info.en) {
                    setTimeout(function () {
                        _this.jugadorService.notificacion_info.en = false;
                    }, 2000);
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Identifica cuando el jugador a terminado de seleccionar cartas de la mesa
     * @param i
     * indice de la carta de la mesa seleccionada
     */
    HomeComponent.prototype.seleccionarCartaMesa = function (i) {
        if (this.jugadorService.seleccionarCartaMesa(i)) {
            this.escuharNotificacion();
            this.cartas_puntos.forEach(function (element) {
                element.top = "80%";
            });
            this.llevadas.forEach(function (element) {
                element.top = "80%";
            });
            var ultima_distancia = this.separacionNaipes(this.llevadas, 1, 1);
            this.separacionNaipes(this.cartas_puntos, ultima_distancia + 10, 1);
            this.turno = false;
            this.cargarManos();
            if (this.multijugador) {
                this.enviarPaquete();
            }
            this.siguienteTurno();
        }
    };
    /**
     * Pone sobre la mesa una carta aleatoria del PC y juega
     */
    HomeComponent.prototype.TurnoPC = function () {
        var _this = this;
        this.jugadorService.reiniciarSeleccionMesa();
        this.cargando = true;
        if (!this.disabledLanzarPC) {
            setTimeout(function () {
                _this.disabledLanzar = _this.pcService.jugar();
                _this.llevadasPC.forEach(function (element) {
                    element.top = "1%";
                });
                var ultima_separacion = _this.separacionNaipes(_this.llevadasPC, 50, 1);
                _this.cartas_puntosPC.forEach(function (element) {
                    element.top = "1%";
                });
                _this.separacionNaipes(_this.cartas_puntosPC, ultima_separacion + 10, 1);
                _this.turno = true;
                _this.cargando = false;
                _this.cargarManos();
                _this.disabledLanzar = true;
            }, 600);
        }
    };
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
    HomeComponent.prototype.separacionNaipes = function (naipe, valor_inicial, separacion) {
        var c = valor_inicial;
        var valor = "";
        naipe.forEach(function (carta) {
            c = c + separacion;
            valor = c.toString() + "%";
            carta.left = valor;
        });
        return c;
    };
    HomeComponent = __decorate([
        core_1.Component({
            selector: 'app-home',
            templateUrl: './home.component.html',
            styleUrls: ['./home.component.css']
        })
    ], HomeComponent);
    return HomeComponent;
}());
exports.HomeComponent = HomeComponent;
