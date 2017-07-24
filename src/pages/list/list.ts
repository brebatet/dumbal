import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ActionSheetController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import * as _ from 'lodash';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  selectedItem: any;
  icons: string[];
  items: FirebaseListObservable<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public actionSheetCtrl: ActionSheetController, db: AngularFireDatabase) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');
    this.items = db.list('/players');
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
            this.updateAllRank();
          }
        }
      ]
    });
    alert.present();
  }

  addScore(event, itemId, item) {
    event.stopPropagation();
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
              this.updateAllRank();
            }
          }
        }
      ]
    });
    prompt.present();
  }

  updateAllRank() {
    this.items.subscribe(items => {
      let results = _.orderBy(items, ['score'], ['asc']);
      results.forEach((item, index) => {
        if (index - 1 >= 0 && results[index - 1].score == item.score) {
          item.rank = results[index - 1].rank;
        } else {
          item.rank = index + 1;
        }
        this.items.update(item.$key, item);
      });
    });
  }

  showPlayer(itemId, item) {
    let alert = this.alertCtrl.create({
      title: `${item.name}`,
      subTitle: `Rank: ${item.rank}, Score: ${item.score}`,
      message: `Pts: ${item.roundPts}`,
      buttons: ['Close']
    });
    alert.present();
  }

  // checkboxChecked(itemId, item) {
  //   item.isChecked = !item.isChecked;
  //   this.items.update(item.$key, item);
  // }
}
