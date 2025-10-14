import { Component, OnInit, signal } from '@angular/core';
import { MainService } from './main.service';
import { catchError, of, retry, take, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';

interface ToDo {
  userId: number,
  id: number,
  title: string,
  completed: boolean
}

@Component({
  selector: 'app-root',
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  toDosList = signal<ToDo[] | null>(null);
  hasError = signal(true);
  errorMessage = signal('');
  constructor(
    private mainService: MainService
  ) {

  }

  ngOnInit(): void {
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
        take(1)
      )
      .subscribe({
        next: (v: any) => {
          this.toDosList.set(v);
          this.hasError.set(false);
        },
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
}
