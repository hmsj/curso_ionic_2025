import { Component, inject, OnInit, Signal } from '@angular/core';
import {
  IonButton,
  IonButtons, IonCol,
  IonContent,
  IonGrid,
  IonHeader, IonInput, IonItem, IonRow, IonSelect, IonSelectOption,
  IonToolbar,
  ModalController
} from '@ionic/angular/standalone';
import { IItem } from '../../../models/item.model';
import { UnitService } from '../../../services/unit/unit.service';
import { IUnit } from '../../../models/unit.model';
import { JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-item',
  templateUrl: './form-item.component.html',
  styleUrls: ['./form-item.component.scss'],
  imports: [
    IonHeader,
    IonContent,
    IonToolbar,
    IonButtons,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
    IonItem,
    IonInput,
    FormsModule,
    IonSelect,
    IonSelectOption
  ]
})
export class FormItemComponent implements OnInit{

  private readonly modalCtrl: ModalController = inject(ModalController);
  private readonly unitService: UnitService = inject(UnitService);

  public readonly unitsSignal: Signal<IUnit[]> = this.unitService.unitsSignal.asReadonly();

  public item: IItem = {
    description: '',
    quantity: 1,
    checked: false
  };

  ngOnInit() {
    this.unitService.getUnits();
  }

  confirm() {
    this.modalCtrl.dismiss(this.item,'confirm');
  }
}
