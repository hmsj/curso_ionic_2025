import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonCol,
  IonContent,
  IonGrid,
  IonHeader, IonIcon, IonImg, IonPopover,
  IonRow,
  IonSelect, IonSelectOption, IonText,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import { LeagueService } from '../../services/league/league.service';
import { first, last, Observable } from 'rxjs';
import { ILeague } from '../../models/league.model';
import { ISeason } from '../../models/season.model';
import { IClassification } from '../../models/classification.model';
import { addIcons } from 'ionicons';
import { checkmarkCircle, closeCircle, removeCircle } from 'ionicons/icons';
import { ReversePipe } from '../../pipes/reverse/reverse.pipe';

@Component({
  selector: 'app-league-classification-table',
  templateUrl: './league-classification-table.page.html',
  styleUrls: ['./league-classification-table.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonGrid, IonRow, IonCol, IonSelect, IonSelectOption, IonText, IonImg, ReversePipe, IonIcon, IonPopover]
})
export class LeagueClassificationTablePage implements OnInit{

  private readonly leagueService: LeagueService = inject(LeagueService);

  public leagues$: Observable<ILeague[]> = this.leagueService.getFootballLeagues();
  public seasons$: Observable<ISeason[]> = new Observable<ISeason[]>();
  public classification$: Observable<IClassification[]> = new Observable<IClassification[]>;

  public leagueSelected: string = '';
  public seasonSelected: string = '';

  ngOnInit(): void {
    addIcons({
      closeCircle,
      removeCircle,
      checkmarkCircle
    });
  }

  getSeasons() {
    this.seasons$ = this.leagueService.getSeasons(this.leagueSelected);
    this.seasons$.pipe(first()).subscribe({
      next: (seasons: ISeason[])=> {
        if(seasons.length > 0) {
          this.seasonSelected = seasons[0].strSeason;
          this.getClassificationTable();
        }
      }
    });
  }

  getClassificationTable() {
    this.classification$ = this.leagueService.getTableClassification(this.leagueSelected, this.seasonSelected);
  }

  protected readonly last = last;
}
