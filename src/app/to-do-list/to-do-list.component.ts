import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToDo } from '../app.component';

@Component({
  selector: 'app-to-do-list',
  imports: [CommonModule],
  templateUrl: './to-do-list.component.html',
  styleUrl: './to-do-list.component.scss'
})
export class ToDoListComponent implements OnInit {

  @Input() todo:ToDo | null = null;
  @Output () toggleCompleted = new EventEmitter<ToDo>();

  constructor() {

  }

  ngOnInit(): void {
    
  }

  toggle() {
    if(this.todo) {
      this.todo.completed = !this.todo.completed;
      this.toggleCompleted.emit(this.todo);
    }
  }

}
