import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Platform } from '@ionic/angular';
import { CapacitorSQLite, capSQLiteChanges, capSQLiteValues } from '@capacitor-community/sqlite';
import { database } from '../../../assets/db/db.json'

@Injectable({
  providedIn: 'root',
})
export class SqliteManagerService {

  private readonly platform = inject(Platform);
  private readonly DB_NAME: string = database;//'shopping-list.db';

  public isWebSignal: WritableSignal<boolean> = signal(false);
  public isIosSignal: WritableSignal<boolean> = signal(false);
  public isReadySignal: WritableSignal<boolean>= signal(false);

  async init() {
    if(this.platform.is('desktop')){
      this.isWebSignal.set(true);
      await CapacitorSQLite.initWebStore()
    } else if(this.platform.is('ios')){
      this.isIosSignal.set(true);
    } else {
      this.isWebSignal.set(false);
      this.isIosSignal.set(false);
    }
    const dataBaseExists = await CapacitorSQLite.isDatabase({database: this.DB_NAME});
    if(!dataBaseExists.result) {
      //descargar
      this.downloadDatabase();
    } else {
      //conectar
      await this.connectDatabase();
    }
  }

  private downloadDatabase() {
    fetch('assets/db/db.json').then(async (value: Response) => {
      const jsonstring = await value.text();
      const isValid = await CapacitorSQLite.isJsonValid({jsonstring})
      if(isValid) {
        await CapacitorSQLite.importFromJson({jsonstring});
        await this.connectDatabase();
      }
    })
  }

  private async connectDatabase() {
    await CapacitorSQLite.createConnection({database: this.DB_NAME});
    await CapacitorSQLite.open({database: this.DB_NAME});
    this.isReadySignal.set(true);
  }

  executeQuery(statement: string, values: any[] = []) {
    return CapacitorSQLite.query({
      database: this.DB_NAME,
      statement,
      values //mandar aunque esté vacío para Android
    }).then((response: capSQLiteValues) => {
      if(this.isIosSignal()) {
        response.values?.shift();
      }
      return response.values;
    })
  }

  executeInstruction(statement: string, values: any[] = []) {
    return CapacitorSQLite.run({
      database: this.DB_NAME,
      statement,
      values
    }).then(async (changes: capSQLiteChanges) => {
      if(this.isWebSignal()) {
        await CapacitorSQLite.saveToStore({database: this.DB_NAME});
      }
      return changes;
    })
  }
}
