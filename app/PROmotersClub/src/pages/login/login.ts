import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NavController, AlertController, Platform, LoadingController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';

import { FeedPage } from '../feed/feed';
import { SessionProvider } from '../../providers/session/session';
import { LocalDb } from '../../providers/local-db/local-db';


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

    let permissions = ["public_profile", "email", "user_birthday"];
    this.facebook.login(permissions).then((res: FacebookLoginResponse) => {

      console.log('Logged into Facebook!', res);
      let params = new Array();

      this.facebook.api("/me?fields=email,name,gender,birthday,id", params).then(user => {

        user.facebooktoken = res.authResponse.accessToken;
        user.facebookexpiresin = res.authResponse.expiresIn;

        this.signupFacebook(user).then(data => {
          //Se gravou os dados, direciona para homepage
          if(data == true) {
            this.navCtrl.setRoot(FeedPage);
          }
        }, err => {
            // loadingPopup.dismiss();
        });

      }, error => {
          // loadingPopup.dismiss();
      });
    }).catch((e) => {
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
   * Tenta cadastrar um novo usuário. Se o e-mail já existir para esse usuário cria uma nova senha
   */
  signupFacebook(user) {
    return new Promise(resolve => {
      if (user.gender) {
        if (user.gender == 'male') {
          user.gender = 'm';
        } else if (user.gender == 'female') {
          user.gender = 'f';
        } else {
          user.gender = '';
        }
      }

      var pwd = Math.random().toString(36).slice(-10);
      var creds = "email=" + user.email
        + "&name=" + user.name
        + "&password=" + pwd
        + "&birth=" + user.birthday
        + "&gender=" + user.gender
        + "&facebooktoken=" + user.facebooktoken
        + "&facebookexpiresin=" + user.facebookexpiresin
        + "&facebookid=" + user.id;
        this.LocalDb.set('userdata', user);
        this.LocalDb.set('islogged', true);
        resolve(true);
      var headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
      // this.http.post(this.URL_API + '/signupfacebook', creds, { headers: headers }).timeout(this.ConfigProvider.TIMEOUT).subscribe(data => {
      //   if (data.json().success) {

      //     /* Salva na memória do dispositivo */
      //     this.LocalDb.set('userdata', data.json().msg);
      //     this.LocalDb.set('isloggedin', true);
      //     /* Salva na memória na sessão do app */
      //     this.SessionProvider.userData = data.json().msg;
      //     this.SessionProvider.isloggedin = true;
      //     /* Direciona para a Home */
      //     this.navCtrl.setRoot(TabsPage);

      //   } else { /* Já possui o e-mail cadastrado */
      //     this.simpleAlert('Erro', '', 'Não foi possível estabelecer uma conexão com o servidor. Verifique sua conexão.');
      //   }
      // }, error => { this.simpleAlert('Erro', '', 'Não foi possível estabelecer uma conexão com o servidor. Verifique sua conexão.'); });
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
