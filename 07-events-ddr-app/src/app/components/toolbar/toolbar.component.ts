import { Component, inject, Input } from '@angular/core';
import { IonButton, IonButtons, IonHeader, IonIcon, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth/auth.service';
import { addIcons } from 'ionicons';
import { logOutOutline, logInOutline } from 'ionicons/icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  imports: [
    IonHeader,
    IonIcon,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonButton
  ]
})
export class ToolbarComponent {

  @Input() titlePage: string = '';
  @Input() showButtons: boolean = true;

  private readonly authService: AuthService = inject(AuthService);
  private readonly router: Router = inject(Router);
  public isAuthenticatedSignal = this.authService.isAuthenticatedSignal.asReadonly();

  constructor() {
    addIcons({logOutOutline, logInOutline})
  }

  public logout() {
    this.authService.logout().then(() => this.goToLogin());
  }

  public goToLogin() {
    this.router.navigateByUrl('/login');
  }

}
