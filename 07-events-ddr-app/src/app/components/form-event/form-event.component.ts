import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IEvent } from '../../models/event.model';
import moment from 'moment';
import {
  IonButton, IonDatetime, IonDatetimeButton, IonFab, IonFabButton, IonIcon,
  IonInput,
  IonItem,
  IonLabel, IonModal,
  IonSelect,
  IonSelectOption,
  IonTextarea
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-form-event',
  templateUrl: './form-event.component.html',
  styleUrls: ['./form-event.component.scss'],
  imports: [
    ReactiveFormsModule,
    IonInput,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonTextarea,
    IonButton,
    IonDatetimeButton,
    IonModal,
    IonDatetime,
    IonFab,
    IonFabButton,
    IonIcon,
    RouterLink
  ]
})
export class FormEventComponent  implements OnInit {

  @Input() event?: IEvent;

  @Output() submitForm: EventEmitter<IEvent> = new EventEmitter<IEvent>();

  private formBuilder: FormBuilder = inject(FormBuilder);

  public eventForm: FormGroup = new FormGroup({});
  public minDate = moment().format('YYYY-MM-DDTHH:mm');

  constructor() {
    addIcons({chevronBackOutline});
  }

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.event ??= {
      title: '',
      description: '',
      start: moment().add(1, 'd').startOf('day').format('YYYY-MM-DDTHH:mm'),
      type: 'blog',
      url: ''
    };
    this.eventForm = this.formBuilder.group({
      id: [this.event.id],
      title: [this.event.title, Validators.required],
      description: [this.event.description, Validators.required],
      start: [this.event.start ?? this.minDate, Validators.required],
      type: [this.event.type ?? 'blog', Validators.required],
      url: [this.event.url, [
        Validators.required,
        Validators.pattern('https?://.+')
      ]],
      notificationId: [this.event.notificationId]
    })
  }

  public submit() {
    const eventCreated: IEvent = this.eventForm.value;
    if(!eventCreated.url.startsWith('http://') && !eventCreated.url.startsWith('https://')) {
      eventCreated.url = 'http://' + eventCreated.url;
    }
    this.submitForm.emit(eventCreated);
  }
}
