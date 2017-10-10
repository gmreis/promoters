import { Component, ViewChild } from '@angular/core';
import { Config, Nav, Platform, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TranslateService } from '@ngx-translate/core';

import { FeedPage } from '../pages/feed/feed';
import { ChallengePage } from '../pages/challenge/challenge';
import { LoginPage } from '../pages/login/login';
import { SettingsPage } from '../pages/settings/settings';

import { SessionProvider } from '../providers/session/session';
import { LocalDb } from '../providers/local-db/local-db';
 
import { Facebook } from '@ionic-native/facebook';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = FeedPage;

  pages: Array<{title: string, icone: string, component: any}>;

  constructor(private translate: TranslateService,
      private facebook: Facebook,
      private loadingCtrl: LoadingController,
      private LocalDb: LocalDb,
      private SessionProvider: SessionProvider,
      private config: Config, 
      public platform: Platform, 
      public statusBar: StatusBar, 
      public splashScreen: SplashScreen) {
   platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    this.initTranslate();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'FEED_TITLE', icone: 'md-home',component: FeedPage },
      { title: 'CHALLENGE_TITLE', icone: 'md-checkmark', component: ChallengePage },
      { title: 'INBOX_TITLE', icone: 'ios-filing-outline', component: SettingsPage },
      { title: 'CONFIG_TITLE', icone: 'md-settings', component: SettingsPage },
      { title: 'PERFIL_TITLE', icone: 'md-person', component: FeedPage }
    ];

  }

  initTranslate() {
    // Set the default language for translation strings, and the current language.
    this.translate.setDefaultLang('pt-br');

    if (this.translate.getBrowserLang() !== undefined) {
      this.translate.use(this.translate.getBrowserLang());
    }

    this.translate.get(['BACK_BUTTON_TEXT']).subscribe(values => {
      this.config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  logoutFacebook(){
    let loadingPopup = this.loadingCtrl.create({
      content: 'Carregando...'
    });
    loadingPopup.present();

    /* TODO: colocar dentro de uma promise para o carregando fazer sentido */
    this.facebook.logout().then(response => {
        this.LocalDb.deleteAllLocalStorage();
        this.SessionProvider.deleteSession();
        this.nav.setRoot(LoginPage);
        loadingPopup.dismiss();
    /* ---------------------------------- */
      }, error => {
        console.log(error);
    });
  }
}