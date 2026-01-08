import { Directive, EventEmitter, HostListener, inject, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { Theme } from '../../types';

@Directive({
  selector: '[appTheme]',
  standalone: true
})
export class ThemeDirective implements OnInit{

  @Input() themeInitial: Theme = 'light';
  @Output() themeSelected: EventEmitter<Theme> = new EventEmitter<Theme>();

  private readonly ionAppElement = document.querySelector('ion-app');

  private renderer2: Renderer2 = inject(Renderer2);

  ngOnInit() {
    if((this.themeInitial === 'dark' && !this.ionAppElement?.classList.contains('ion-palette-dark'))
      || this.themeInitial === 'light' && this.ionAppElement?.classList.contains('ion-palette-dark')) {
      this.switchTheme();
    }
  }

  @HostListener('click') onClick() {
    this.switchTheme();
  }

  private switchTheme() {
    //const ionAppElement = document.querySelector('ion-app');

    if(this.ionAppElement) {
      if(this.ionAppElement.classList.contains('ion-palette-dark')) {
        this.renderer2.removeClass(this.ionAppElement, 'ion-palette-dark');
        this.themeSelected.emit('light');
      } else {
        this.renderer2.addClass(this.ionAppElement, 'ion-palette-dark');
        this.themeSelected.emit('dark');
      }
    }
  }
}
