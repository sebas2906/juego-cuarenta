import { Injectable } from '@angular/core';
import { MultijugadorService } from './multijugador.service';
import { Subscription } from 'rxjs';
import { MediaPresenter, AudioStreamer } from 'sfmediastream';


@Injectable({
  providedIn: 'root'
})
export class ChatVozService {
  public audioStreamer: any;
  public suscripcion: Subscription;
  public firefox: boolean;
  public presenter: any;
  public firefox_invitado: boolean;
  public receptor: string;
  public parar_audio = false;

  public ganancia: any;


  constructor(public multijugadorService: MultijugadorService, public latencia: number) {
    this.audioStreamer = new AudioStreamer(this.latencia);
    this.presenter = new MediaPresenter({
      audio: {
        channelCount: 1,
        echoCancellation: false
      },
    }, 1000);

    //creamos una ganancia y le conectamos a los altavoces
    this.ganancia = this.audioStreamer.audioContext.createGain();
    this.ganancia.connect(this.audioStreamer.audioContext.destination);

  }

  detectarNavegador() {
    this.firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
  }

  inicializar() {
    this.detectarNavegador();
    if (!this.firefox) {
      this.multijugadorService.listen('bufferHeader').subscribe((packet) => {
        this.audioStreamer.setBufferHeader(packet);
      });
    }
    this.multijugadorService.listen('navegador_receptor').subscribe(() => {
      this.multijugadorService.emit('navegador', { navegador: this.firefox, receptor: this.receptor })
    });
    this.multijugadorService.listen('comunicacion').subscribe(() => {
      setTimeout(() => {
        this.recibirAudio();
      }, 500);

    });
  }

  setReceptor(receptor: string) {
    this.receptor = receptor;
  }

  //La transmision va en funcion del navegador del contrincante
  async transmitir() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia(
        {
          audio: true
        })

        // Success callback
        .then((stream) => {
          this.presenter = new MediaPresenter({
            debug: true,
            mediaStream: stream,
            audio: {
              channelCount: 1,
              echoCancellation: false
            }
          }, this.latencia); // 1sec

          this.multijugadorService.listen('navegador').subscribe((nav: { navegador: boolean }) => {

            //Primero debe recibir el tipo de navegador del contrincante antes de transmitir
            this.firefox_invitado = ((nav.navegador) as boolean);

            if (this.firefox_invitado) {
              this.multijugadorService.listen('sync').subscribe(() => {
                this.presenter.onRecordingReady = (packet) => {
                  this.multijugadorService.emit('bufferHeader', { buffer: packet, receptor: this.receptor });
                }

                this.presenter.onBufferProcess = (packet) => {
                  this.multijugadorService.emit('stream', { buffer: packet, receptor: this.receptor });
                }

                this.presenter.startRecording();


              });
            } else {
              //  this.multijugadorService.listen('sync').subscribe(()=>{
              this.presenter.onRecordingReady = (packet) => {
                this.multijugadorService.emit('bufferHeader', { buffer: packet, receptor: this.receptor });
              }

              this.presenter.onBufferProcess = (packet) => {
                this.multijugadorService.emit('stream', { buffer: packet, receptor: this.receptor });
              }
              this.presenter.startRecording();
              // });
            }
            this.multijugadorService.emit('comunicacion', { receptor: this.receptor });

          });
          this.multijugadorService.emit('navegador_receptor', { receptor: this.receptor });


        }).catch(function (err) {
        });
    } else {
    //  console.log('getUserMedia not supported on your browser!');
    }
  }

  parar() {
    this.parar_audio = !this.parar_audio;
    this.multijugadorService.emit('silenciar', { receptor: this.receptor, estado: this.parar_audio });
  }

  getEstadoTransmision() {
    return this.presenter.recording;
  }


  recibirAudio() {
    this.audioStreamer.debug = true;
    //conecto el AudioStreamer a la ganancia (AudioStremar----->Ganancia----->Altavoces)
    this.audioStreamer.connect(this.ganancia);
    this.audioStreamer.playStream();
    if (this.firefox) {
      this.multijugadorService.listen('bufferHeader').subscribe((packet) => {
        this.audioStreamer.setBufferHeader(packet);
      });
    }
    this.multijugadorService.listen('stream').subscribe((packet) => {
      this.audioStreamer.receiveBuffer(packet);
    });

    this.multijugadorService.listen('silenciar').subscribe((packet: { receptor: string, estado: boolean }) => {
      if (packet.estado) {
        this.ganancia.gain.setValueAtTime(0, this.audioStreamer.audioContext.currentTime);
      } else {
        this.ganancia.gain.setValueAtTime(1, this.audioStreamer.audioContext.currentTime);
      }

    });

    if (this.firefox) {
      this.multijugadorService.emit('sync', this.receptor);
    }
    //
  }

}

