import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { IonApp, IonRouterOutlet, Platform } from '@ionic/angular/standalone';
import { TranslateService } from '@ngx-translate/core';
import { Device, GetLanguageCodeResult } from '@capacitor/device';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { Network } from '@capacitor/network';
import { Router } from '@angular/router';
import config from '../../capacitor.config';
import { UserOrderService } from './services/user-order/user-order.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, ToolbarComponent, FooterComponent],
})
export class AppComponent implements OnInit{

  private readonly platform: Platform = inject(Platform);
  private readonly translateService: TranslateService = inject(TranslateService);
  private readonly router: Router = inject(Router);
  private readonly userOrderService: UserOrderService = inject(UserOrderService);
  public loadSignal: WritableSignal<boolean> = signal(false);

  ngOnInit() {
    this.platform.ready().then(async () => {
      const language: GetLanguageCodeResult = await Device.getLanguageCode();
      this.translateService.use(language.value ? language.value : 'es');
      this.checkNetwork();
      await this.userOrderService.initOrder();
      config.plugins!.CapacitorHttp!.enabled = true;

      this.loadSignal.set(true);
    });
  }

  checkNetwork() {
    Network.addListener('networkStatusChange', status => {
      if(!status.connected) {
        this.router.navigate(['/not-network']);
      } else {
        this.router.navigate(['/categories']);
      }
    })
  }
}
