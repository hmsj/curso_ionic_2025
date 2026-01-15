import { Injectable } from '@angular/core';
import { Capacitor, CapacitorHttp, HttpResponse } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import OneSignal, { NotificationClickEvent } from 'onesignal-cordova-plugin';
import { environment } from '../../../environments/environment';
import { INotification } from '../../models/notification.model';
import moment from 'moment-timezone';
import { Browser } from '@capacitor/browser';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {

  private readonly ONE_SIGNAL_URL = 'https://onesignal.com/api/v1/notifications';

  init() {
    if(Capacitor.isPluginAvailable('PushNotifications')) {
      PushNotifications.requestPermissions().then((result) => {
        if(result.receive) {
          PushNotifications.register().then(() => {
            OneSignal.initialize(environment.oneSignalAppId);
            OneSignal.Notifications.requestPermission(true);
            OneSignal.Notifications.addEventListener('click', async (e: NotificationClickEvent) => {
              const notification = e.notification;
              const additionalData: any = notification.additionalData;
              if(additionalData['url']) {
                await Browser.open({url: additionalData['url']});
              }
            })
          });
        }
      })
    } else {
      console.log('Las notificaciones no están disponibles en este dispositivo.');
    }
  }

  sendNotification(notification: INotification) {
    const userTimezone = moment.tz.guess();
    return CapacitorHttp.post({
      url: this.ONE_SIGNAL_URL,
      params: {},
      data: {
        app_id: environment.oneSignalAppId,
        include_segments: ['Total Subscriptions'],
        headings: {
          en: notification.title
        },
        contents: {
          en: notification.body
        },
        data: {
          url: notification.url,
        },
        send_after: moment(notification.date).tz(userTimezone).format('YYYY-MM-DD HH:mm:ss [GMT]Z')
      },
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': `Basic ${environment.oneSignalRestApiKey}`
      }
    }).then((response: HttpResponse) => {
      return response.data;
    });
  }

  cancelNotification(notificationId: string) {
    return CapacitorHttp.delete({
      url: `${this.ONE_SIGNAL_URL}/${notificationId}`,
      params: {
        app_id: environment.oneSignalAppId
      },
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': `Basic ${environment.oneSignalRestApiKey}`
      }
    }).then((response: HttpResponse) => {
      return response.data;
    });
  }
}
