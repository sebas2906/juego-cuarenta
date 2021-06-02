import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { MultijugadorService } from '../../services/multijugador.service';

@Component({
  selector: 'app-selector-jugador',
  templateUrl: './selector-jugador.component.html',
  styleUrls: ['./selector-jugador.component.css']
})
export class SelectorJugadorComponent implements OnInit,OnDestroy{

  public habilitar_selector=true;
  public habilitar_solicitud=false;
  public usuarios:any[]=[];
  public suscripcion:Subscription;
  public indice=-1;
  public cargando=false;
  public emisor='';
  public aceptacion;
  public estado='';

  @Output() jugadorSeleccionado:EventEmitter<string>;

  constructor(public multijugadorService: MultijugadorService) { 
    this.jugadorSeleccionado=new EventEmitter();
    
  }


  ngOnInit(): void {
    this.suscripcion=this.multijugadorService.escucharSolicitud().subscribe(resp=>{
      console.log('Solicitud de juego nueva');
      console.log(`El jugador ${resp} te ha solicitado unirte a su partida`);
      console.log('Quieres unirte?');
      this.habilitar_solicitud=true;
      this.emisor=resp as string;
    });

    this.suscripcion=this.multijugadorService.escucharUsuarios().subscribe(resp=>{
      let nombre_actual=this.multijugadorService.getNombre();
      this.usuarios=JSON.parse(resp as string);
      this.usuarios=this.usuarios.filter(usuario=>usuario.nombre!=nombre_actual);
      this.usuarios.forEach(usuario=>usuario.seleccionado=false);
      if(!this.usuarios.length){
        this.cargando=true;
        this.estado='Esperando nuevos usuarios...';
      }else{
        this.cargando=false;
        this.estado='';
      }
      console.log(this.usuarios);
    });
//=========================ANFITRION=============================
    this.suscripcion=this.multijugadorService.escucharAceptacion().subscribe(resp=>{
      console.log(`El jugador ${this.usuarios[this.indice].nombre} a ${resp?'aceptado':'ignorado'} tu invitacion`);
      this.estado=`El jugador a ${resp?'aceptado':'ignorado'} tu invitacion`;
      if(resp){
      this.habilitar_selector=(!resp as boolean);
      let payload={
        nombre:this.usuarios[this.indice].nombre,
        invitado:false
      }
      this.jugadorSeleccionado.emit(JSON.stringify(payload));
      }
    });

    this.multijugadorService.getUsuarios();
  }

  ngOnDestroy(){
    this.suscripcion.unsubscribe();
  }

  seleccion(jugador:string){
    this.indice=this.usuarios.findIndex(elemento=>elemento.nombre===jugador);
    this.usuarios.forEach(usuario=>usuario.seleccionado=false);
    this.usuarios[this.indice].seleccionado=true;
    
  }

  enviar(){
    if(this.indice!=-1){
       this.multijugadorService.nuevaSolicitud(this.usuarios[this.indice].nombre);
       this.cargando=true;
       this.estado='Esperando que el jugador acepte...';
    }
  }

  // =======================INVITACION=======================
  aceptar(){
    this.habilitar_solicitud=false;
    this.habilitar_selector=false;
    this.multijugadorService.aceptarSolicitud(this.emisor,true);
    let payload={
      nombre:this.emisor,
      invitado:true
    }
    this.jugadorSeleccionado.emit(JSON.stringify(payload));
  }

  ignorar(){
    this.multijugadorService.aceptarSolicitud(this.emisor,false);
    this.habilitar_solicitud=false;
    this.cargando=false;
  }


}
