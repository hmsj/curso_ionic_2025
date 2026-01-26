import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Preferences } from '@capacitor/preferences';
import { KEY_TOKEN } from '../../constants';
import { CapacitorHttp } from '@capacitor/core';
import { IUser } from '../../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UsersService {

  private readonly URL_BASE = `${environment.urlServer}/users`;

  async getUser(email: string) {
    const token = await Preferences.get({key: KEY_TOKEN});
    return CapacitorHttp.get({url: `${this.URL_BASE}`, params: {email}, headers: {'Content-type': 'application/json', 'Authorization': `Bearer ${token.value}`}})
      .then((response) => {
        return response.data as IUser;
      });
  }

  createNewUser(user: IUser) {
    return CapacitorHttp.post({url: `${this.URL_BASE}`, data: {...user}, params: {}, headers: {'Content-type': 'application/json'}})
      .then((response) => response.data as IUser);
  }
}
