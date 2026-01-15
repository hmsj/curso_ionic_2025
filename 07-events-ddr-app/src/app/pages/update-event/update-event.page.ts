import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonButton, IonContent, IonItem, IonText } from '@ionic/angular/standalone';
import { ToolbarComponent } from '../../components/toolbar/toolbar.component';
import { FormEventComponent } from '../../components/form-event/form-event.component';
import { IEvent } from '../../models/event.model';
import { EventsService } from '../../services/events/events.service';
import { Router, RouterLink } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { ToastService } from '../../services/toast/toast.service';
import { INotification } from '../../models/notification.model';
import { NotificationsService } from '../../services/notifications/notifications.service';
import { Device, DeviceInfo } from '@capacitor/device';

@Component({
  selector: 'app-update-event',
  templateUrl: './update-event.page.html',
  styleUrls: ['./update-event.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, ToolbarComponent, FormEventComponent, IonText, IonItem, IonButton, RouterLink]
})
export class UpdateEventPage {

  @Input() id!: string;

  private readonly eventsService: EventsService = inject(EventsService);
  private readonly loadingCtrl: LoadingController = inject(LoadingController);
  private readonly toastService: ToastService = inject(ToastService);
  private readonly router: Router = inject(Router);
  private readonly notificationsService: NotificationsService = inject(NotificationsService);

  public event!: IEvent | null;
  public load: boolean = false;

  ionViewWillEnter() {
    console.log(this.id);
    this.getEvent();
  }

  private async getEvent() {
    const loading = await this.loadingCtrl.create({message: 'Cargando eventos...'});
    loading.present();
    this.eventsService.getEventById(this.id)
      .then((event: IEvent) => {
        this.event = event;
      })
      .catch((err: any) => {
        this.event = null;
        console.error(err);
      })
      .finally(() => {
        loading.dismiss();
        this.load = true;
      });
  }

  public updateEvent(event: IEvent) {
    this.eventsService.updateEvent(event)
      .then(async () => {
        this.toastService.showToast('El evento se ha actualizado correctamente');
        const device: DeviceInfo = await Device.getInfo();
        if(device.platform === 'android') {
          this.updateAndroidNotification(event);
        }

        this.router.navigateByUrl('/events');
      })
      .catch((err: any) => {
        console.error(err);
        this.toastService.showToast('Se ha producido un error al actualizar el evento!');
      });
  }

  private updateAndroidNotification(event: IEvent) {
    if(event.notificationId) {
      this.notificationsService.cancelNotification(event.notificationId);
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
}
