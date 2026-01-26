import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonButton, IonCol, IonGrid, IonInput, IonItem, IonRow } from '@ionic/angular/standalone';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { UsersService } from '../../services/users/users.service';
import { IUser } from '../../models/user.model';
import { ToastService } from '../../services/toast/toast.service';
import { UserOrderService } from '../../services/user-order/user-order.service';
import { AuthService } from '../../services/auth/auth.service';
import { ITokenUser } from '../../models/token-user.model';
import { Preferences } from '@capacitor/preferences';
import { KEY_TOKEN } from '../../constants';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss'],
  imports: [ReactiveFormsModule, IonGrid, IonRow, IonCol, IonItem, IonInput, TranslatePipe, IonButton]
})
export class CreateAccountComponent {

  @Input() showButtonBack: boolean = false;
  @Output() back: EventEmitter<void> = new EventEmitter();
  @Output() doCreateAccount: EventEmitter<void> = new EventEmitter();

  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  private readonly usersService: UsersService = inject(UsersService);
  private readonly toastService: ToastService = inject(ToastService);
  private readonly translateService: TranslateService = inject(TranslateService);
  private readonly userOrderService: UserOrderService = inject(UserOrderService);
  private readonly authService: AuthService = inject(AuthService);

  public formNewAccount: FormGroup = this.formBuilder.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
    address: ['', Validators.required]
  });

  public createAccount() {
    const user = this.formNewAccount.value;
    this.usersService.createNewUser(user).then(async (userDB: IUser) => {
      if(userDB) {
        this.toastService.showToast(this.translateService.instant('label.create.account.success'));
        const token: ITokenUser = await this.authService.login(userDB.email, userDB.password);
        Preferences.set({key: KEY_TOKEN, value: token.accessToken});
        this.userOrderService.setUser(userDB);
        this.doCreateAccount.emit();
      } else {
        this.toastService.showToast(this.translateService.instant('label.create.account.error'));
      }
    }).catch(() => this.toastService.showToast(this.translateService.instant('label.create.account.error')));
  }

  goBack() {
    this.back.emit();
  }
}
