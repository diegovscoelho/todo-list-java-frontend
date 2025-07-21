import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App { // Nome da classe é 'App' e não 'AppComponent'
  protected readonly title = signal('todo-app');
}