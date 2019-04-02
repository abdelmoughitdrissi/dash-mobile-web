import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-currency',
  templateUrl: './edit-currency.component.html',
  styleUrls: ['./edit-currency.component.scss'],
  providers: []
})
export class EditCurrencyComponent implements OnInit {
  id: string;
  currency: any = {
    currencyName: '',
    currencySign: {
      symbol: ''
    }
  };
  public isLoading: boolean = false;
  private currencyRef: AngularFireObject<any>;
  constructor(private toster: ToastrService, private route: ActivatedRoute, private router: Router, public af: AngularFireDatabase) {
    this.route.params.map((params) => params['id']).subscribe((id) => {
      this.id = id;
      if (this.id != null) {
        this.getCurrency(this.id);
      }
    });
  }

  ngOnInit() {
  }

  // get selected currency data
  getCurrency(Id) {
    this.af.object('/currency/' + Id).valueChanges()
      .subscribe((response) => {
        this.currency = response;
      })
  }

  // update selected currency data
  onUpdateCurrency(NgForm) {
    this.af.object('/currency/' + this.id).update(this.currency).then(() => {
      this.toster.success('Currency Data Updated Successfully!', 'Success!');
      this.router.navigate(['/currencies/manageCurrency']);
    }, error => {
      this.toster.error('Currency Data Not Updated !', 'Error!');
    })
  }

  cancel() {
    this.router.navigate(['/currencies/all']);
  }

}
