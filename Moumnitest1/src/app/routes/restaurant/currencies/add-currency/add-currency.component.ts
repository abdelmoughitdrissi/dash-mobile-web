import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-add-currency',
  templateUrl: './add-currency.component.html',
  styleUrls: ['./add-currency.component.scss'],
  providers: []
})
export class AddCurrencyComponent implements OnInit {

  public currency: any = {
    currencyName: '',
    currencySign: {
      symbol: ''
    }
  };
  isLoading: boolean = false;

  constructor(private toastr: ToastrService, private route: Router, private af: AngularFireDatabase) {
  }

  ngOnInit() {
  }

  onAddCurrency() {
    this.af.list('currency').push(this.currency).then(() => {
      this.toastr.success('Currencies Data Added Successfully!', 'Success!');
      this.route.navigate(['/currencies/manageCurrency']);
    })
  }

  cancel() {
    this.route.navigate(['/currencies/all']);
  }

}
