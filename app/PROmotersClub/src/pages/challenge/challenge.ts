import { Component } from '@angular/core';
import { NavController, ModalController, ModalOptions } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { CameramodalPage } from '../cameramodal/cameramodal';


@Component({
  selector: 'page-challenge',
  templateUrl: 'challenge.html'
})
export class ChallengePage {
  selectedItem: any;
  icons: string[];
  items: Array<{title: string, note: string, icon: string}>;

  constructor(public navCtrl: NavController, 
    public modalCtrl: ModalController,
    public translateService: TranslateService
    ) {
    
  }

  openModal() {
    let myModalOption: ModalOptions = {
      enableBackdropDismiss: false
    };
    let myModal = this.modalCtrl.create(CameramodalPage, {data: {}}, myModalOption);
    myModal.present();
  }
}
