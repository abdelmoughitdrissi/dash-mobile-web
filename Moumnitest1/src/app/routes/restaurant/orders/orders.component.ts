import { Component, OnInit } from '@angular/core';
import { CloudinaryOptions, CloudinaryUploader } from 'ng2-cloudinary';
import { NgForm } from '@angular/forms';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
// import {map} from 'rxjs/Operator/map';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from "@angular/router";
import { OrdersService } from './orders.service';
declare var google: any;

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  providers: [OrdersService]
})
export class OrdersComponent implements OnInit {

  public currency: any = {};
  orders: Array<any>;
  ordersDataRef: AngularFireList<any>;
  orderObservable: Observable<any>;
  updatedOnce: boolean = false;

  userObjRef: AngularFireObject<any>;
  orderObjRef: AngularFireObject<any>;
  loyalityData: AngularFireObject<any>;
  loylityPercentage: number = 0;

  public loyalityStatus: boolean = false;
  public minLoyalityPointes: number = 0;

  private orderData: any = {};
  private userData: any = {};
  private playerId: string;
  lng: any;
  lat: any;
  geocoder: any;
  latlng: any;
  city: any;

  constructor(public af: AngularFireDatabase,
    public toastr: ToastrService,
    public router: Router,
    public ordersService: OrdersService) {




    if (localStorage.getItem('currency')) {
      this.currency = JSON.parse(localStorage.getItem('currency'));
    }
    this.ordersDataRef = af.list('/orders');
    this.orderObservable = this.ordersDataRef.snapshotChanges().map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    });
    this.orderObservable.subscribe((res) => {
      this.orders = res.reverse().filter(order => {
        return order.shippingAddress.city.toLowerCase().trim() ===  this.city.toLowerCase().trim();
      });

    });

    // loality points

    this.loyalityData = af.object('/loyalitys');
    this.loyalityData.valueChanges().subscribe((res: any) => {
      //console.log("loyalityData res "+JSON.stringify(res));
      if (res != null) {
        this.loyalityStatus = res.enable;
        this.loylityPercentage = res.loylityPercentage;
      }
    });

  }
  successFunction(position) {
    this.lat = position.coords.latitude;
    this.lng = position.coords.longitude;
    this.codeLatLng(this.lat, this.lng)
  }
  errorFunction() {
    alert("Geocoder failed");
  }
  initialize() {
    this.geocoder = new google.maps.Geocoder();

  }
  codeLatLng(lat, lng) {

    this.latlng = new google.maps.LatLng(lat, lng);
    this.geocoder.geocode({ 'latLng': this.latlng }, (results, status) => {
      if (status == google.maps.GeocoderStatus.OK) {
        console.log(results)
        if (results[1]) {
          //formatted address
          //find country name
          for (var i = 0; i < results[0].address_components.length; i++) {
            for (var b = 0; b < results[0].address_components[i].types.length; b++) {

              //there are different types 2that might hold a city admin_area_lvl_1 usually does in come cases looking for sublocality type will be more appropriate
              if (results[0].address_components[i].types[b] == "administrative_area_level_1") {
                //this is the object you are looking for
                this.city = results[0].address_components[i];
                break;
              }
            }
          }
          //city data


        } else {
          alert("No results found");
        }
      } else {
        alert("Geocoder failed due to: " + status);
      }
    });
  }

  ngOnInit() {
    this.initialize();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.successFunction.bind(this), this.errorFunction.bind(this));
    }
    //Get the latitude and the longitude;








  }


  OnChangeStatus(key, event, userId) {

    this.orderObjRef = this.af.object("/orders/" + key);
    this.userObjRef = this.af.object("/users/" + userId);


    if (event.target.value === 'Delivered' && this.loyalityStatus) {

      let data = this.orderObjRef.valueChanges().subscribe((res) => {
        this.orderData = res;

        let userPoint: number;
        userPoint = Math.floor((this.orderData.grandTotal * this.loylityPercentage) / 100);

        data.unsubscribe();

        let loayltyObj: any = {
          credit: true,
          points: userPoint,
          orderId: key,
          createdAt: Date.now()
        }
        this.af.list('users/' + userId + '/loyaltyPoints').push(loayltyObj);
        this.af.list('/orders/' + key + '/loyaltyPoints').push(loayltyObj);
        // })

        //this.userInfo.loyaltyPoints.push(Math.floor(addPoint));
        //console.log("added point " + JSON.stringify(this.orderData));

        this.updateLoalityStatus(event, key, userId);
        //        if(this.orderData.loyaltyPoints == null){
        //          let loylityPoints:any [] = [];
        //          //console.log("lo loyaltyPoints");
        //          this.orderData.loyaltyPoints = loylityPoints;
        //          //console.log("now order "+JSON.stringify(this.orderData));
        //        }

        //        let addPoint:number;
        //        addPoint = Math.floor((this.orderData.grandTotal * this.loylityPercentage)/100);
        //        this.orderData.loyaltyPoints.push({
        //          credit:true,
        //          points: addPoint,
        //          orderId: key,
        //          createdAt:Date.now()
      });

      //    let user =   this.userObjRef.valueChanges().subscribe((res) => {
      //      this.userData = res;
      //      //console.log("userData is before"+JSON.stringify(this.userData));
      // if(this.userData.loyaltyPoints == null){
      //   let loylityPoints:any [] = [];
      //   //console.log("lo loyaltyPoints");
      //   this.userData.loyaltyPoints = loylityPoints;
      //   //console.log("now userData "+JSON.stringify(this.userData));
      // }
      //user.unsubscribe();




      //});



    }// if outer closed

    else {
      this.updateStatus(key, event, userId);
    }
  }

  updateLoalityStatus(event, key, userId) {
    //if(this.updatedOnce == false){
    this.orderObjRef.update({
      status: event.target.value,
      orderView: true
    }).then((res: any) => {

      this.af.list('/orders/' + key + '/statusReading').push({ title: event.target.value, time: Date.now() }).then(() => {
        this.af.object('users/' + userId + '/' + 'playerId').valueChanges().subscribe((respo: any) => {
          console.log(respo);
          if (respo) {
            var message = {
              app_id: "9740a50f-587f-4853-821f-58252d998399",
              contents: { "en": "Your Loyality Points Creadited" },
              include_player_ids: [respo]
            };
            this.ordersService.sendNotification(message).subscribe(response => {

            });
          }
          this.toastr.success('Order status updated!', 'Success!');

        })
        console.log()
      })


    });
    //this.updatedOnce = true;
    // }
  }

  updateStatus(key, event, userId) {

    this.ordersDataRef.update(key, { status: event.target.value, orderView: true }).then((res) => {

      this.af.list('/orders/' + key + '/statusReading').push({ title: event.target.value, time: Date.now() }).then(() => {
        this.af.object('users/' + userId + '/' + 'playerId').valueChanges().subscribe((respo: any) => {
          console.log(respo);
          if (respo) {
            var message = {
              app_id: "9740a50f-587f-4853-821f-58252d998399",
              contents: { "en": "Your Order Status: " + event.target.value },
              include_player_ids: [respo]
            };
            this.ordersService.sendNotification(message).subscribe(response => {

            });
          }
          this.toastr.success('Order status updated!', 'Success!');
        });
      })


    });
    //}
  }


  ordersShow(key) {
    this.ordersDataRef.update(key, { orderView: true }).then((res) => {
      this.router.navigate(['/order/viewOrder', key]);
    });
  }

}