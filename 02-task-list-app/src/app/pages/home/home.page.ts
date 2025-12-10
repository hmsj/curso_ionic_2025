import { Component, inject } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonInput,
  IonButton,
  IonIcon,
  IonList,
  IonListHeader,
  IonLabel,
  IonItemSliding,
  IonItemOptions,
  IonItemOption, IonReorder, IonReorderGroup
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { addOutline, trashOutline } from 'ionicons/icons';
import { AlertService } from '../../services/alert/alert.service';
import { ItemReorderEventDetail } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonInput,
    FormsModule,
    IonButton,
    IonIcon,
    IonList,
    IonListHeader,
    IonLabel,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    IonReorder,
    IonReorderGroup
  ]
})
export class HomePage {

  public task: string = '';
  public tasks: string[] = [];

  private readonly alertService: AlertService = inject(AlertService);
private readonly KEY_TASKS: string = 'ddr_key_tasks';

  constructor() {
    addIcons({addOutline, trashOutline})
  }

  async ionViewWillEnter() {
    const taskPreferences = await Preferences.get({ key: this.KEY_TASKS });

    if(taskPreferences.value) {
      const tasks = JSON.parse(taskPreferences.value);
      if(Array.isArray(tasks)) {
        this.tasks = tasks;
      }
    }
  }

  addTask() {
    if(this.existsTask(this.task)) {
      this.alertService.alertMessage('Error!', 'La tarea ya existe!');
    } else {
      this.tasks.push(this.task);
      this.saveTasks();
      this.alertService.alertMessage('Éxito!', 'Tarea añadida!');
    }
    this.task = '';

  }

  confirmDelete(task: string) {
    this.alertService.alertConfirm('Confirmación', `¿Estás seguro de que deseas eliminar la tarea "${task}"?`, () => this.removeTask(task))
  }

  private existsTask(task: string) {
    return this.tasks.find((item: string) => (
      item.toUpperCase().trim() === task.toUpperCase().trim()
    ));
  }

  private removeTask(task: string) {
    const index = this.tasks.findIndex((item: string) => task.toUpperCase().trim() === item.toUpperCase().trim());
    if(index > -1) {
      this.tasks.splice(index, 1);
      this.saveTasks();
    }

  }

  orderTasks(ev: CustomEvent<ItemReorderEventDetail>) {
    this.tasks = ev.detail.complete(this.tasks);
    this.saveTasks();
  }

  saveTasks() {
    Preferences.set({ key: this.KEY_TASKS, value: JSON.stringify(this.tasks) });
  }
}
