import { inject, Injectable } from '@angular/core';
import { SqliteManagerService } from '../sqlite-manager/sqlite-manager.service';
import { capSQLiteChanges } from '@capacitor-community/sqlite';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {

  private readonly sqliteManagerService: SqliteManagerService = inject(SqliteManagerService);

  getSettingsByKey(key: string): Promise<string> {
    const statement = `
      SELECT value FROM settings
      WHERE key = ?;
    `;
    const values = [
      key
    ];
    return this.sqliteManagerService.executeQuery(statement, values).then((responseValues: any[] | undefined) => {
      if(responseValues && responseValues.length > 0) {
        return responseValues[0].value as string;
      }
      return '';
    });
  }

  updateSettingByKey(key: string, value: string) {
    const statement = `
      UPDATE settings 
      SET value = ? 
      WHERE key = ?;
    `;
    const values = [
      value,
      key
    ];
    return this.sqliteManagerService.executeInstruction(statement, values).then((changes: capSQLiteChanges) => {
      return changes;
    });
  }
}
