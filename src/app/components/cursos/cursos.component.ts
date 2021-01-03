import { Component, OnInit } from '@angular/core';
import { CommonListarComponent } from '../common-listar.component';
import { BASE_ENDPOINT } from '../../config/app';
import { CursoService } from 'src/app/services/curso.service';
import { Curso } from 'src/app/models/curso';

@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.css']
})
export class CursosComponent extends CommonListarComponent<Curso, CursoService>  implements OnInit {

  protected baseEndpoint = BASE_ENDPOINT + '/cursos';

  constructor(service: CursoService) { 
    super(service);
    this.titulo = 'Listado de Cursos';
    this.nombreModel = Curso.name;
  }
}
