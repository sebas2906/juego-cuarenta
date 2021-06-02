"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.WebsocketService = void 0;
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
//npm i socket.io-client
var socket_io_client_1 = require("socket.io-client");
var environment_1 = require("src/environments/environment");
var WebsocketService = /** @class */ (function () {
    function WebsocketService() {
        this.socketStatus = false;
    }
    WebsocketService.prototype.iniciar = function () {
        console.log('Iniciando Sockets...');
        this.socket = socket_io_client_1.io(environment_1.environment.socketConfig);
        this.checkStatus();
    };
    WebsocketService.prototype.parar = function () {
        this.socket.disconnect();
    };
    WebsocketService.prototype.checkStatus = function () {
        var _this = this;
        this.socket.on('connect', function () {
            _this.socketStatus = true;
        });
        this.socket.on('disconnect', function () {
            console.error('Desconectado del servidor');
            _this.socketStatus = false;
        });
    };
    /**
     * Emite a través de sockets
     * @param evento
     * nombre del evento con el que se quiere transmitir
     * @param payload
     * información o mensaje (opcional)
     * @param callback
     * función que se quiera mandar (opcional)
     */
    WebsocketService.prototype.emit = function (evento, payload, callback) {
        this.socket.emit(evento, payload, callback);
    };
    /**
     * Escucha cualquier evento que emita el server
     * @param evento
     * evento a escuchar
     * @returns
     * devuelve el mensaje una vez llegue
     */
    WebsocketService.prototype.listen = function (evento) {
        var _this = this;
        return new rxjs_1.Observable(function (observer) {
            _this.socket.on(evento, function (payload) {
                observer.next(payload);
            });
        });
    };
    WebsocketService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], WebsocketService);
    return WebsocketService;
}());
exports.WebsocketService = WebsocketService;
