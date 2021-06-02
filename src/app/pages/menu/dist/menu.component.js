"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.MenuComponent = void 0;
var core_1 = require("@angular/core");
var MenuComponent = /** @class */ (function () {
    function MenuComponent(router, multiService) {
        this.router = router;
        this.multiService = multiService;
        this.sel = [false, false, false];
        this.en = false;
        this.boton = "Jugar";
        this.sonido = new Audio('assets/sonidos/menu/play.mp3');
        this.usuario = '';
        this.multiService.iniciar();
    }
    /**
     * Cambia el aspecto al cambiar de seleccion
     * @param boton
     * seleccion actual
     */
    MenuComponent.prototype.seleccion = function (boton) {
        this.sel = [false, false, false];
        this.sel[boton] = !this.sel[boton];
        this.en = true;
        if (this.sel[2]) {
            this.boton = "Configurar";
        }
        else if ((this.sel[1]) && !this.multiService.socketStatus) {
            this.boton = "Servidor no disponible";
            this.en = false;
        }
        else {
            this.boton = "Jugar";
        }
    };
    MenuComponent.prototype.entrar = function () {
        var _this = this;
        switch (this.sel.findIndex(function (element) { return element === true; })) {
            case 0:
                this.jugarSolo();
                break;
            case 1:
                if (this.usuario != null) {
                    localStorage.setItem('usuario', this.usuario);
                }
                this.multiService.logearUsuario().then(function () {
                    _this.multijugador();
                });
                break;
            case 2:
                this.configuracion();
                break;
            default:
                break;
        }
    };
    /**
     * Navega al modo jugador contra PC
     */
    MenuComponent.prototype.jugarSolo = function () {
        this.sonido.play();
        this.multiService.parar();
        this.router.navigateByUrl('/home/solo');
    };
    /**
     * Navega al menu de configuraciones
     */
    MenuComponent.prototype.configuracion = function () {
        this.sonido.play();
        this.router.navigateByUrl('/home/configuracion');
    };
    /**
     * Navega al modo multijugador
     */
    MenuComponent.prototype.multijugador = function () {
        this.sonido.play();
        this.router.navigateByUrl('/home/multijugador');
    };
    MenuComponent = __decorate([
        core_1.Component({
            selector: 'app-menu',
            templateUrl: './menu.component.html',
            styleUrls: ['./menu.component.css']
        })
    ], MenuComponent);
    return MenuComponent;
}());
exports.MenuComponent = MenuComponent;
