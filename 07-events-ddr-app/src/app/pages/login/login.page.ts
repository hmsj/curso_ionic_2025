import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonButton, IonContent, IonInput, IonItem } from '@ionic/angular/standalone';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IUser } from '../../models/user.model';
import { AuthService } from '../../services/auth/auth.service';
import { ToastService } from '../../services/toast/toast.service';
import { ToolbarComponent } from '../../components/toolbar/toolbar.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, ReactiveFormsModule, IonItem, IonInput, IonButton, RouterLink, ToolbarComponent]
})
export class LoginPage {

  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  private readonly authService: AuthService = inject(AuthService);
  private readonly toastService: any = inject(ToastService);
  private readonly router: Router = inject(Router);

  public loginForm = this.formBuilder.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  });

  ionViewWillEnter() {
    this.loginForm.controls.email.setValue('');
    this.loginForm.controls.password.setValue('');
  }

  public login() {
    const user: IUser = this.loginForm.value as IUser;
    this.authService.login(user.email, user.password)
      .then(() => {
        this.toastService.showToast('Login realizado con éxito!');
        this.router.navigate(['/create-event']);
      })
      .catch((err: any) => {
        console.error(err);
        this.toastService.showToast('Error al realizar el login!');
      })
  }
}
