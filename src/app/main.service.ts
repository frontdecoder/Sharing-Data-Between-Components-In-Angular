import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, tap } from "rxjs";
import { ToDo } from "./app.component";

@Injectable({
    providedIn: 'root'
})

export class MainService {
    private toDoListSubject = new BehaviorSubject<ToDo[] | null>(null);
    public toDoList$ = this.toDoListSubject.asObservable();
    constructor(
        private http: HttpClient
    ) { }

    getToDoList() {
        return this.http.get<ToDo[]>('https://jsonplaceholder.typicode.com/todos?_limit=10')
            .pipe(
                tap((todos: any) => this.toDoListSubject.next(todos))
            )
    }

    updateToDoCompletion(updateTodo: ToDo) {
        const currentList = this.toDoListSubject.getValue();
        if (currentList) {
            const newList: any = currentList.map(todo => {
                return todo.id === updateTodo.id ? { ...todo, completed: updateTodo.completed } : todo
            });
            this.toDoListSubject.next(newList);
        }
    }
}