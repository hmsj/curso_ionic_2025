import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LeagueClassificationTablePage } from './league-classification-table.page';

describe('LeagueClassificationTablePage', () => {
  let component: LeagueClassificationTablePage;
  let fixture: ComponentFixture<LeagueClassificationTablePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LeagueClassificationTablePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
