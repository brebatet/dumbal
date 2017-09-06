import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public authData: AuthProvider) {
  }

  ionViewDidLoad() {
  }

  logoutUser() {
    this.authData.logoutUser()
      .then(authData => { this.navCtrl.setRoot('LoginPage'); });
  }

}
