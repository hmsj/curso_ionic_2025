import { Injectable } from '@angular/core';
import { CapacitorHttp, HttpResponse } from '@capacitor/core';
import { IPokemon } from '../../models/pokemon.model';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {

  private readonly URL_BASE = 'https://pokeapi.co/api/v2/pokemon';
  private nextUrl: string = `${this.URL_BASE}?limit=500&offset=0`;

  constructor() { }

  getPokemons() {
    if(this.nextUrl) {
      const options = {
        url: this.nextUrl,
        params: {} //añadir aunque esté vacío para Android
      }
      return CapacitorHttp.get(options)
        .then(async (response: HttpResponse) => {
          const pokemons: IPokemon[] = [];
          if(response.data) {
            const results = response.data.results;
            this.nextUrl = response.data.next;
            if(results.length > 0) {
              const promises: Promise<HttpResponse>[] = [];
              for(const pokemon of results) {
                const urlPokemon = pokemon.url;
                const optionsPokemon = {
                  url: urlPokemon,
                  params: {} //añadir aunque esté vacío para Android
                }
                promises.push(CapacitorHttp.get(optionsPokemon));
              }
              await Promise.all(promises).then((pokemonResponses: HttpResponse[]) => {
                for(const pokemonResponse of pokemonResponses) {
                  const pokemon: IPokemon = this.processPokemon(pokemonResponse.data);
                  pokemons.push(pokemon);
                }
              });
            }
            return pokemons;
          }
          return pokemons;
        })
        .catch(error => {
          console.log(error);
          return null;
        })
    }
    return null;
  }

  getPokemon(id: number) {
    const options = {
      url: `${this.URL_BASE}/${id}`,
      params: {} //añadir aunque esté vacío para Android
    }
    return CapacitorHttp.get(options)
      .then(response => this.processPokemon(response.data))
      .catch(error => console.error(error))
  }

  private processPokemon(pokemonData: any) {
    const pokemon: IPokemon = {
      id: pokemonData.id,
      name: pokemonData.name,
      type1: pokemonData.types[0].type.name,
      type2: pokemonData.types[1]?.type?.name ?? undefined,
      sprite: pokemonData.sprites.front_default,
      weight: pokemonData.weight / 10,
      height: pokemonData.height / 10,
      stats: pokemonData.stats.map((stat: any) => {
        return {
          base_stat: stat.base_stat,
          name: stat.stat.name
        }
      }),
      abilities: pokemonData.abilities
        .filter((ability: any) => !ability.is_hidden)
        .map((ability: any) => ability.ability.name)
    }

    /*if(pokemonData.types[1]) {
      pokemon.type2 = pokemonData.types[1].type.name;
    }*/

    const hiddenAbilities = pokemonData.abilities.find((ability: any) => ability.is_hidden);
    if(hiddenAbilities) {
      pokemon.hiddenAbility = hiddenAbilities.ability.name;
    }

    return pokemon;
  }
}
