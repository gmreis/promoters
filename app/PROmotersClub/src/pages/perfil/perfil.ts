import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NavController, NavParams } from 'ionic-angular';
import { SessionProvider } from '../../providers/session/session';


@Component({
  selector: 'page-perfil',
  templateUrl: 'perfil.html'
})
export class PerfilPage {

  user:any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public translate: TranslateService,
    private sessionProvider: SessionProvider
    ) {

    this.user = {
      photo: "../../assets/img/img/avatar-luke.png",
      name: "Mario Gomes",
      memberDate: "Set/2014",
      level: "Futuro Rock star",
      position: 12,
      points: 30.123
    }
  }

  ionViewDidLoad() {
  }

  ionViewWillEnter() {
    
  }

}
