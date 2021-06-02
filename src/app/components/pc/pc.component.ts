import { Component, OnInit } from '@angular/core';
import { CartasService } from 'src/app/services/cartas.service';
import { Carta } from '../../interfaces/carta';

@Component({
  selector: 'app-pc',
  templateUrl: './pc.component.html',
  styles: [
  ]
})
export class PcComponent implements OnInit {

  

  constructor(public cartasService: CartasService) { 
  }

  ngOnInit(): void {
  }

}
