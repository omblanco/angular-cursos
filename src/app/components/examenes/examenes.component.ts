import { Component, OnInit } from '@angular/core';
import { CommonListarComponent } from '../common-listar.component';
import { BASE_ENDPOINT } from '../../config/app';
import { ExamenService } from 'src/app/services/examen.service';
import { Examen } from 'src/app/models/examen';

@Component({
  selector: 'app-examenes',
  templateUrl: './examenes.component.html',
  styleUrls: ['./examenes.component.css']
})
export class ExamenesComponent extends CommonListarComponent<Examen, ExamenService>  implements OnInit {

  baseEndpoint = BASE_ENDPOINT + '/examenes';

  constructor(service: ExamenService) {
    super(service);
    this.titulo = 'Listado de Examenes';
    this.nombreModel = Examen.name;    
   }

}
