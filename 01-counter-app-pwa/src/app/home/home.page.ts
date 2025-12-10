import { Component } from '@angular/core';
import { IonHeader, IonContent, IonButton, IonFooter, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronDownOutline, chevronUpOutline } from 'ionicons/icons';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonHeader,
    IonContent,
    IonButton,
    IonFooter,
    IonIcon
  ],
})
export class HomePage {

  public counter: number = 0;
  public readonly MIN: number = 0;
  public readonly MAX: number = 20;
  private readonly KEY_NUMBER: string = 'ddr_key_number';

  constructor() {
    addIcons({chevronUpOutline, chevronDownOutline})
  }

  async ionViewWillEnter() {
    console.log('ionViewWillEnter HomePage');

    const counterPreferences = await Preferences.get({key: this.KEY_NUMBER});

    if(counterPreferences.value) {
      const num = +counterPreferences.value; //(parseInt(counterPreferences.value))
      if(Number.isNaN(num) || (num < this.MIN || num > this.MAX)) {
        this.counter = this.MIN;
        this.saveNum();
      } else {
        this.counter = num;
      }
    }
  }

  up() {
    if(this.counter < this.MAX) {
      this.counter++;
      this.saveNum();
    }
    console.log('Número después de up ', this.counter);
  }

  down() {
    if(this.counter > this.MIN) {
      this.counter--;
      this.saveNum();
    }
    console.log('Número después de down ', this.counter);
  }

  saveNum() {
    Preferences.set({key: this.KEY_NUMBER, value: this.counter.toString()});
  }
}
