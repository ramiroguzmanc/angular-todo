import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-labs',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './labs.component.html',
  styleUrl: './labs.component.css'
})


export class LabsComponent {
	welcomeMessage = 'Hola';
  tasks = [
    'Instalar el Angular CLI',
    'Crear un nuevo proyecto',
    'Crear los componentes',
  ]
	person = {
		name: 'Juan',
		age: 30,
		avatar: 'https://www.gravatar.com/avatar/27205e5c51cb03f862138b22bcb5dc20f94a342e744ff6df1b8dc8af3c865109'
	}

	signalName = signal('Ramiro Guzmán C.');

	colorControl = new FormControl()
	widthControl = new FormControl(50, {
		nonNullable: true,
	})
	nameControl = new FormControl('', {
		nonNullable: true,
		validators: [
			Validators.required,
			Validators.minLength(3)
		]
	})

	constructor(){
		this.colorControl.valueChanges.subscribe(value => console.log(value))
	}

	clickHandler() {
		console.log('Hola desde el evento click');
	}

	dblClickHandler() {
		console.log('Hola desde el evento dblclick');
	}

	handleAgeChange(ev: Event) {
		const newAgeValue = (ev.target as HTMLInputElement).value;
		this.person.age = Number(newAgeValue);
	}

	handleNameChange(ev: Event) {
		const newNameValue = (ev.target as HTMLInputElement).value;
		this.person.name = newNameValue;
	}

	handleSignalChange(ev: Event) {
		const newSignalValue = (ev.target as HTMLInputElement).value;
		this.signalName.set(newSignalValue);
	}

}
