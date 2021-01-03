import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Curso } from 'src/app/models/curso';
import { Examen } from 'src/app/models/examen';
import { CursoService } from 'src/app/services/curso.service';
import { ExamenService } from 'src/app/services/examen.service';
import {map, flatMap} from 'rxjs/operators'
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-asignar-examenes',
  templateUrl: './asignar-examenes.component.html',
  styleUrls: ['./asignar-examenes.component.css']
})
export class AsignarExamenesComponent implements OnInit {

  curso: Curso;

  autocompleteControl = new FormControl();
  examenesFiltrados: Examen[] = [];
  examenesAsignar: Examen[] = [];
  examenes: Examen[] = [];

  dataSource : MatTableDataSource<Examen>;
  @ViewChild(MatPaginator, {static: true}) paginator : MatPaginator;

  mostrarColumnas: string[] = ['nombre', 'asignatura', 'eliminar'];
  mostrarColumnasExamenes: string[] = ['id', 'nombre', 'asignaturas', 'eliminar'];
  pageSizeOptions = [3, 5, 10, 20, 50];

  tabIndex = 0;

  constructor(private route: ActivatedRoute, 
    private router: Router, 
    private cursoService: CursoService, 
    private examenService: ExamenService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id: number = + params.get('id');
      this.cursoService.ver(id).subscribe(c =>  {
        this.curso = c;
        this.examenes = this.curso.examenes;
        this.iniciarPaginador();
      });
    });

    this.autocompleteControl.valueChanges.pipe(
      map(valor => typeof valor === 'string' ? valor: valor.nombre), 
      flatMap(valor => valor ? this.examenService.filtrarPorNombre(valor): [])
    ).subscribe(examenes => this.examenesFiltrados = examenes);
  }

  private iniciarPaginador() {
    this.dataSource = new MatTableDataSource<Examen>(this.examenes);
    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = 'Registros por página';
  }

  mostrarNombre(examen? : Examen) : string{
    return examen ? examen.nombre : '';
  }

  seleccionarExamen(event: MatAutocompleteSelectedEvent): void {
    const examen = event.option.value as Examen;
    if (!this.existe(examen.id)) {
      this.examenesAsignar = this.examenesAsignar.concat(examen);

      console.log(this.examenesAsignar);
    } else {
      Swal.fire(
        'Error',
        `El examen ${examen.nombre} ya está asignado al curso`,
        'error'
      );
    }

    this.autocompleteControl.setValue('');
    event.option.deselect();
    event.option.focus();    
  }

  private existe(id:number) :boolean {
    let existe = false;

    this.examenesAsignar.concat(this.examenes)
    .forEach(e => {
      if (id === e.id) {
        existe = true;
      }
    });

    return existe;
  }

  eliminarDelAsignar(examen: Examen) {
    this.examenesAsignar = this.examenesAsignar.filter(e => examen.id !== e.id);
  };

  asignar(): void {
    this.cursoService.asignarExamenes(this.curso, this.examenesAsignar)
    .subscribe(curso => {
      this.examenes = this.examenes.concat(this.examenesAsignar);
      this.iniciarPaginador();
      this.examenesAsignar = [];
      
      Swal.fire(
        'Asignados:',
        `Examenes asignados con éxito al curso ${curso.nombre}`,
        'success'
      );

      this.tabIndex = 2;
    });
  }

  eliminarExamenDelCurso(examen: Examen): void {
    Swal.fire({
      title: 'Cuidado:',
      text: `¿Seguro que desea eliminar a ${examen.nombre} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.value) {

        this.cursoService.eliminarExamen(this.curso, examen)
          .subscribe(curso => {
            this.examenes = this.examenes.filter(e => e.id !== examen.id);
            this.iniciarPaginador();
            Swal.fire(
              'Eliminado:',
              `Examen ${examen.nombre} eliminado con éxito del curso ${curso.nombre}.`,
              'success'
            );
          });
      }
    });
  }
}
