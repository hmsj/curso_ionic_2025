import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { ToolbarComponent } from '../../components/toolbar/toolbar.component';
import { FormEventComponent } from '../../components/form-event/form-event.component';
import { IEvent } from '../../models/event.model';
import { EventsService } from '../../services/events/events.service';
import { ToastService } from '../../services/toast/toast.service';
import { Router } from '@angular/router';
import { Device, DeviceInfo } from '@capacitor/device';
import { NotificationsService } from '../../services/notifications/notifications.service';
import { INotification } from '../../models/notification.model';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.page.html',
  styleUrls: ['./create-event.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, ToolbarComponent, FormEventComponent]
})
export class CreateEventPage  {

  private readonly eventsService: EventsService = inject(EventsService);
  private readonly toastService: ToastService = inject(ToastService);
  private readonly router: Router = inject(Router);
  private readonly notificationsService: NotificationsService = inject(NotificationsService);

  public createEvent(event: IEvent) {
    this.eventsService.createEvent(event)
      .then(async () => {
      this.toastService.showToast('El evento se ha creado correctamente');

      const device: DeviceInfo = await Device.getInfo();
      if(device.platform === 'android') {
        this.sendAndroidNotification(event);
      }

      this.router.navigateByUrl('/events');
      })
      .catch((err: any) => {
        console.error(err);
        this.toastService.showToast('Se ha producido un error al crear el evento!');
      });
  }

  private sendAndroidNotification(event: IEvent) {
    const notification: INotification = {
      title: event.title,
      body: event.description,
      date: event.start,
      url: event.url
    }
    this.notificationsService.sendNotification(notification).then((notificationResponse: any) => {
      event.notificationId = notificationResponse.id;
      this.eventsService.updateEvent(event);
    });
  }
}
