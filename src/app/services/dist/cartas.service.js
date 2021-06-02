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
exports.CartasService = void 0;
var core_1 = require("@angular/core");
var CartasService = /** @class */ (function () {
    function CartasService(http) {
        this.http = http;
        this.manos = {};
        this.puntos = [];
        //public mesa: Carta[] = [];
        this.posiciones = []; //posiciones de las cartas lanzadas a la mesa movidas
        this.posiciones_completas = []; //posiciones originales
    }
    /**
     * inicializa un nuevo naipe, lo baraja, crea los puntos y separa las manos
     * segun la cantidad de jugadores seteados
     * @param numero_de_jugadores
     * indica la cantidad de jugadores
     * @returns
     * devuelve el naipe de la mesa
     */
    CartasService.prototype.inicializar = function (numero_de_jugadores) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!JSON.parse(localStorage.getItem('cartas'))) return [3 /*break*/, 1];
                        //obteniendo de local
                        this.cartas = JSON.parse(localStorage.getItem('cartas'));
                        return [3 /*break*/, 4];
                    case 1:
                        //obteniendo de api
                        _a = this;
                        return [4 /*yield*/, this.nuevoNaipe()];
                    case 2:
                        //obteniendo de api
                        _a.identificador = (_c.sent());
                        _b = this;
                        return [4 /*yield*/, this.cargarNaipe()];
                    case 3:
                        _b.cartas = (_c.sent());
                        localStorage.setItem('cartas', JSON.stringify(this.cartas));
                        _c.label = 4;
                    case 4:
                        this.cargarPuntos();
                        this.cartas.cards = this.barajarNaipe(this.cartas.cards);
                        this.asignarValores(this.cartas.cards);
                        this.crearManos(numero_de_jugadores);
                        return [2 /*return*/, this.cartas.cards];
                }
            });
        });
    };
    //seters y getters
    /**
     * Permite setear una carta del arreglo puntos a la vez
     * @param carta
     */
    CartasService.prototype.setPunto = function (carta) {
        carta.volteado = false;
        this.puntos.push(carta);
    };
    /**
     * Setea un arreglo de puntos al arreglo
     * @param puntos
     */
    CartasService.prototype.setPuntos = function (puntos) {
        this.puntos = __spreadArrays(puntos);
    };
    /**
     * @returns
     * Obtengo el naipe actual
     * (no incluye a los puntos y manos)
     */
    CartasService.prototype.obtenerNaipe = function () {
        return this.cartas.cards;
    };
    /**
     * @returns
     * Obtiene las manos actuales
     */
    CartasService.prototype.obtenerManos = function () {
        return this.manos;
    };
    /**
     * @returns
     * Devuelve el arreglo actual de puntos
     */
    CartasService.prototype.obtenerPuntos = function () {
        return this.puntos;
    };
    /**
    * Elimina una carta del arreglo puntos del servicio
    * @returns
    * Devuelve la carta borrada
    */
    CartasService.prototype.obtenerPunto = function () {
        return this.puntos.shift();
    };
    /**
     * Asigno valores a cada carta en orden
     * @param cartas
     * cartas a asignar
     */
    CartasService.prototype.asignarValores = function (cartas) {
        cartas.forEach(function (carta) {
            if (parseInt(carta.value)) {
                carta.valor = parseInt(carta.value);
            }
            else {
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
    };
    /**
     * Genera un nuevo naipe y regresa una promesa con el identificador del naipe
     */
    CartasService.prototype.nuevoNaipe = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.http.get("https://deckofcardsapi.com/api/deck/new/?jokers_enabled=true").subscribe(function (cartas) {
                resolve(cartas.deck_id);
            });
        });
    };
    /**
     * Baraja un arreglo de naipes de cualquier cantidad
     * @param cartas
     * Arreglo de cartas
     */
    CartasService.prototype.barajarNaipe = function (cartas) {
        return this.shuffle(cartas);
    };
    /**
     * Inicializa un arreglo de jugadores que contiene cada uno
     * 5 cartas y retira estas del naipe principal
     * @param cantidad_de_jugadores
     * numero de jugadores
     */
    CartasService.prototype.crearManos = function (cantidad_de_jugadores) {
        var j = 0;
        var arreglo_temporal = [];
        for (var i = 0; i < cantidad_de_jugadores; i++) {
            for (j = j; j < 5 * (i + 1); j++) {
                arreglo_temporal.push(this.cartas.cards[j]);
                this.cartas.cards.splice(j, 1);
            }
            this.manos[i] = arreglo_temporal;
            arreglo_temporal = [];
        }
    };
    /**
     * Carga un arreglo con un naipe del identificador previamente obtenido
     */
    CartasService.prototype.cargarNaipe = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.http.get("https://deckofcardsapi.com/api/deck/" + _this.identificador + "/draw/?count=54").subscribe(function (cartas) {
                resolve(cartas);
            });
        });
    };
    /**
     * Carga un arreglo de las cartas correspondientes a los puntos (8,9,10 y jockers)
     * y los retira del naipe principal
     */
    CartasService.prototype.cargarPuntos = function () {
        var _this = this;
        var arreglo_temporal = [];
        this.cartas.cards.forEach(function (carta) {
            if (carta.value === "8" || carta.value === "9" || carta.value === "10" || carta.value === "JOKER") {
                carta.volteado = false;
                _this.puntos.push(carta);
            }
            else {
                arreglo_temporal.push(carta);
            }
        });
        this.cartas.cards = [];
        this.cartas.cards = arreglo_temporal;
    };
    /**
     * Regresa un nuevo arreglo con el contenito ordenado aleatoriamente
     * @param arreglo1
     * arreglo a ingresar
     */
    CartasService.prototype.shuffle = function (arreglo1) {
        var _a;
        var arreglo = __spreadArrays(arreglo1);
        for (var i = arreglo.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            _a = [arreglo[j], arreglo[i]], arreglo[i] = _a[0], arreglo[j] = _a[1];
        }
        return arreglo;
    };
    /**
     * Esparce el naipe aleatoriamente en las coordenadas fijadas, devuelve
     * TRUE si no se pueden esparcir mas cartas. Estas coordenadas son seteadas
     * en la ultima carta de la mesa
     * @param mesa
     * Arreglo de cartas de mesa donde se asignará la nueva posición
     * @param multijugador
     * TRUE setea al metodo en modo multijugador
     */
    CartasService.prototype.esparcir = function (mesa, multijugador) {
        if (multijugador === void 0) { multijugador = false; }
        this.posiciones_completas = [
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
        if (mesa.length <= (multijugador ? 2 : 1)) {
            this.posiciones = this.shuffle(this.posiciones_completas);
        }
        if (this.posiciones.length) {
            mesa[mesa.length - 1].top = this.posiciones[0].top;
            mesa[mesa.length - 1].left = this.posiciones[0].left;
            mesa[mesa.length - 1].visibility = 'visible';
            this.posiciones.shift();
        }
        else {
            console.error("No se puede mostrar mas cartas en la mesa");
            return true;
        }
        return false;
    };
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
    CartasService.prototype.devolverPosicion = function (mesa) {
        var _this = this;
        var _loop_1 = function (i) {
            var indicador = this_1.posiciones.findIndex(function (item) { return item.top === _this.posiciones_completas[i].top; });
            if (indicador == -1) {
                indicador = mesa.findIndex(function (item) { return item.top === _this.posiciones_completas[i].top; });
                if (indicador == -1) {
                    this_1.posiciones.push(this_1.posiciones_completas[i]);
                    return "break";
                }
            }
        };
        var this_1 = this;
        for (var i = 0; i < this.posiciones_completas.length; i++) {
            var state_1 = _loop_1(i);
            if (state_1 === "break")
                break;
        }
    };
    /**
     * Invierte las cartas de izquierda a derecha una a la vez
     * @param puntos
     * Arreglo de cartas de los puntos
     * @returns
     * Regresa un arreglo con las cartas volteadas retirando
     * las que no han sido volteadas previamente
     */
    CartasService.prototype.devolverPuntos = function (puntos) {
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
    };
    CartasService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], CartasService);
    return CartasService;
}());
exports.CartasService = CartasService;
