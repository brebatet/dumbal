import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public authData: AuthProvider) {
  }

  logoutUser() {
    this.authData.logoutUser()
      .then(authData => { this.navCtrl.setRoot('LoginPage'); });
  }

}
