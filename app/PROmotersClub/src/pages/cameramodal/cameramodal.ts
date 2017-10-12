import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';

@Component({
  selector: 'page-cameramodal',
  templateUrl: 'cameramodal.html'
})
export class CameramodalPage {

  public postpdv = {
    photo: '',
    work_type: '',
    market_net: '',
    brand: '',
    store: '',
    isChallenge: false
  }
  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    private params: NavParams,
    private camera: Camera
    ) {

    
  } 

  ionViewDidEnter(){
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  ionViewDidLoad() {

  }

  publicarPost(postpdv){
    console.log("Teste "+JSON.stringify(postpdv));
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
