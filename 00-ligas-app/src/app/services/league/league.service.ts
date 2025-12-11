import { Injectable } from '@angular/core';
import { CapacitorHttp, HttpResponse } from '@capacitor/core';
import { environment } from '../../../environments/environment';
import { ILeague } from '../../models/league.model';
import { from } from 'rxjs';
import { ISeason } from '../../models/season.model';
import { IClassification } from '../../models/classification.model';

@Injectable({
  providedIn: 'root',
})
export class LeagueService {

  getFootballLeagues() {
    const options = {
      url: `${environment.apiURL}/all_leagues.php`,
      params: {}
    }
    return from(CapacitorHttp.get(options)
      .then((response: HttpResponse) => {
        const leagues = response.data['leagues'] as ILeague[];
        if(!leagues) return [];
        return leagues;
      }).catch(() => []));
  }

  getSeasons(leagueId: string) {
    const options = {
      url: `${environment.apiURL}/search_all_seasons.php`,
      params: {
        'id': leagueId,
      }
    }
    return from(CapacitorHttp.get(options)
      .then((response: HttpResponse) => {
        const seasons = response.data['seasons'] as ISeason[];
        if(!seasons) return [];
        return seasons.reverse();
      }).catch(() => [])
    );
  }

  getTableClassification(leagueId: string, seasonId: string) {
    const options = {
      url: `${environment.apiURL}/lookuptable.php`,
      params: {
        'l': leagueId,
        's': seasonId,
      }
    }
    return from(CapacitorHttp.get(options)
      .then((response: HttpResponse) => {
        const classification = response.data['table'] as IClassification[];
        if(!classification) return [];
        return classification;
      })
      .catch(() => [])
    );
  }
}
