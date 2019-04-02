import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { NgForm } from '@angular/forms';
import { CloudinaryOptions, CloudinaryUploader } from 'ng2-cloudinary';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable'
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {

  userDetails: any = {};
  public currency: any = {};
  address: any;
  orderDetails: any = {};
  ordersdataRef: AngularFireObject<any>;
  orderObservable: Observable<any>;
  orderId: any;
  loading: boolean = true;

  constructor(private route: ActivatedRoute, public router: Router, public af: AngularFireDatabase, public toastr: ToastrService) {
    if (localStorage.getItem('currency')) {
      this.currency = JSON.parse(localStorage.getItem('currency'));
    }
    this.route.params.map(params => params['id']).subscribe((Id) => {
      if (Id != null) {
        this.ordersdataRef = this.af.object('/orders/' + Id);
        this.orderId = Id;
        this.orderObservable = this.ordersdataRef.valueChanges();
        this.orderObservable.subscribe((response) => {
          this.orderDetails = response;
          this.userDetails = response.userDetails;
          this.address = response.shippingAddress;
          this.loading = false;
        })
      }
    });
  }

  back() {
    this.router.navigate(['/order/viewOrder', this.orderId])
  }

  ngOnInit() {
  }

}
