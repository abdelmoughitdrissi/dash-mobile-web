import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
// import {map} from 'rxjs/Operator/map';
import { ToastrService } from 'ngx-toastr';
import { OrdersService } from '../orders/orders.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-table-booking',
  templateUrl: './table-booking.component.html',
  styleUrls: ['./table-booking.component.scss'],
  providers: [OrdersService]
})
export class TableBookingComponent implements OnInit {

  bookingData: any[] = [];
  bookingDataRef: AngularFireList<any>;
  bookingObservable: Observable<any>;
  tables: any[] = [];

  settingDataRef: AngularFireObject<any>;
  settingObservable: Observable<any>;

  loading: boolean = true;

  constructor(private route: Router, public af: AngularFireDatabase, private toastr: ToastrService, private ordersService: OrdersService) {
    this.bookingDataRef = af.list('/table-bookings');
    this.bookingObservable = this.bookingDataRef.snapshotChanges().map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    });
    this.bookingObservable.subscribe((res) => {
      this.bookingData = res;
      this.loading = false;
    });
    this.settingDataRef = af.object('/settings');
    this.settingObservable = this.settingDataRef.valueChanges();
    this.settingObservable.subscribe((res) => {
      for (let i = 1; i <= res.totalTables; i++) {
        this.tables.push({ table: i });
      }
    });
  }

  onChangeStatus(index, event, key, userID) {
    this.bookingData[index].status = event.target.value;
    if (event.target.value === 'Approved') {
      this.toastr.warning('Please assign table', 'Table booking');
    }

    if (event.target.value === 'Cancelled') {
      this.bookingDataRef.update(key, { status: event.target.value }).then((res) => {


        this.af.list('/table-bookings/' + key + '/statusReading').push({ title: event.target.value, time: Date.now() }).then(() => {
          this.af.object('users/' + userID + '/' + 'playerId').valueChanges().subscribe((respo: any) => {
            if (respo) {
              var message = {
                app_id: "9740a50f-587f-4853-821f-58252d998399",
                contents: { "Try next time your booking ": event.target.value },
                include_player_ids: [respo]
              };
              this.ordersService.sendNotification(message).subscribe(response => {
              });
            }
            this.toastr.success('Table booking status updated!', 'Success!');
          })
        })

      });
    }
  }

  onAssignTable(index, event, key, userID) {
    this.bookingData[index].tableNumber = event.target.value;
    this.bookingDataRef.update(key, { tableNumber: event.target.value, status: 'Approved' }).then((res) => {


      this.af.list('/table-bookings/' + key + '/tableReading').push({ title: event.target.value, time: Date.now() }).then(() => {
        this.af.object('users/' + userID + '/' + 'playerId').valueChanges().subscribe((respo: any) => {
          if (respo) {
            var message = {
              app_id: "9740a50f-587f-4853-821f-58252d998399",
              contents: { "Your booking approved, table number ": event.target.value },
              include_player_ids: [respo]
            };
            this.ordersService.sendNotification(message).subscribe(response => {
            });
          }
          this.toastr.success('Table booking status updated!', 'Success!');
        })
      })

    });
  }

  ordersShow(key) {
    this.route.navigate(['tables/view/', key])
  }

  ngOnInit() {
  }

}
