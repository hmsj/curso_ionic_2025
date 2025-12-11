import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonCol,
  IonContent,
  IonGrid,
  IonImg,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonRow,
  IonText,
} from '@ionic/angular/standalone';
import { PokemonService } from '../../services/pokemon/pokemon.service';
import { IPokemon } from '../../models/pokemon.model';
import { InfiniteScrollCustomEvent, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-pokemon',
  templateUrl: './list-pokemon.page.html',
  styleUrls: ['./list-pokemon.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    IonGrid,
    IonRow,
    IonCol,
    IonImg,
    IonText,
    IonInfiniteScroll,
    IonInfiniteScrollContent
  ]
})
export class ListPokemonPage{

  private readonly pokemonService: PokemonService = inject(PokemonService);
  private readonly loadingController: LoadingController = inject(LoadingController);
  private readonly router: Router = inject(Router);

  public pokemons: IPokemon[] = [];

  ionViewWillEnter() {
    console.log('ionViewWillEnter ListPokemonPage');
    this.morePokemon();
  }

  async morePokemon(event?: InfiniteScrollCustomEvent) {
    const promisePokemons = this.pokemonService.getPokemons();

    if(promisePokemons) {
      let loading: any;
      if(!event) {
        loading = await this.loadingController.create({
          message: 'Cargando...'
        });
        loading.present();
      }

      promisePokemons
        .then((pokemons: any) => {
          console.log(pokemons);
          this.pokemons = this.pokemons.concat(pokemons);
        })
        .catch(error => console.error(error))
        .finally(() => {
          loading?.dismiss();
          event?.target?.complete();
        });
    } else {
      event?.target?.complete();
    }
  }

  goDetail(pokemon: IPokemon) {
    this.router.navigate(['detail-pokemon', pokemon.id]);
  }

}
