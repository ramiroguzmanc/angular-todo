import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, Injector, signal } from '@angular/core';
import {v4 as uuid} from 'uuid'
import { Task, TaskFilter } from './types';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
 tasks = signal<Task[]>([])

 newTaskControl = new FormControl('', {
	nonNullable: true,
	validators: [
		Validators.required,
		Validators.minLength(1),
		]
 })

 filter = signal(TaskFilter.ALL)
 filteredTasks = computed(() => {
	const filter = this.filter()
	const tasks = this.tasks()

	if(filter === TaskFilter.PENDING){
		return tasks.filter((task) => !task.completed)
	}

	if(filter === TaskFilter.COMPLETED){
		return tasks.filter(task => task.completed)
	}

	return tasks

 })
 TaskFilter = TaskFilter
 injector = inject(Injector)

 ngOnInit(){
	const localStorageTasks = localStorage.getItem('tasks')
	if(localStorageTasks){
		const tasks = JSON.parse(localStorageTasks)
		this.tasks.set(tasks)
	}
	this.trackTasks()
 }

 trackTasks(){
	effect(() => {
		const tasks = this.tasks()
		localStorage.setItem('tasks', JSON.stringify(tasks))
	}, {injector: this.injector})
 }

 changeFilter(filter: TaskFilter){
	this.filter.set(filter)
 }

 addTask(){
	// const $taskInput = ev.target as HTMLInputElement
	// const newTaskValue = $taskInput.value.trim()
	// if(!newTaskValue.length) return alert('Debe escribir una actividad')
	const value = this.newTaskControl.value
	const valueIsEmpty = value.trim() === ''
	if(this.newTaskControl.invalid || valueIsEmpty) return

	this.tasks.update((tasks) => [...tasks, {
		id: uuid(),
		title: value,
		completed: false
}])
	// $taskInput.value = ''
	this.newTaskControl.reset()
 }

 deleteTask(id: string){
	this.tasks.update((tasks) => tasks.filter((task) => task.id !== id))
 }

 completeTask(id: string){
	this.tasks.update((tasks) => (
		tasks.map(task => {
			if(task.id === id){
				return {
					...task,
					completed: !task.completed
				}
			} else {
				return task
			}
		})
	))
 }

 enableEditMode(taskId: string){
	this.tasks.update((tasks) => (
		tasks.map(task => {
			if(task.id === taskId) {
				return {
					...task,
					editing: true
				}
			}
			return {
				...task,
				editing: false
			}
		})
	))
 }


 updateTask(taskId: string, event: Event){
	const newTaskTitle = (event.target as HTMLInputElement).value.trim()

	this.tasks.update(tasks => (
		tasks.map(task => {
			if(task.id === taskId){
				return {
					...task,
					title: newTaskTitle,
					editing: false
				}
			}
			return task
		})
	))
 }


 get incompleteTaskCount(){
	// return this.tasks().filter(task => task.completed !== true).length
	return this.filteredTasks().length
 }

}
