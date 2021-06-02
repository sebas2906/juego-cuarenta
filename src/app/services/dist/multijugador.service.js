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
exports.MultijugadorService = void 0;
var core_1 = require("@angular/core");
var websocket_service_1 = require("./websocket.service");
var MultijugadorService = /** @class */ (function (_super) {
    __extends(MultijugadorService, _super);
    function MultijugadorService() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.usuario = '';
        return _this;
    }
    MultijugadorService.prototype.setNombre = function (nombre) {
        this.usuario = nombre;
    };
    MultijugadorService.prototype.getNombre = function () {
        return this.usuario;
    };
    MultijugadorService.prototype.logearUsuario = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.emit('setUsuario', { nombre: _this.usuario }, function (resp) {
                resolve(resp);
            });
        });
    };
    MultijugadorService.prototype.nuevaSolicitud = function (receptor) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.emit('solicitud', { emisor: _this.usuario, receptor: receptor }, function (resp) {
                resolve(resp);
            });
        });
    };
    MultijugadorService.prototype.guardarStorage = function () {
        localStorage.setItem('usuario', this.usuario);
    };
    MultijugadorService.prototype.escucharUsuarios = function () {
        return this.listen('getUsuarios');
    };
    MultijugadorService.prototype.escucharSolicitud = function () {
        return this.listen('solicitud');
    };
    MultijugadorService.prototype.getUsuarios = function () {
        this.emit('getUsuarios', { mensaje: "peticion" });
    };
    MultijugadorService.prototype.aceptarSolicitud = function (emisor, aceptacion) {
        this.emit('aceptarSolicitud', { emisor: emisor, aceptacion: aceptacion });
    };
    MultijugadorService.prototype.escucharAceptacion = function () {
        return this.listen('aceptarSolicitud');
    };
    MultijugadorService.prototype.escucharPartida = function () {
        return this.listen('partida');
    };
    MultijugadorService.prototype.enviarPartida = function (paquete) {
        this.emit('partida', { paquete: paquete });
    };
    MultijugadorService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], MultijugadorService);
    return MultijugadorService;
}(websocket_service_1.WebsocketService));
exports.MultijugadorService = MultijugadorService;
