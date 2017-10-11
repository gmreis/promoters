import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';

@Component({
  selector: 'page-cameramodal',
  templateUrl: 'cameramodal.html'
})
export class CameramodalPage {

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
    // let data = { 'foo': 'bar' };
    // this.viewCtrl.dismiss(data);
    this.viewCtrl.dismiss();
  }

  ionViewDidLoad() {

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
