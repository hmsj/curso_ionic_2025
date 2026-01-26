import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonButton, IonCol, IonGrid, IonInput, IonItem, IonRow } from '@ionic/angular/standalone';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../services/auth/auth.service';
import { IUser } from '../../models/user.model';
import { ITokenUser } from '../../models/token-user.model';
import { ToastService } from '../../services/toast/toast.service';
import { Preferences } from '@capacitor/preferences';
import { KEY_TOKEN } from '../../constants';
import { UsersService } from '../../services/users/users.service';
import { UserOrderService } from '../../services/user-order/user-order.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    ReactiveFormsModule,
    IonGrid,
    IonRow,
    IonCol,
    IonInput,
    IonItem,
    TranslatePipe,
    IonButton
  ]
})
export class LoginComponent {

  @Input() showButtonBack: boolean = false;

  @Output() doLogin: EventEmitter<void> = new EventEmitter();
  @Output() back: EventEmitter<void> = new EventEmitter();
  @Output() newAccount: EventEmitter<void> = new EventEmitter();

  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  private readonly authService: AuthService = inject(AuthService);
  private readonly toastService: ToastService = inject(ToastService);
  private readonly translateService: TranslateService = inject(TranslateService);
  private readonly usersService: UsersService = inject(UsersService);
  private readonly userOrderService: UserOrderService = inject(UserOrderService);

  public formLogin: FormGroup = this.formBuilder.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  });

  public login() {
    const user: IUser = this.formLogin.value;
    this.authService.login(user.email, user.password)
      .then(async (token: ITokenUser) => {
        if(token) {
          this.toastService.showToast(this.translateService.instant('label.login.success'));
          await Preferences.set({key: KEY_TOKEN, value: token.accessToken});
          const userDB = await this.usersService.getUser(user.email);
          this.userOrderService.setUser(userDB);
          this.doLogin.emit();
        } else {
          this.toastService.showToast(this.translateService.instant('label.login.error'));
        }
      }).catch(() => this.toastService.showToast(this.translateService.instant('label.login.error')));
  }

  public exit() {
    this.back.emit();
  }

  createNewAccount() {
    this.newAccount.emit();
  }

}
