import { AsyncPipe, CommonModule } from '@angular/common';
import { MainService } from './../main.service';
import { Component, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-todo-stats',
  imports: [CommonModule , AsyncPipe],
  templateUrl: './todo-stats.component.html',
  styleUrl: './todo-stats.component.scss'
})
export class TodoStatsComponent implements OnInit {
  completedCount!: Observable<number>;
  totalCount!: Observable<number>;
  constructor(private MainService: MainService) { }
  ngOnInit(): void {
    this.completedCount = this.MainService.toDoList$.pipe(
      map(todos => {
        return todos ? todos.filter(t => t.completed).length : 0
      })
    );

    this.totalCount = this.MainService.toDoList$.pipe(
      map(todos => todos ? todos.length : 0)
    )
  }



}
