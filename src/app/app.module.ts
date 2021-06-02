import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { MenuComponent } from './pages/menu/menu.component';
import { HttpClientModule } from '@angular/common/http';
import { PcComponent } from './components/pc/pc.component';
import { FormsModule } from '@angular/forms';
import { SelectorJugadorComponent } from './components/selector-jugador/selector-jugador.component';
import { MultijugadorService } from './services/multijugador.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MenuComponent,
    PcComponent,
    SelectorJugadorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [MultijugadorService],
  bootstrap: [AppComponent]
})
export class AppModule { }
