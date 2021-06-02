import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
//npm i socket.io-client

import {io,Socket}  from 'socket.io-client';
import { environment } from 'src/environments/environment';




@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  public socketStatus = false;
  public socket: Socket;


  constructor() {
      
  }

  iniciar(){
    console.log('Iniciando Sockets...');
      this.socket = io(environment.socketConfig);
    this.checkStatus();
  }

  parar(){
    this.socket.disconnect();
  }


  checkStatus() {
    this.socket.on('connect', () => {
      this.socketStatus = true
    });

    this.socket.on('disconnect', () => {
      console.error('Desconectado del servidor');
      this.socketStatus = false;
    });
  }

  /**
   * Emite a través de sockets
   * @param evento 
   * nombre del evento con el que se quiere transmitir
   * @param payload 
   * información o mensaje (opcional)
   * @param callback 
   * función que se quiera mandar (opcional)
   */
  emit(evento: string, payload?: any, callback?: Function) {
    this.socket.emit(evento,payload,callback);
  }

  /**
   * Escucha cualquier evento que emita el server
   * @param evento 
   * evento a escuchar
   * @returns 
   * devuelve el mensaje una vez llegue
   */
  listen(evento: string) {
      return new Observable(observer => {
        this.socket.on(evento, (payload: any) => {
          observer.next(payload);
        });
      });
  }

  

}
