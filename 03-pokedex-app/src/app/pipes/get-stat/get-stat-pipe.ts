import { Pipe, PipeTransform } from '@angular/core';
import { IPokemon } from '../../models/pokemon.model';

@Pipe({
  name: 'getStat',
  standalone: true
})
export class GetStatPipe implements PipeTransform {

  transform(pokemon: IPokemon, nameStat: string): number {
    /*const statFound = pokemon.stats.find(stat => stat.name === nameStat);
    if(statFound) {
      return statFound.base_stat;
    }
    return 0;*/
    return pokemon.stats.find(stat => stat.name === nameStat)?.base_stat ?? 0;
  }

}
