import { Component, CUSTOM_ELEMENTS_SCHEMA, effect, inject, Injector, OnInit, Signal } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { SqliteManagerService } from './services/sqlite-manager/sqlite-manager.service';
import { LoadingController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppComponent implements OnInit{

  private readonly sqliteManagerService: SqliteManagerService = inject(SqliteManagerService);
  private readonly platform: Platform = inject(Platform);
  private readonly loadingCtrl: LoadingController = inject(LoadingController);
  private readonly injector = inject(Injector);

  public isWebSignal: Signal<boolean> = this.sqliteManagerService.isWebSignal.asReadonly();
  public isIosSignal: Signal<boolean> = this.sqliteManagerService.isIosSignal.asReadonly();
  public isReadySignal: Signal<boolean> = this.sqliteManagerService.isReadySignal.asReadonly();

  ngOnInit() {
    this.initApp();
  }

  private async initApp() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando...',
      duration: 3000
    });
    loading.present();

    this.platform.ready().then(() => {
      this.sqliteManagerService.init();
    });

    effect(() => {
      if(this.isReadySignal()) {
        loading.dismiss();
      }
    }, {injector: this.injector});
  }
}
