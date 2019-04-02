import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { WishListService } from './wishlist.service';
import swal from 'sweetalert2';
import 'rxjs/Rx';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss'],
  providers: [WishListService]
})
export class WishlistComponent implements OnInit {
  public allItemsList: any[] = [];
  public loading: number = 0;
  public noItemInWishList: boolean = false;
  constructor(public router: Router,
    private restService: WishListService,
    private toastr: ToastrService
  ) {
    this.getFavouriteData();
    //this.getItemRating();
  }

  getFavouriteData() {
    this.restService.getFavouritData().snapshotChanges().subscribe(
      (res) => {
        this.allItemsList = [];
        res.forEach(items => {
          let item = items.payload.toJSON();
          item["_id"] = items.payload.key;
          this.allItemsList.push(item);
        });
        if (this.allItemsList.length > 0) {
          this.loading = 1;
        }
        else {
          this.loading = 2;
        }
      }, (error) => {
        this.toastr.error("Error", error.message, { timeOut: 2000 });
      });

  }

  removeFavourit(id) {
    swal({
      title: 'Are you sure',
      text: 'This favorite will be deleted successfully',
      type: 'warning',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete it',
      cancelButtonText: 'No, Cancel',
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
    }).then(
      function () {
        this.restService.deleteFavouritData(id).then(
          () => {
            swal({
              title: 'Deleted',
              text: 'Favorite deleted successfully',
              background: '#fff',
              type: 'success',
              showConfirmButton: false,
              width: 300,
              timer: 2000
            }).then(() => { }, () => { });
            this.getFavouriteData();
          }
        ).catch(
          () => {
            swal({
              title: 'Sorry',
              text: 'Could not delete favorite',
              background: '#fff',
              type: 'error',
              showConfirmButton: false,
              width: 300,
              timer: 2000
            }).then(() => { }, () => { });
          }
          );
      }.bind(this), function (dismiss) {
        if (dismiss === 'cancel') {
          swal(
            'Canceled',
            'Favorite is not deleted'
          );
        }
      }
      );
  }


  viewItem(id) {
    this.router.navigate(['products/' + id]);
  }

  ngOnInit() {
  }
}
