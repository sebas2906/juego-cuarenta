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
exports.__esModule = true;
exports.ChatVozService = void 0;
var core_1 = require("@angular/core");
var sfmediastream_1 = require("sfmediastream");
var ChatVozService = /** @class */ (function () {
    function ChatVozService(multijugadorService, latencia) {
        this.multijugadorService = multijugadorService;
        this.latencia = latencia;
        this.parar_audio = false;
        this.audioStreamer = new sfmediastream_1.AudioStreamer(this.latencia);
        this.presenter = new sfmediastream_1.MediaPresenter({
            audio: {
                channelCount: 1,
                echoCancellation: false
            }
        }, 1000);
        //creamos una ganancia y le conectamos a los altavoces
        this.ganancia = this.audioStreamer.audioContext.createGain();
        this.ganancia.connect(this.audioStreamer.audioContext.destination);
    }
    ChatVozService.prototype.detectarNavegador = function () {
        this.firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    };
    ChatVozService.prototype.inicializar = function () {
        var _this = this;
        this.detectarNavegador();
        if (!this.firefox) {
            this.multijugadorService.listen('bufferHeader').subscribe(function (packet) {
                _this.audioStreamer.setBufferHeader(packet);
            });
        }
        this.multijugadorService.listen('navegador_receptor').subscribe(function () {
            _this.multijugadorService.emit('navegador', { navegador: _this.firefox, receptor: _this.receptor });
        });
        this.multijugadorService.listen('comunicacion').subscribe(function () {
            setTimeout(function () {
                _this.recibirAudio();
            }, 500);
        });
    };
    ChatVozService.prototype.setReceptor = function (receptor) {
        this.receptor = receptor;
    };
    //La transmision va en funcion del navegador del contrincante
    ChatVozService.prototype.transmitir = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                    navigator.mediaDevices.getUserMedia({
                        audio: true
                    })
                        // Success callback
                        .then(function (stream) {
                        _this.presenter = new sfmediastream_1.MediaPresenter({
                            debug: true,
                            mediaStream: stream,
                            audio: {
                                channelCount: 1,
                                echoCancellation: false
                            }
                        }, _this.latencia); // 1sec
                        _this.multijugadorService.listen('navegador').subscribe(function (nav) {
                            //Primero debe recibir el tipo de navegador del contrincante antes de transmitir
                            _this.firefox_invitado = (nav.navegador);
                            if (_this.firefox_invitado) {
                                _this.multijugadorService.listen('sync').subscribe(function () {
                                    _this.presenter.onRecordingReady = function (packet) {
                                        _this.multijugadorService.emit('bufferHeader', { buffer: packet, receptor: _this.receptor });
                                    };
                                    _this.presenter.onBufferProcess = function (packet) {
                                        _this.multijugadorService.emit('stream', { buffer: packet, receptor: _this.receptor });
                                    };
                                    _this.presenter.startRecording();
                                });
                            }
                            else {
                                //  this.multijugadorService.listen('sync').subscribe(()=>{
                                _this.presenter.onRecordingReady = function (packet) {
                                    _this.multijugadorService.emit('bufferHeader', { buffer: packet, receptor: _this.receptor });
                                };
                                _this.presenter.onBufferProcess = function (packet) {
                                    _this.multijugadorService.emit('stream', { buffer: packet, receptor: _this.receptor });
                                };
                                _this.presenter.startRecording();
                                // });
                            }
                            _this.multijugadorService.emit('comunicacion', { receptor: _this.receptor });
                        });
                        _this.multijugadorService.emit('navegador_receptor', { receptor: _this.receptor });
                    })["catch"](function (err) {
                    });
                }
                else {
                    //  console.log('getUserMedia not supported on your browser!');
                }
                return [2 /*return*/];
            });
        });
    };
    ChatVozService.prototype.parar = function () {
        this.parar_audio = !this.parar_audio;
        this.multijugadorService.emit('silenciar', { receptor: this.receptor, estado: this.parar_audio });
    };
    ChatVozService.prototype.getEstadoTransmision = function () {
        return this.presenter.recording;
    };
    ChatVozService.prototype.recibirAudio = function () {
        var _this = this;
        this.audioStreamer.debug = true;
        //conecto el AudioStreamer a la ganancia (AudioStremar----->Ganancia----->Altavoces)
        this.audioStreamer.connect(this.ganancia);
        this.audioStreamer.playStream();
        if (this.firefox) {
            this.multijugadorService.listen('bufferHeader').subscribe(function (packet) {
                _this.audioStreamer.setBufferHeader(packet);
            });
        }
        this.multijugadorService.listen('stream').subscribe(function (packet) {
            _this.audioStreamer.receiveBuffer(packet);
        });
        this.multijugadorService.listen('silenciar').subscribe(function (packet) {
            if (packet.estado) {
                _this.ganancia.gain.setValueAtTime(0, _this.audioStreamer.audioContext.currentTime);
            }
            else {
                _this.ganancia.gain.setValueAtTime(1, _this.audioStreamer.audioContext.currentTime);
            }
        });
        if (this.firefox) {
            this.multijugadorService.emit('sync', this.receptor);
        }
        //
    };
    ChatVozService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], ChatVozService);
    return ChatVozService;
}());
exports.ChatVozService = ChatVozService;
