import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { SqliteManagerService } from '../sqlite-manager/sqlite-manager.service';
import { IUnit } from '../../models/unit.model';

@Injectable({
  providedIn: 'root',
})
export class UnitService {

  private readonly sqliteManagerService: SqliteManagerService = inject(SqliteManagerService);
  public unitsSignal: WritableSignal<IUnit[]> = signal([]);

  getUnits() {
    const statement = `
      SELECT * 
      FROM units
      ORDER BY description 
    `;

    return this.sqliteManagerService.executeQuery(statement).then((responseValues: any[] | undefined) => {
      const units: IUnit[] = responseValues?.map(value => value as IUnit) || [];
      /*if(responseValues) {
        for(const row of responseValues) {
          const unit: IUnit = row;
          units.push(unit);
        }
      }*/
      this.unitsSignal.set(units);
      return units;
    });
  }
}
