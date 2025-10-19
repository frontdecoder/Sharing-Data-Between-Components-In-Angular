import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { MainService } from './main.service';
import { catchError, of, retry, Subject, take, takeUntil, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ToDoListComponent } from './to-do-list/to-do-list.component';
import { TodoStatsComponent } from './todo-stats/todo-stats.component';

export interface ToDo {
  userId: number,
  id: number,
  title: string,
  completed: boolean
}

@Component({
  selector: 'app-root',
  imports: [CommonModule, ToDoListComponent , TodoStatsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit,OnDestroy {

  toDosList = signal<ToDo[] | null>(null);
  hasError = signal(true);
  errorMessage = signal('');
  destroy$ = new Subject<void>();
  constructor(
    private mainService: MainService
  ) {

  }

  ngOnInit(): void {
    this.mainService.toDoList$.subscribe(todos => {
      this.toDosList.set(todos);
      if (todos) this.hasError.set(false);
    });
    this.getAllToDos();
  }

  getAllToDos() {
    this.mainService.getToDoList()
      .pipe(
        retry(3),
        catchError((err) => {
          console.log('Catch Error : ', err);
          return throwError(() => err);
        }),
        take(1),
        takeUntil(this.destroy$)
      )
      .subscribe({
        error: (err) => {
          this.hasError.set(true);
          this.errorMessage.set(err.message);
          console.error('Error Occurred', err)
        },
        complete: () => {
          console.log("the stream is completed");

        }
      })
  }

  onToggleTodo(updatedTodo: ToDo) {
    this.mainService.updateToDoCompletion(updatedTodo);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


}