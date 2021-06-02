import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MultijugadorService } from 'src/app/services/multijugador.service';



@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {

  public sel = [false, false, false];
  public en = false;
  public boton = "Jugar";
  public sonido = new Audio('assets/sonidos/menu/play.mp3');
  public usuario='';

  constructor(private router: Router,public multiService:MultijugadorService) {
    this.multiService.iniciar();
   }

  /**
   * Cambia el aspecto al cambiar de seleccion
   * @param boton 
   * seleccion actual
   */
  seleccion(boton: number) {
    this.sel = [false, false, false];
    this.sel[boton] = !this.sel[boton];
    this.en = true;
    if (this.sel[2]) {
      this.boton = "Configurar";
    } else if((this.sel[1])&&!this.multiService.socketStatus){
      this.boton = "Servidor no disponible";
      this.en=false;
    }else{
      this.boton = "Jugar";
    }
  }

  entrar(){   
    switch (this.sel.findIndex((element)=>element===true)){
        case 0:
        this.jugarSolo();
        break;
        case 1:
          if(this.usuario!=null){
            localStorage.setItem('usuario',this.usuario);
          }
          this.multiService.logearUsuario().then(()=>{
            this.multijugador();
          });
          
        break;
        case 2:
        this.configuracion();
        break;
      default:
        break;
    }
  }

  /**
   * Navega al modo jugador contra PC
   */
  jugarSolo() {
    this.sonido.play();
    this.multiService.parar();
    this.router.navigateByUrl('/home/solo');
  }

  /**
   * Navega al menu de configuraciones
   */
  configuracion() {
    this.sonido.play();
    this.router.navigateByUrl('/home/configuracion');
  }

  /**
   * Navega al modo multijugador
   */
  multijugador() {
    this.sonido.play();
    this.router.navigateByUrl('/home/multijugador');
  }

}
