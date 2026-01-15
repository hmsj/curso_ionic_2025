import { Component, inject, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet, Platform } from '@ionic/angular/standalone';
import { AuthService } from './services/auth/auth.service';
import { NotificationsService } from './services/notifications/notifications.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit{

  private readonly platform: Platform = inject(Platform);
  private readonly authService: AuthService = inject(AuthService);
  private readonly notificationsService: NotificationsService = inject(NotificationsService);

  ngOnInit() {
    this.authService.checkIsLogged();

    this.platform.ready().then(() => {
      this.notificationsService.init();
    })
  }
}
