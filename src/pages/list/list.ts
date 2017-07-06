import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ActionSheetController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

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
      message: "Enter a name for this new player you're so keen on adding",
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
                rank: 1
              });
            }
          }
        }
      ]
    });
    prompt.present();
  }

  showOptions(itemId, item) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'What do you want to do?',
      buttons: [
        {
          text: 'Add new score',
          handler: () => {
            this.addScore(itemId, item);
          }
        }
        , {
          text: 'Update Player',
          handler: () => {
            this.updatePlayer(itemId, item);
          }
        }, {
          text: 'Delete Player',
          role: 'destructive',
          handler: () => {
            this.removePlayer(itemId);
          }
        }, {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    actionSheet.present();
  }

  removePlayer(itemId: string) {
    this.items.remove(itemId);
  }

  updatePlayer(itemId, item) {
    let prompt = this.alertCtrl.create({
      title: 'Player Name',
      message: "Update the name for this player",
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
              this.items.update(itemId, {
                name: data.name,
                score: item.score,
                rank: item.rank
              });
            }
          }
        }
      ]
    });
    prompt.present();
  }

  addScore(itemId, item) {
    let prompt = this.alertCtrl.create({
      title: 'New score',
      message: "Add a new score for this player",
      inputs: [
        {
          name: 'score',
          placeholder: 'Score'
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
              this.items.update(itemId, {
                name: item.name,
                score: Number(item.score) + Number(data.score),
                rank: item.rank
              });
            }
          }
        }
      ]
    });
    prompt.present();
  }
}
