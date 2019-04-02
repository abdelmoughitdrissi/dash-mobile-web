import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
const swal = require('sweetalert');


@Component({
  selector: 'app-currencies',
  templateUrl: './currencies.component.html',
  styleUrls: ['./currencies.component.scss'],
  providers: []
})

export class CurrenciesComponent implements OnInit {

  public currency: any[] = [];
  public loading: boolean = false;
  private currencytDataRef: AngularFireList<any>;
  private currencyObservable: Observable<any>;

  constructor(public router: Router,
    public af: AngularFireDatabase,
    public toastr: ToastrService) {
    this.getCurrencyData();

  }

  ngOnInit() {
  }



  getCurrencyData() {
    this.currencytDataRef = this.af.list('/currency');
    this.currencyObservable = this.currencytDataRef.snapshotChanges().map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    });
    this.currencyObservable.subscribe((res: any) => {
      if (res.length > 0) {
        this.currency = res;
      } else {
        this.currency = [];
      }
    });
  }

  currencyEdit(key) {
    this.router.navigate(['/currencies/editCurrency', key]);
  }

  currencyDelete(key: any, i: any) {
    swal({
      title: 'Are you sure?',
      text: 'Your will not be able to recover this data!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      closeOnConfirm: false,
      closeOnCancel: false
    }, (isConfirm) => {
      if (isConfirm) {
        this.currencytDataRef.remove(key).then((res) => {
          swal('Deleted!', 'currency Deleted Successfully!', 'success');
        })

      } else {
        swal('Cancelled', 'Your data is safe :)', 'error');
      }
    });
  }


}
