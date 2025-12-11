import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonCard, IonCardContent,
  IonCardHeader,
  IonCardTitle, IonCol,
  IonContent,
  IonFab,
  IonFabButton, IonGrid,
  IonIcon,
  IonImg, IonProgressBar, IonRow, IonText,
} from '@ionic/angular/standalone';
import { PokemonService } from '../../services/pokemon/pokemon.service';
import { IPokemon } from '../../models/pokemon.model';
import { LoadingController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';
import { Router } from '@angular/router';
import { GetStatPipe } from '../../pipes/get-stat/get-stat-pipe';


@Component({
  selector: 'app-detail-pokemon',
  templateUrl: './detail-pokemon.page.html',
  styleUrls: ['./detail-pokemon.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    IonFab,
    IonFabButton,
    IonIcon,
    IonImg,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonGrid,
    IonRow,
    IonCol,
    IonText,
    GetStatPipe,
    IonProgressBar
  ]
})
export class DetailPokemonPage {
  @Input() id!: number ;

  private readonly pokemonService: PokemonService = inject(PokemonService);
  private readonly loadingController: LoadingController = inject(LoadingController);
  private readonly router: Router = inject(Router);

  public pokemon!: IPokemon;
  public pokemonStats: any[] = [
    {
      name: 'PS',
      stat: 'hp',
    },
    {
      name: 'Ataque',
      stat: 'attack'
    },
    {
      name: 'Defensa',
      stat: 'defense'
    },
    {
      name: 'At. esp.',
      stat: 'special-attack'
    },
    {
      name: 'Def. esp.',
      stat: 'special-defense'
    },
    {
      name: 'Velocidad',
      stat: 'speed'
    }
  ];
  
  constructor() {
    addIcons({closeOutline})
  }

  async ionViewWillEnter() {
    console.log('ionViewWillEnter DetailPokemonPage ' + this.id);
    const loading = await this.loadingController.create({
      message: 'Cargando...'
    });
    loading.present();
    this.pokemonService.getPokemon(this.id)
      .then(pokemon => {
        this.pokemon = pokemon!;
        console.log(this.pokemon);
      })
      .catch(error => console.error(error))
      .finally(() => loading.dismiss());
  }

  goBack() {
    this.router.navigateByUrl('/list-pokemon');
  }
}
