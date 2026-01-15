import { inject, Injectable, signal } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { Auth, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly afApp: FirebaseApp = inject(FirebaseApp);
  private readonly auth: Auth = getAuth(this.afApp);

  public isAuthenticatedSignal = signal<boolean>(this.isLoggedIn());

  public login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  public logout() {
    return signOut(this.auth);
  }

  public checkIsLogged() {
    onAuthStateChanged(this.auth, (user) => {
      this.isAuthenticatedSignal.set(user !== null);
    })
  }

  private isLoggedIn() {
    return this.auth.currentUser !== null;
  }
}
