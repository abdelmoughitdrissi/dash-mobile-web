import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";

@IonicPage()
@Component({
  selector: "page-location",
  templateUrl: "location.html"
})
export class LocationPage {
  title: string = "My location ";
  lat: number = 33.581587;
  lng: number = -7.619285;
  zoom: number = 13;

  constructor(public navCtrl: NavController, public navParams: NavParams) {}
}
