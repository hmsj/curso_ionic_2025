import { Component, OnInit } from '@angular/core';
import { IonCol, IonContent, IonGrid, IonImg, IonRow, IonText } from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-not-network',
  templateUrl: './not-network.page.html',
  styleUrls: ['./not-network.page.scss'],
  standalone: true,
  imports: [IonContent, IonGrid, IonRow, IonCol, IonImg, IonText, TranslatePipe]
})
export class NotNetworkPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
