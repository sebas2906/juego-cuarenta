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
exports.PcService = void 0;
var core_1 = require("@angular/core");
var jugadores_service_1 = require("./jugadores.service");
var PcService = /** @class */ (function (_super) {
    __extends(PcService, _super);
    function PcService() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.puntos = 0;
        _this.cartas_puntos = [];
        _this.responderCarta = new Audio('assets/sonidos/mesa/responder.mp3');
        return _this;
    }
    /**
     * Da la mano a la PC
     * @param cartas
     * mano de cartas a recibir
     */
    PcService.prototype.setMano = function (cartas) {
        this.mano = cartas;
    };
    /**
     * Devuelve una carta aleatoria de la mano de jugador PC y la elimina de la mano
     * @return
     * Devuelve la carta lanzada
     */
    PcService.prototype.lanzarCarta = function () {
        var indice = -1;
        var carta = this.cartasService.barajarNaipe(this.mano)[0];
        this.mano.forEach(function (card, i) {
            if (card === carta) {
                indice = i;
            }
        });
        this.mano.splice(indice, 1);
        return carta;
    };
    /**
     * Devuelve el indice de una de las cartas que completan la suma de la carta lanzada
     * @param carta
     * carta a comparar
     * @param mesa
     * mesa actual del juego
     * @return
     * devuelve el indice de uno de los sumandos
     */
    PcService.prototype.detectarSuma = function (carta) {
        var _this = this;
        //ignorar las sumas con j,q,k
        if (carta.valor == 8 || carta.valor == 9 || carta.valor == 10) {
            return -1;
        }
        var _loop_1 = function (i) {
            var suma = this_1.mesa.findIndex(function (item) {
                if (item.valor != _this.mesa[i].valor) { //evito que se sume a si mismo
                    return (item.valor + _this.mesa[i].valor) === carta.valor;
                }
            });
            if (suma != -1) {
                return { value: i };
            }
        };
        var this_1 = this;
        for (var i = 0; i < this.mesa.length; i++) {
            var state_1 = _loop_1(i);
            if (typeof state_1 === "object")
                return state_1.value;
        }
        return -1;
    };
    /**
     * Procesos del juego de PC
     * @returns
     * Devuelve TRUE si ha finalizado su turno
     */
    PcService.prototype.jugar = function () {
        var _this = this;
        var carta = this.lanzarCarta();
        var indice_suma = this.detectarSuma(carta);
        var indice = -1;
        var finalizado = false;
        if (indice_suma != -1) { //suma
            var ind = this.mesa.findIndex(function (item) { return item.valor === ((carta.valor) - (_this.mesa[indice_suma].valor)); });
            this.mesa.push(carta);
            finalizado = this.cartasService.esparcir(this.mesa);
            this.llevarCartas(0, true, [ind, indice_suma]);
            this.reiniciarUltimaLanzada();
        }
        else {
            indice = this.mesa.findIndex(function (item) { return item.value === carta.value; });
            if (indice != -1) { //caida/llevada
                this.detectarCaida(indice);
            }
            //solo haria el lanzar si no es caida o llevada
            this.mesa.push(carta);
            finalizado = this.cartasService.esparcir(this.mesa);
            //}
            if (indice != -1) { //caida/llevada
                //reemplazo las posiciones para simular que se hiso caida
                var numero = this.mesa[indice].top.slice(0, this.mesa[indice].top.length - 1);
                var str = (parseInt(numero) + 5).toLocaleString();
                this.mesa[this.mesa.length - 1].top = this.mesa[indice].top.replace(numero, str);
                this.mesa[this.mesa.length - 1].left = this.mesa[indice].left;
                // setTimeout(() => {
                this.llevarCartas(indice);
                this.reiniciarUltimaLanzada();
                // }, 600);
            }
            else {
                this.reiniciarUltimaLanzada();
                this.mesa[this.mesa.length - 1].ultima_lanzada = true;
            }
        }
        //al finalizar el metodo (en comun)
        this.responderCarta.play();
        if (this.contarPuntos()) {
            console.log('La computadora ha ganado!!');
        }
        return finalizado;
    };
    PcService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], PcService);
    return PcService;
}(jugadores_service_1.JugadoresService));
exports.PcService = PcService;
