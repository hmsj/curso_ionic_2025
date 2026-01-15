import { Component, inject, Signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonCard, IonCardContent, IonChip,
  IonCol,
  IonContent, IonFab, IonFabButton, IonFooter,
  IonGrid, IonIcon,
  IonItem, IonLabel, IonRefresher, IonRefresherContent,
  IonRow,
  IonText, IonToolbar
} from '@ionic/angular/standalone';
import { ToolbarComponent } from '../../components/toolbar/toolbar.component';
import { EventsService } from '../../services/events/events.service';
import { IEvent } from '../../models/event.model';
import { addIcons } from 'ionicons';
import {
  add,
  desktopOutline,
  caretForwardCircleOutline,
  videocamOutline,
  ticketOutline,
  earthOutline, pencilOutline, closeOutline, trashOutline
} from 'ionicons/icons';
import { ActionSheetController, LoadingController } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { Browser } from '@capacitor/browser';
import { AlertService } from '../../services/alert/alert.service';
import { ToastService } from '../../services/toast/toast.service';
import { NotificationsService } from '../../services/notifications/notifications.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, ToolbarComponent, IonGrid, IonRow, IonCol, IonText, IonCard, IonCardContent, IonItem, DatePipe, IonChip, IonIcon, IonLabel, IonRefresher, IonRefresherContent, IonFooter, IonToolbar, IonFab, IonFabButton, RouterLink]
})
export class EventsPage {

  private readonly eventsService: any = inject(EventsService);
  private readonly loadingCtrl: LoadingController = inject(LoadingController);
  private readonly authService: AuthService = inject(AuthService);
  private readonly actionSheetCtrl: ActionSheetController = inject(ActionSheetController);
  private readonly router: Router = inject(Router);
  private readonly alertService: AlertService = inject(AlertService);
  private readonly toastService: ToastService = inject(ToastService);
  private readonly notificationsService: NotificationsService = inject(NotificationsService);

  public events: IEvent[] = [];
  public typeSearch: string = '';
  public isAuthenticatedSignal: Signal<boolean> = this.authService.isAuthenticatedSignal.asReadonly();

  constructor() {
    addIcons({desktopOutline, caretForwardCircleOutline, videocamOutline, ticketOutline, add, earthOutline, pencilOutline, closeOutline, trashOutline});
  }

  ionViewWillEnter() {
    this.getEvents()
  }

  async getEvents(type?: string) {
    const loading = await this.loadingCtrl.create({message: 'Cargando eventos...'});
    loading.present();
    this.eventsService.getFutureEvents(type)
      .then((events: IEvent[]) => {
      this.events = events;
      })
      .catch((err: any) => {
        console.error('Error fetching events:', err);
        this.events = [];
      })
      .finally(() => loading.dismiss());
  }

  async filterEventsByType(type: string) {
    this.typeSearch = this.typeSearch === type ? '': type;
    await this.getEvents(this.typeSearch);
  }

  refreshEvents(event: CustomEvent) {
    this.typeSearch = '';
    this.getEvents();
    (event.target as HTMLIonRefresherElement).complete()
  }

  clickEvent(event: IEvent) {
    if(this.isAuthenticatedSignal()) {
      this.presentActions(event);
    } else {
      this.openURL(event.url);
    }
  }

  async openURL(url: string) {
    if(url) {
      await Browser.open({url});
    }
  }

  async presentActions(event: IEvent) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Acciones',
      buttons: [
        {
          text: 'Abrir URL',
          icon: 'earth-outline',
          handler: () => {
            this.openURL(event.url);
          }
        },
        {
          text: 'Actualizar evento',
          icon: 'pencil-outline',
          handler: () => {
            this.router.navigate(['/update-event', event.id]);
          }
        },
        {
          text: 'Eliminar evento',
          icon: 'trash-outline',
          handler: () => {
            this.deleteEventConfirm(event);
          }
        },
        {
          text: 'Cerrar',
          icon: 'close-outline',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  private deleteEventConfirm(event: IEvent) {
    this.alertService.alertConfirm(
      'Confirmación',
      '¿Estás seguro de que quieres eliminar este evento?',
      () => this.deleteEvent(event),
    )
  }

  private async deleteEvent(event: IEvent) {
    await this.eventsService.deleteEvent(event.id).then(() => {
      this.toastService.showToast('El evento se ha eliminado correctamente');
      if(event.notificationId) {
        this.notificationsService.cancelNotification(event.notificationId);
      }
      this.getEvents(this.typeSearch);
    }).catch((err: any) => {
      this.toastService.showToast('Se ha producido un error al eliminar el evento!');
    });

  }
}
