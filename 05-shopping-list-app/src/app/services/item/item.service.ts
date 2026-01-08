import { inject, Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { SqliteManagerService } from '../sqlite-manager/sqlite-manager.service';
import { IItem } from '../../models/item.model';
import { capSQLiteChanges } from '@capacitor-community/sqlite';

@Injectable({
  providedIn: 'root',
})
export class ItemService {

  private readonly sqliteManagerService: SqliteManagerService = inject(SqliteManagerService);
  public itemsSignal: WritableSignal<IItem[]> = signal([]);

  createItem(item: IItem) {
    const statement = `
        INSERT INTO items 
        (description, quantity, unit, checked)
        VALUES (?, ?, ?, ?)
    `
    const values = [item.description, item.quantity, item.unit?.id, false];

    return this.sqliteManagerService.executeInstruction(statement, values).then((changes: capSQLiteChanges) => {
      if(changes.changes?.lastId) {
        item.id = changes.changes.lastId;
        this.itemsSignal.update(items => [...items, item]);
      }
      return changes;
    })
  }

  getItems(description?: string) {
    // Items sin unidades
    /*const statement = `
      SELECT * 
      FROM items i 
    `;*/

    // Items con unidades
    let statement = `
      SELECT i.id, i.description, i.quantity, i.checked, 
             u.id as unitId, u.description AS unitDescription
      FROM items i LEFT JOIN units u
      ON i.unit = u.id
    `;

    const values: any[] = [];
    if(description) {
      statement += ` WHERE lower(i.description) LIKE ?`;
      values.push(`%${description.toLowerCase()}%`);
    }
    
    return this.sqliteManagerService.executeQuery(statement, values).then((responseValues: any[] | undefined) => {
      const items: IItem[] = responseValues?.map(value => this.processItem(value)) || [];
      this.itemsSignal.set(items);
      return items;
    });
  }

  private processItem(value: any) {
    const item: IItem = {
      id: value.id,
      description: value.description,
      quantity: value.quantity,
      checked: value.checked == 1
    };
    if(value.unitId) {
      item.unit = {
        id: value.unitId,
        description: value.unitDescription
      };
    }
    return item;
  }

  updateItem(item: IItem) {
    const statement = `
      UPDATE items 
      SET description = ?, 
          quantity = ?, 
          unit = ?, 
          checked = ? 
      WHERE id = ?
    `;
    const values = [
      item.description,
      item.quantity,
      item.unit?.id,
      item.checked,
      item.id
    ];
    return this.sqliteManagerService.executeInstruction(statement, values).then((changes: capSQLiteChanges) => {
      if(changes.changes?.changes! > 0) {
        this.itemsSignal.update(items => items.map(itemSignal => itemSignal.id === item.id ? item : itemSignal));
      }
      return changes;
    });
  }

  deleteItem(item: IItem) {
    const statement = `DELETE FROM items WHERE id = ?`;
    const values = [item.id];
    return this.sqliteManagerService.executeInstruction(statement, values).then((changes: capSQLiteChanges) => {
      if(changes.changes?.changes! > 0) {
        console.log(changes);
        this.itemsSignal.update(items => items.filter(itemSignal => itemSignal.id !== item.id));
      }
      return changes;
    })
  }
}
