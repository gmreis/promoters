import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NavController, AlertController, Platform, LoadingController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { HttpHeaders } from '@angular/common/http';

import { FeedPage } from '../feed/feed';
import { SessionProvider } from '../../providers/session/session';
import { LocalDb } from '../../providers/local-db/local-db';
import { Api } from '../../providers/api/api';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  // Our translated text strings
  private loginErrorString: string;

  constructor(public navCtrl: NavController,
      public alertCtrl: AlertController,
      public translateService: TranslateService,
      private platform: Platform,
      private facebook: Facebook,
      private LocalDb: LocalDb,
      private api: Api,
      private loadingCtrl: LoadingController,
      private SessionProvider: SessionProvider
    ) {
      //Verifica se esta logado
      this.isLogged();

      this.translateService.get('LOGIN_ERROR').subscribe((value) => {
        this.loginErrorString = value;
      })
  }

  /* Verifica na memória do disposivito se o usuário já está logado */
  isLogged() {
    let loadingPopup = this.loadingCtrl.create({
      content: 'Carregando...'
    });
    loadingPopup.present();

    this.LocalDb.get('islogged').then( (isLogged) => {
        if(isLogged == true){
            //Salva no device flag logado
            this.SessionProvider.islogged = true;

            //Busca dos dados do usuarios
            this.LocalDb.get('userdata').then( (userdatafromdevice) => {
              //Salva no device os dados do usuario
              this.SessionProvider.userData = userdatafromdevice;
              loadingPopup.dismiss();
              //Direciona para pagina home
              this.navCtrl.setRoot(FeedPage);
            },
            (error) => {
              loadingPopup.dismiss();
              this.navCtrl.setRoot(LoginPage);
            });
        } else {
            //Fica na mesma pagina
            //O usuario precisa logar
            loadingPopup.dismiss();
        }
    },
    (error) => {
      loadingPopup.dismiss();
      this.simpleAlert('Erro', '', 'Houve um problema ao verificar o login.');
    });
  }

  loginFacebook() {

    //Garante que o usaurio esteja deslogado antes de logar
    this.logoutFacebook();
  
    let permissions = ["public_profile", "user_birthday"];
    this.facebook.login(permissions).then((res: FacebookLoginResponse) => {
      // console.log('Logged into Facebook!', res);
      let params = new Array();
      this.facebook.api("/me?fields=id,name,gender,birthday,picture.type(large)", params).then(user => {

        user.facebooktoken = res.authResponse.accessToken;
        user.facebookexpiresin = res.authResponse.expiresIn;

        //Persiste os dados no banco
        this.signupFacebook(user).then(data => {
          //Se gravou os dados, direciona para homepage
          if(data == true) {
            this.navCtrl.setRoot(FeedPage);
          }
        }, err => {
          this.simpleAlert('Erro', '', 'Erro ao persistir os dados no banco!');
        });

      }, error => {
        this.simpleAlert('Erro', '', 'Erro buscar dados no Facebook!');
      });
    }).catch((e) => {
      this.simpleAlert('Erro', '', 'Error logging into Facebook!');
      console.log('Error logging into Facebook', e)
    });
  }

  logoutFacebook(){
    this.facebook.logout().then(response => {
        console.log(response);
      }, error => {
        console.log(error);
    });
  }

  /*
   * Tenta cadastrar um novo usuário.
   */
  signupFacebook(user) {
    return new Promise(resolve => {
      //Trata o campo aniversario
      if (!user.birthday) {
        user.birthday = '';
      }

      var headers = new HttpHeaders().set('Content-Type', 'application/json');
      this.api.post("user", user, { headers: headers, observe: 'response' }).subscribe((res: any) => {
        if (res.status === 200) {

          /* Salva na memória do dispositivo */
          this.LocalDb.set('userdata', res.body.user);
          this.LocalDb.set('islogged', true);
          /* Salva na memória na sessão do app */
          this.SessionProvider.userData = res.body.user;
          this.SessionProvider.islogged = true;
          /* Direciona para a Home */
          resolve(true);
        } else {
          this.simpleAlert('Erro', '', 'Problema ao autenticar no servidor. code: '+res.status);
        }
      }, error => { 
        console.log("TEst "+JSON.stringify(error))

        this.simpleAlert('Erro', '', 'Não foi possível estabelecer uma conexão com o servidor. Verifique sua conexão.'); });
    });
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
}
