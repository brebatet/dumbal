import { Component, OnInit, OnDestroy } from '@angular/core';
import { ISubscription } from "rxjs/Subscription";
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AuthProvider } from '../../providers/auth/auth';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage implements OnInit, OnDestroy {
  items: FirebaseListObservable<any>;
  players: any[];
  sub: ISubscription;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public db: AngularFireDatabase, public authData: AuthProvider) {
  }

  ngOnInit() {
    this.items = this.db.list('/players');
    this.sub = this.items.subscribe(items => this.players = items);
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  logoutUser() {
    this.authData.logoutUser()
      .then(authData => { this.navCtrl.setRoot('LoginPage'); });
  }

  clearAll() {
    let alert = this.alertCtrl.create({
      title: 'Confirm clear all players',
      message: `Do you want to clear all players ?`,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Yes',
          handler: () => {
            for (let item of this.players) {
              this.items.update(item.$key, { score: 0, rank: 0, roundPts: '' });
            }
          }
        }
      ]
    });
    alert.present();
  }

  deleteAll() {
    let alert = this.alertCtrl.create({
      title: 'Confirm delete all players',
      message: `Do you want to delete all players ?`,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.items.remove();
          }
        }
      ]
    });
    alert.present();
  }
}
