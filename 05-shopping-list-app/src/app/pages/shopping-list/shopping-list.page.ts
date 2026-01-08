import { Component, computed, effect, inject, Injector, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonButton, IonButtons,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem, IonItemDivider, IonItemGroup, IonLabel, IonSearchbar, IonText,
  IonTitle, IonToggle,
  IonToolbar,
  ModalController
} from '@ionic/angular/standalone';
import { FormItemComponent } from '../components/form-item/form-item.component';
import { addIcons } from 'ionicons';
import { addOutline, closeOutline, trashBin, sunnyOutline, moonOutline } from 'ionicons/icons';
import { ItemService } from '../../services/item/item.service';
import { ToastService } from '../../services/toast/toast.service';
import { IItem } from '../../models/item.model';
import { IGroupItems } from '../../models/group-items.model';
import { AlertService } from '../../services/alert/alert.service';
import { Theme } from '../../types';
import { SettingsService } from '../../services/settings/settings.service';
import { ThemeDirective } from '../../directives/theme/theme.directive';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.page.html',
  styleUrls: ['./shopping-list.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonItem, IonIcon, IonItemGroup, IonItemDivider, IonLabel, IonText, IonCheckbox, IonButton, IonSearchbar, IonButtons, IonToggle, ThemeDirective]
})
export class ShoppingListPage {

  private readonly modalCtrl: ModalController = inject(ModalController);
  private readonly itemsService: ItemService = inject(ItemService);
  private readonly toastService: ToastService = inject(ToastService);
  private readonly injector: Injector = inject(Injector);
  private readonly alertService: AlertService = inject(AlertService);
  private readonly settingsService: SettingsService = inject(SettingsService);

  private readonly itemsSignal: Signal<IItem[]> = this.itemsService.itemsSignal.asReadonly();
  public isEmptySignal: Signal<boolean> = computed(() => this.itemsSignal().length === 0);

  public theme?: Theme;
  private readonly SETTING_THEME_KEY = 'THEME';

  public groupItems: IGroupItems[] = [
    { name: 'Pendientes', items: [] },
    { name: 'Completados', items: [] }
  ];
  
  constructor() {
    addIcons({addOutline, closeOutline, trashBin, sunnyOutline, moonOutline})
  }

  async ionViewWillEnter() {
    this.itemsService.getItems();
    this.theme = await this.settingsService.getSettingsByKey(this.SETTING_THEME_KEY) as Theme;
    console.log(this.theme);
    effect(() => {
      this.groupItems[0].items = this.itemsSignal().filter(item => !item.checked);
      this.groupItems[1].items = this.itemsSignal().filter(item => item.checked);
    }, { injector: this.injector } );
  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: FormItemComponent,
      initialBreakpoint: 0.25,
      breakpoints: [0, 0.25, 0.5, 0.75]
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if(role === 'confirm') {
      this.itemsService.createItem(data).then(() => {
        this.toastService.showToast('Se ha creado el item');
      }).catch(error => {
        this.toastService.showToast('Error al crear el item');
      });
    }
  }

  public updateItem(item: IItem) {
    item.checked = !item.checked;
    this.itemsService.updateItem(item).then(() => {
      this.toastService.showToast('Se ha actualizado el item');
    }).catch(error => {
      this.toastService.showToast('Error al actualizar el item');
    });
  }

  public deleteItem(item: IItem) {
    this.itemsService.deleteItem(item).then(() => {
      this.toastService.showToast('Se ha eliminado el item');
    }).catch(error => {
      this.toastService.showToast('Error al eliminar el item');
    })
  }

  public confirmDelete(item: IItem) {
    this.alertService.alertConfirm(
      'Confirmación',
      '¿Estás seguro de que deseas eliminar este item?',
      () => this.deleteItem(item)
    )
  }

  public filterItems(event: Event) {
    const target = event.target as HTMLIonSearchbarElement;
    const value = target.value?.toString();
    this.itemsService.getItems(value);
  }

  public updateThemeSettings(theme: Theme) {
    this.settingsService.updateSettingByKey(this.SETTING_THEME_KEY, theme);
  }
}
