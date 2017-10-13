import { Component } from '@angular/core';
import { NavController, ViewController, AlertController, LoadingController, ToastController, Loading } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Api } from '../../providers/api/api';
import { HttpHeaders } from '@angular/common/http';
import { SessionProvider } from '../../providers/session/session';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { DomSanitizer } from '@angular/platform-browser';

declare var cordova: any;


@Component({
  selector: 'page-cameramodal',
  templateUrl: 'cameramodal.html'
})
export class CameramodalPage {

  selectedImg: string = null;
  loading: Loading;
  imgPreview:any;
  public postpdv = {
    type: '',
    supermarket: '',
    brand: '',
    store: '',
    isChallenge: false,
    faceId: '',
    longitude: '123123',
    latitude: '3123123'
  }
  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private api: Api,
    private SessionProvider: SessionProvider,
    private camera: Camera,
    private transfer: FileTransfer,
    private file: File,
    private DomSanitizer: DomSanitizer
    ) {

    
  } 

  ionViewDidEnter(){
    this.postpdv.faceId = this.SessionProvider.userData.faceId;
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  ionViewDidLoad() {

  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
 

  simpleAlert(msgt, msgs, msg){
    var alert = this.alertCtrl.create({
      title: msgt,
      subTitle: msgs,
      message: msg,
      buttons: [{ text: 'Ok' }]
    });
    alert.present();
  }

  openCam(){
    let options: CameraOptions = {
        // Some common settings are 20, 50, and 100
        quality: 100,
        allowEdit: true,
        saveToPhotoAlbum: true,
        correctOrientation: true  //Corrects Android orientation quirks
    }

    this.camera.getPicture(options).then((imageData) => {
      var currentName = imageData.substr(imageData.lastIndexOf('/') + 1);
      var correctPath = imageData.substr(0, imageData.lastIndexOf('/') + 1);
      this.salveDataURL(correctPath, currentName);
      this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
    }, (err) => {
     // Handle error
    });
  }

  openPhotoLibrary(){
    let options: CameraOptions = {
        // Some common settings are 20, 50, and 100
        quality: 100,
        // In this app, dynamically set the picture source, Camera or photo gallery
        sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
        correctOrientation: true  //Corrects Android orientation quirks
    }

    this.camera.getPicture(options).then((imageData) => {
      var currentName = imageData.substr(imageData.lastIndexOf('/') + 1);
      var correctPath = imageData.substr(0, imageData.lastIndexOf('/') + 1);
      this.salveDataURL(correctPath, currentName);
      this.copyFileToLocalDir(correctPath, currentName, this.createFileName());

    }, (err) => {
     // Handle error
    });
  }  


  private salveDataURL(correctPath, currentName){
    this.file.readAsDataURL(correctPath, currentName).then(
      file64 => {
          this.imgPreview = file64;
      }).catch(err => {
      console.log('booooooo');
    });
  }

  // Create a new name for the image
  private createFileName() {
    var d = new Date(),
    n = d.getTime(),
    newFileName =  n + ".jpg";
    return newFileName;
  }
   
  // Copy the image to a local folder
  private copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      this.selectedImg = newFileName;
    }, error => {
      this.simpleAlert('Erro', '', 'Error while storing file ');
    });
  }

  // Always get the accurate path to your apps folder
  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }

  publicarPost() {
    // Destination URL
    var url = this.api.url+"/post";
   
    // File for Upload
    var targetPath = this.pathForImage(this.selectedImg);
   
    // File name only
    var filename = this.selectedImg;
   
    var options = {
      fileKey: "photo",
      fileName: filename,
      chunkedMode: false,
      params : this.postpdv
    };
   
    const fileTransfer: FileTransferObject = this.transfer.create();
   
    this.loading = this.loadingCtrl.create({
      content: 'Uploading...',
    });
    this.loading.present();
   
    // Use the FileTransfer to upload the image
    fileTransfer.upload(targetPath, url, options).then(data => {
      this.loading.dismissAll()
       this.presentToast('Image succesful uploaded.');
    }, err => {
      this.loading.dismissAll()
      this.presentToast('Error while uploading file.');
    });
  }

}
