import { Component } from '@angular/core';
import { NavController, ModalController, ModalOptions } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { CameramodalPage } from '../cameramodal/cameramodal';
import { LocalDb } from '../../providers/local-db/local-db';

@Component({
  selector: 'page-feed',
  templateUrl: 'feed.html'
})
export class FeedPage {

	private feedItems: any = [];
  teste2:any;
  constructor(public navCtrl: NavController,
      public modalCtrl: ModalController,
      private LocalDb: LocalDb,

    private camera: Camera) {

  	this.feedItems = [{
      avatarURL: 'assets/img/img/marty-avatar.png',
      imgURL: 'assets/img/img/advance-card-bttf.png',
      userName: 'Marty McFly',
      location: 'Angeloni - Florianopolis/SC',
      likes: 12,
      comments: 4
    },
    {
      avatarURL: 'assets/img/img/sarah-avatar.png.jpeg',
      imgURL: 'assets/img/img/advance-card-tmntr.jpg',
      userName: 'Sarah Connor',
      location: 'Big - Florianopolis/SC',
      likes: 30,
      comments: 64
    },
    {
      avatarURL: 'assets/img/img/ian-avatar.png',
      imgURL: 'assets/img/img/advance-card-jp.jpg',
      userName: 'Dr. Ian Malcolm',
      location: 'Imperatriz - Florianopolis/SC',
      likes: 46,
      comments: 66
    },
    {
      avatarURL: 'assets/img/img/avatar-ts-potatohead.png',
      imgURL: 'assets/img/img/advance-card-machu-picchu-1.jpg',
      userName: 'Batata',
      location: 'Hippo - Florianopolis/SC',
      likes: 24,
      comments: 41
    }]
  }

  openModal() {
    let myModalOption: ModalOptions = {
      enableBackdropDismiss: false
    };
    let myModal = this.modalCtrl.create(CameramodalPage, {data: {}}, myModalOption);
    myModal.present();
  }

  teste(){
             console.log("teste1 ");

    this.LocalDb.get('userTest').then( (teste) => {
        this.teste2 = JSON.stringify(teste);
             console.log("teste ");
             console.log("teste "+JSON.stringify(teste));
            });
  }

  testeCam(){
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: true
    }

    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64:
     let base64Image = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
     // Handle error
    });
  }
}
