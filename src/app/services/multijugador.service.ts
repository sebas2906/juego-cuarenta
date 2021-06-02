import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { Paquete } from '../interfaces/carta';

@Injectable({
  providedIn: 'root'
})
export class MultijugadorService extends WebsocketService {
  public usuario='';

 setNombre(nombre:string){
    this.usuario=nombre;
  }

  getNombre(){
    return this.usuario;
  }

  logearUsuario() {
    return new Promise((resolve, reject) => {
      this.emit('setUsuario', {nombre:this.usuario}, (resp) => {
        resolve(resp);
      });
    });
  }

  nuevaSolicitud(receptor:string) {
    return new Promise((resolve, reject) => {
      this.emit('solicitud', {emisor:this.usuario,receptor}, (resp) => {
        resolve(resp);
      });
    });
  }

  guardarStorage(){
    localStorage.setItem('usuario',this.usuario);
  }

  escucharUsuarios(){
    return this.listen('getUsuarios');
  }

  escucharSolicitud(){
    return this.listen('solicitud');
  }

  getUsuarios(){
      this.emit('getUsuarios', {mensaje:"peticion"});
  }

  aceptarSolicitud(emisor:string, aceptacion:boolean){
    this.emit('aceptarSolicitud', {emisor,aceptacion});
}

escucharAceptacion(){
  return this.listen('aceptarSolicitud');
}

escucharPartida(){
  return this.listen('partida');
}

enviarPartida(paquete:Paquete){
  this.emit('partida',{paquete});
}



}


