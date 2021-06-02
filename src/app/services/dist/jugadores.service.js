"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.JugadoresService = void 0;
var core_1 = require("@angular/core");
var JugadoresService = /** @class */ (function () {
    function JugadoresService(cartasService) {
        this.cartasService = cartasService;
        this.mano = [];
        this.turno = true;
        this.llevadas = [];
        this.cartas_puntos = [];
        this.puntos = 0;
        this.mesa = [];
        this.notificacion_info = { mensaje: '', color: '', en: false };
    }
    JugadoresService.prototype.setMesa = function (cartas) {
        this.mesa = cartas;
    };
    /**
    * Da una mano de cartas al jugador actual
    * @param cartas
    * mano de cartas a recibir
    */
    JugadoresService.prototype.setMano = function (cartas) {
        this.mano = cartas;
    };
    /**
    * @return
    * Devuelve la mano actual del jugador
    */
    JugadoresService.prototype.obtenerMano = function () {
        return this.mano;
    };
    /**
     * @returns
     * regresa las llevadas (arreglo de cartas) del jugador
     */
    JugadoresService.prototype.obtenerLlevadas = function () {
        return this.llevadas;
    };
    /**
     * @returns
     * Devuelve el arreglo de puntos del Jugador
     */
    JugadoresService.prototype.obtenerCartasPuntos = function () {
        return this.cartas_puntos;
    };
    /**
    * @returns
    * Devuelve los puntos actuales del jugador
    */
    JugadoresService.prototype.obtenerPuntos = function () {
        return this.puntos;
    };
    /**
     * Setea los puntos
     * @param puntos
     * puntos a setear
     */
    JugadoresService.prototype.setPuntos = function (puntos) {
        this.puntos = puntos;
    };
    /**
     * Setea el arreglo de puntos
     * @param cartas
     * Arreglo de puntos
     */
    JugadoresService.prototype.setCartasPuntos = function (cartas) {
        this.cartas_puntos = cartas;
    };
    /**
     * Setea el arreglo de llevadas
     * @param llevadas
     * Arreglo de llevadas a setear
     */
    JugadoresService.prototype.setLlevadas = function (llevadas) {
        this.llevadas = llevadas;
    };
    /**
    * Determina si el indice de la carta a evaular es J,Q o K
    * @param ind_carta
    * indice de la carta a evaluar
    * @returns
    * Devuelve TRUE si la carta pertenece a J,Q o K
    */
    JugadoresService.prototype.cartasJQK = function (ind_carta) {
        return (this.mano[ind_carta].valor == 8 || this.mano[ind_carta].valor == 9 || this.mano[ind_carta].valor == 10);
    };
    /**
     * Reordena los puntos del jugador cuando se requiere voltear los puntos
     * y devuelve los excedentes al arreglo de puntos del juego
     */
    JugadoresService.prototype.reordenarPuntos = function () {
        if (this.puntos < 10) {
            return;
        }
        var decena = this.puntos % 10;
        var unidad = (this.puntos - decena) / 10;
        var cantidad = unidad + (decena / 2); //cantidad de cartas que conformaran los puntos
        var retirar = this.cartas_puntos.length - cantidad; //cantidad de cartas a retirar de los puntos actuales
        //Devuelvo los puntos sobrantes retirandolos desde atras hacia adelante para no remover las cartas
        //ya volteadas
        for (var i = 0; i < retirar; i++) {
            this.cartasService.setPunto(this.cartas_puntos[(this.cartas_puntos.length - 1) - i]);
            this.cartas_puntos.pop();
        }
        //agregamos mas cartas de ser necesario
        if (retirar < 0) {
            for (var index = 0; index < -retirar; index++) {
                this.cartas_puntos.push(this.cartasService.obtenerPunto());
            }
        }
        //relleno las cartas volteadas
        for (var i = 0; i < unidad; i++) {
            this.cartas_puntos[i].volteado = true;
        }
        //relleno las cartas no volteadas
        for (var i = unidad; i < cantidad; i++) {
            this.cartas_puntos[i].volteado = false;
        }
    };
    /**
       * Detecta caida o llevada, si es caida suma los puntos
       * y hace un push al arreglo de puntos
       * @param ind_carta_mesa
       * indice de la carta a evaluar
       */
    JugadoresService.prototype.detectarCaida = function (ind_carta_mesa) {
        //Caida
        if ((ind_carta_mesa == this.mesa.length - 1) && (this.mesa[this.mesa.length - 1].ultima_lanzada)) {
            this.cartas_puntos.push(this.cartasService.obtenerPunto());
            /*  this.cartas_puntos.forEach(element => {
               element.top = "80%";
             }); */
            this.puntos = this.puntos + 2;
            this.notificacion_info = this.notificacion('Caida!, +2 puntos', 'warning');
            //Llevada
        }
        else {
            //console.log("llevada en", this.mesa[ind_carta_mesa].valor);
        }
    };
    /**
     * Reinicia el marcador de ultima carta lanzada
     */
    JugadoresService.prototype.reiniciarUltimaLanzada = function () {
        this.mesa.forEach(function (element) {
            element.ultima_lanzada = false;
        });
    };
    /**
     * Realiza el conteo de puntos ganados en las llevadas y los agrega tanto
     * a el arreglo de cartas de puntos como a los puntos numéricos
     */
    JugadoresService.prototype.conteoFinal = function () {
        this.puntos = this.contarPuntosExtra(this.llevadas, this.puntos);
        this.cargarPuntosExtra(this.puntos);
    };
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
    JugadoresService.prototype.llevarCartas = function (ind_carta_mesa, modo_suma, indice) {
        var _this = this;
        if (modo_suma === void 0) { modo_suma = false; }
        //llevo la carta lanzada de la mano
        if (modo_suma) {
            //llevo las cartas implicadas y las borro
            indice.forEach(function (element) {
                _this.llevadas.push(_this.mesa[element]);
            });
            var _loop_1 = function (i) {
                var ind = this_1.mesa.findIndex(function (element) { return _this.llevadas[_this.llevadas.length - (i + 1)].valor === element.valor; });
                this_1.mesa.splice(ind, 1);
                this_1.cartasService.devolverPosicion(this_1.mesa);
            };
            var this_1 = this;
            //remuevo el valor que coincida con el elemento del indice
            for (var i = 0; i < indice.length; i++) {
                _loop_1(i);
            }
        }
        else {
            this.llevadas.push(this.mesa[ind_carta_mesa]);
            this.mesa.splice(ind_carta_mesa, 1);
            this.cartasService.devolverPosicion(this.mesa);
        }
        //En comun
        this.llevadas.push(this.mesa[this.mesa.length - 1]);
        var ultima_carta = this.mesa.splice(this.mesa.length - 1, 1);
        this.cartasService.devolverPosicion(this.mesa);
        this.llevarCartasExtra(ultima_carta[0]);
    };
    /**
     * Cuenta los puntos ganados extras de las llevadas
     * @param llevadas
     * llevadas del jugador
     * @param puntos
     * puntos actuales del jugador
     * @returns
     * devuelve los puntos que ya tenia el jugador mas los puntos ganados
     */
    JugadoresService.prototype.contarPuntosExtra = function (llevadas, puntos) {
        if (llevadas.length > 19) {
            var total_puntos = (llevadas.length - 19) + 5;
            if (!(total_puntos % 2)) {
                puntos += total_puntos;
            }
            else {
                puntos += total_puntos + 1;
            }
        }
        else {
            console.warn("Las llevadas no suman puntos");
        }
        return puntos;
    };
    /**
    * Borra todos los puntos del jugador y los vuelve a cargar
    * con el valor especificado
    * @param puntos
    * puntos a agregar
    */
    JugadoresService.prototype.cargarPuntosExtra = function (puntos) {
        var _this = this;
        this.cartas_puntos.forEach(function (element) {
            _this.cartasService.setPunto(element);
        });
        this.cartas_puntos.splice(0, this.cartas_puntos.length);
        if (puntos < 10) {
            for (var i = 0; i < (puntos / 2); i++) {
                this.cartas_puntos.push(this.cartasService.obtenerPunto());
            }
        }
        else {
            var str = puntos.toString();
            var num1 = Number(str.slice(0, 1));
            var num2 = Number(str.slice(1));
            for (var i = 0; i < num1; i++) {
                this.cartas_puntos.push(this.cartasService.obtenerPunto());
                this.cartas_puntos[i].volteado = true;
            }
            for (var i = 0; i < (num2 / 2); i++) {
                this.cartas_puntos.push(this.cartasService.obtenerPunto());
            }
        }
    };
    /**
     * Lleva las cartas extra en serie de la ultima carta lanzada por
     * un jugador
     * @param carta
     * ultima carta lanzada por algun jugador
     */
    JugadoresService.prototype.llevarCartasExtra = function (carta) {
        var valor = carta.valor;
        //evito que sea alterado mesa.length en cada iteracion
        var cantidad_mesa = this.mesa.length;
        for (var i = 0; i < cantidad_mesa; i++) {
            valor++;
            var indice = this.mesa.findIndex(function (item) { return item.valor == valor; });
            if (indice != -1) {
                this.llevadas.push(this.mesa[indice]);
                this.mesa.splice(indice, 1);
                this.cartasService.devolverPosicion(this.mesa);
            }
            else {
                break;
            }
        }
        //Limpia
        if (!this.mesa.length) {
            this.puntos = this.puntos + 2;
            this.cartas_puntos.push(this.cartasService.obtenerPunto());
            this.notificacion_info = this.notificacion('Limpia!, +2 puntos', 'warning');
        }
    };
    /**
     * Detecta eventos relacionados al conteo de puntos
     * @returns
     * TRUE si el jugador ha ganado
     */
    JugadoresService.prototype.contarPuntos = function () {
        if (this.puntos >= 40) {
            return true;
        }
        return false;
    };
    JugadoresService.prototype.notificacion = function (mensaje, color) {
        var en = true;
        return { mensaje: mensaje, color: color, en: en };
    };
    JugadoresService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], JugadoresService);
    return JugadoresService;
}());
exports.JugadoresService = JugadoresService;
