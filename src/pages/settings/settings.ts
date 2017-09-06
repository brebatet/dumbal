import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage implements OnInit {
  items: FirebaseListObservable<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public db: AngularFireDatabase) {
  }

  ngOnInit() {
    this.items = this.db.list('/players');
  }

  ionViewDidLoad() {
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
