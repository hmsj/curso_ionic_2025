import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListPokemonPage } from './list-pokemon.page';

describe('ListPokemonPage', () => {
  let component: ListPokemonPage;
  let fixture: ComponentFixture<ListPokemonPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPokemonPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
