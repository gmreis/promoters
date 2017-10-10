import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-feed',
  templateUrl: 'feed.html'
})
export class FeedPage {

	private feedItems: any = [];

  constructor(public navCtrl: NavController) {

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

}
