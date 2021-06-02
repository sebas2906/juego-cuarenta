"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.SelectorJugadorComponent = void 0;
var core_1 = require("@angular/core");
var SelectorJugadorComponent = /** @class */ (function () {
    function SelectorJugadorComponent(multijugadorService) {
        this.multijugadorService = multijugadorService;
        this.habilitar_selector = true;
        this.habilitar_solicitud = false;
        this.usuarios = [];
        this.indice = -1;
        this.cargando = false;
        this.emisor = '';
        this.estado = '';
        this.jugadorSeleccionado = new core_1.EventEmitter();
    }
    SelectorJugadorComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.suscripcion = this.multijugadorService.escucharSolicitud().subscribe(function (resp) {
            console.log('Solicitud de juego nueva');
            console.log("El jugador " + resp + " te ha solicitado unirte a su partida");
            console.log('Quieres unirte?');
            _this.habilitar_solicitud = true;
            _this.emisor = resp;
        });
        this.suscripcion = this.multijugadorService.escucharUsuarios().subscribe(function (resp) {
            var nombre_actual = _this.multijugadorService.getNombre();
            _this.usuarios = JSON.parse(resp);
            _this.usuarios = _this.usuarios.filter(function (usuario) { return usuario.nombre != nombre_actual; });
            _this.usuarios.forEach(function (usuario) { return usuario.seleccionado = false; });
            if (!_this.usuarios.length) {
                _this.cargando = true;
                _this.estado = 'Esperando nuevos usuarios...';
            }
            else {
                _this.cargando = false;
                _this.estado = '';
            }
            console.log(_this.usuarios);
        });
        //=========================ANFITRION=============================
        this.suscripcion = this.multijugadorService.escucharAceptacion().subscribe(function (resp) {
            console.log("El jugador " + _this.usuarios[_this.indice].nombre + " a " + (resp ? 'aceptado' : 'ignorado') + " tu invitacion");
            _this.estado = "El jugador a " + (resp ? 'aceptado' : 'ignorado') + " tu invitacion";
            if (resp) {
                _this.habilitar_selector = !resp;
                var payload = {
                    nombre: _this.usuarios[_this.indice].nombre,
                    invitado: false
                };
                _this.jugadorSeleccionado.emit(JSON.stringify(payload));
            }
        });
        this.multijugadorService.getUsuarios();
    };
    SelectorJugadorComponent.prototype.ngOnDestroy = function () {
        this.suscripcion.unsubscribe();
    };
    SelectorJugadorComponent.prototype.seleccion = function (jugador) {
        this.indice = this.usuarios.findIndex(function (elemento) { return elemento.nombre === jugador; });
        this.usuarios.forEach(function (usuario) { return usuario.seleccionado = false; });
        this.usuarios[this.indice].seleccionado = true;
    };
    SelectorJugadorComponent.prototype.enviar = function () {
        if (this.indice != -1) {
            this.multijugadorService.nuevaSolicitud(this.usuarios[this.indice].nombre);
            this.cargando = true;
            this.estado = 'Esperando que el jugador acepte...';
        }
    };
    // =======================INVITACION=======================
    SelectorJugadorComponent.prototype.aceptar = function () {
        this.habilitar_solicitud = false;
        this.habilitar_selector = false;
        this.multijugadorService.aceptarSolicitud(this.emisor, true);
        var payload = {
            nombre: this.emisor,
            invitado: true
        };
        this.jugadorSeleccionado.emit(JSON.stringify(payload));
    };
    SelectorJugadorComponent.prototype.ignorar = function () {
        this.multijugadorService.aceptarSolicitud(this.emisor, false);
        this.habilitar_solicitud = false;
        this.cargando = false;
    };
    __decorate([
        core_1.Output()
    ], SelectorJugadorComponent.prototype, "jugadorSeleccionado");
    SelectorJugadorComponent = __decorate([
        core_1.Component({
            selector: 'app-selector-jugador',
            templateUrl: './selector-jugador.component.html',
            styleUrls: ['./selector-jugador.component.css']
        })
    ], SelectorJugadorComponent);
    return SelectorJugadorComponent;
}());
exports.SelectorJugadorComponent = SelectorJugadorComponent;
