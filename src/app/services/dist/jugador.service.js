"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.JugadorService = void 0;
var core_1 = require("@angular/core");
var jugadores_service_1 = require("./jugadores.service");
var JugadorService = /** @class */ (function (_super) {
    __extends(JugadorService, _super);
    function JugadorService() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //Parametros
        _this.colocarCarta = new Audio('assets/sonidos/mesa/poner.mp3');
        _this.sel = [false, false, false, false, false];
        _this.disabledLanzar = true;
        _this.modo_suma = false;
        _this.sel_mesa = [];
        _this.nombre = '';
        return _this;
    }
    /**
     * Setea el arreglo de llevadas
     * @param llevadas
     * Arreglo de llevadas a setear
     */
    JugadorService.prototype.setLlevadas = function (llevadas) {
        this.llevadas = llevadas;
    };
    /**
     * Identifica la carta seleccionada de la mano
     * @param indice
     * recibe el indice de la carta clickeada
     */
    JugadorService.prototype.seleccionarCarta = function (indice) {
        this.sel = [false, false, false, false, false];
        this.sel[indice] = !this.sel[indice];
        this.disabledLanzar = false;
    };
    /**
     * Coloca una carta en la mesa sin evaluar la jugada
     */
    JugadorService.prototype.lanzarCarta = function (multijugador) {
        if (multijugador === void 0) { multijugador = false; }
        this.reiniciarUltimaLanzada();
        var posicion = this.sel.findIndex(function (elemento) { return elemento; });
        this.mesa.push(this.mano[posicion]);
        this.mesa[this.mesa.length - 1].ultima_lanzada = true;
        this.mano.splice(posicion, 1);
        this.cartasService.esparcir(this.mesa, multijugador);
        this.colocarCarta.play();
        this.reiniciarSeleccion();
    };
    /**
     * Identifica la carta seleccionada de la mesa
     * @param indice
     * recibe el indice de la carta clickeada de la mesa
     * @returns
     * devueleve true si ya ha terminado el turno del jugador
     */
    JugadorService.prototype.seleccionarCartaMesa = function (indice) {
        if (this.sel.findIndex(function (element) { return element; }) + 1) {
            if (!this.modo_suma) {
                this.reiniciarSeleccionMesa();
            }
            this.sel_mesa[indice] = !this.sel_mesa[indice];
            return this.detectarJuego();
        }
        return false;
    };
    /**
     * Retira la seleccion de la mesa
     */
    JugadorService.prototype.reiniciarSeleccionMesa = function () {
        var _this = this;
        this.sel_mesa = [];
        this.mesa.forEach(function () {
            _this.sel_mesa.push(false);
        });
    };
    /**
     * Retira la seleccion de la mano
     */
    JugadorService.prototype.reiniciarSeleccion = function () {
        this.sel = [false, false, false, false, false];
        this.disabledLanzar = true;
    };
    /**
     * Revisa si la carta de mesa y la de mano actuales forman algun juego (caida,llevada,suma y limpia)
     * @returns
     * devuelve true si ha finalizado el turno
     */
    JugadorService.prototype.detectarJuego = function () {
        var finalizado = false;
        //Identifico el indice de seleccion de la mesa y la mano
        var ind_carta_mesa = this.sel_mesa.findIndex(function (element) { return element == true; });
        var ind_carta_mano = this.sel.findIndex(function (element) { return element == true; });
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
            }
            else if ((this.mesa[ind_carta_mesa].valor < this.mano[ind_carta_mano].valor) && !(this.cartasJQK(ind_carta_mano))) {
                finalizado = this.modoSuma(ind_carta_mano);
            }
            else { //si la carta mesa es mayor a la de la mano (no entra en ningun modo)
                this.modo_suma = false;
                this.reiniciarSeleccionMesa();
                this.reiniciarSeleccion();
            }
        }
        //al finalizar el metodo (en comun)
        this.reiniciarUltimaLanzada();
        if (this.contarPuntos()) {
            if (this.nombre != '') {
                console.log("!!!" + this.nombre + " a ganado");
            }
            else {
                console.log('Has ganado');
            }
        }
        return finalizado;
    };
    /**
     * Modo suma para un jugador real
     * @param ind_carta_mano
     * @return
     * devuelve true si la suma es correcta
     */
    JugadorService.prototype.modoSuma = function (ind_carta_mano) {
        //Inicialización del modo suma
        var suma = 0;
        this.modo_suma = true;
        var indice = []; //indices de las seleccionadas
        //sumo la carta mano con cada una de las cartas mesa seleccionadas
        for (var i = 0; i < this.sel_mesa.length; i++) {
            if (this.sel_mesa[i] === true) {
                indice.push(i);
                suma = suma + this.mesa[indice[indice.length - 1]].valor;
            }
        }
        //casos segun el resultado de la suma
        if (suma == this.mano[ind_carta_mano].valor) { //si la suma es correcta
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
        }
        else if (suma < this.mano[ind_carta_mano].valor) { //si la suma es menor
            return false;
        }
        else { //si la suma se pasa
            this.modo_suma = false;
            this.reiniciarSeleccionMesa();
            this.reiniciarSeleccion();
            return false;
        }
    };
    JugadorService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], JugadorService);
    return JugadorService;
}(jugadores_service_1.JugadoresService));
exports.JugadorService = JugadorService;
