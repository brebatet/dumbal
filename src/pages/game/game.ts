import { Component, OnInit, OnDestroy } from '@angular/core';
import { ISubscription } from "rxjs/Subscription";
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import * as _ from 'lodash';

@IonicPage()
@Component({
  selector: 'page-game',
  templateUrl: 'game.html',
})
export class GamePage implements OnInit, OnDestroy {
  items: FirebaseListObservable<any>;
  players: any[];
  sub: ISubscription;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public db: AngularFireDatabase) {
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
  
  addPlayer() {
    let prompt = this.alertCtrl.create({
      title: 'Player Name',
      message: "Enter a name for the new player",
      inputs: [
        {
          name: 'name',
          placeholder: 'Name'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
          }
        },
        {
          text: 'Save',
          handler: data => {
            if (data.name.length > 0) {
              this.items.push({
                name: data.name,
                score: 0,
                rank: 0,
                roundPts: ''
              });
            }
          }
        }
      ]
    });
    prompt.present();
  }

  updatePlayer(itemId, item) {
    let prompt = this.alertCtrl.create({
      title: 'Player Name',
      message: `Update the name of ${item.name}`,
      inputs: [
        {
          name: 'name',
          placeholder: 'Name',
          value: item.name
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
          }
        },
        {
          text: 'Save',
          handler: data => {
            if (data.name.length > 0) {
              item.name = data.name;
              this.items.update(itemId, item);
            }
          }
        }
      ]
    });
    prompt.present();
  }

  deletePlayer(itemId, item) {
    let alert = this.alertCtrl.create({
      title: 'Confirm delete',
      message: `Do you want to delete ${item.name} ?`,
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
            this.items.remove(itemId);
          }
        }
      ]
    });
    alert.present();
  }

  clearScore(itemId, item) {
    let alert = this.alertCtrl.create({
      title: 'Confirm clear score',
      message: `Do you want to clear ${item.name} ?`,
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
            item.score = 0;
            item.rank = 0;
            item.roundPts = '';
            this.items.update(itemId, item);
          }
        }
      ]
    });
    alert.present();
  }

  addScore(event, itemId, item) {
    let prompt = this.alertCtrl.create({
      title: 'New score',
      message: `Add a new score to ${item.name}`,
      inputs: [
        {
          name: 'score',
          placeholder: 'Score',
          type: 'number'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
          }
        },
        {
          text: 'Save',
          handler: data => {
            if (data.score.length > 0) {
              if (item.roundPts != '') {
                item.roundPts = item.roundPts + ', ' + Number(data.score);
              } else {
                item.roundPts = Number(data.score);
              }
              item.score = item.score + Number(data.score);
              this.items.update(itemId, item);
            }
          }
        }
      ]
    });
    prompt.present();
  }

  refreshRank() {
    let itemsOrderByRank = _.orderBy(this.players, ['score'], ['asc']);
    if (itemsOrderByRank && itemsOrderByRank.length) {
      itemsOrderByRank.forEach((item, index) => {
        let rank = 0;
        if (index - 1 >= 0 && itemsOrderByRank[index - 1].score == item.score) {
          rank = itemsOrderByRank[index - 1].rank;
        } else {
          rank = index + 1;
        }
        itemsOrderByRank[index].rank = rank;
        this.items.update(item.$key, { rank: rank });
      });
    }
  }

  orderByRank() {
    this.players = _.orderBy(this.players, ['rank'], ['asc']);
  }
}
