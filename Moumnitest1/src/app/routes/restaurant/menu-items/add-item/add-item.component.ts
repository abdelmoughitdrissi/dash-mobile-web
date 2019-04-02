import { Component } from '@angular/core';
import { CloudinaryOptions, CloudinaryUploader } from 'ng2-cloudinary';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { ToastrService } from 'ngx-toastr';
import { cloudinarUpload } from '../../../../firebase.config';
@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss']
})
export class AddItemComponent {

  url: any = 'https://firebasestorage.googleapis.com/v0/b/restaurant-1440e.appspot.com/o/sweetAlrtImg.png?alt=media&token=d69dd443-3348-47e1-9fca-1104ecb07347';
  menuItems = {
    title: '',
    description: '',
    offerPercentage: 0,
    extraOptions: [{}],
    offer: false,
    price: [{}],
    category: '',
    thumb: 'https://firebasestorage.googleapis.com/v0/b/restaurant-1440e.appspot.com/o/sweetAlrtImg.png?alt=media&token=d69dd443-3348-47e1-9fca-1104ecb07347',
    noOfRating: 1,
    rating: 4.5
  }
  ItemPrice = [];

  readUrl(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.onload = (event: any) => {
        this.url = event.target.result;
        //this.imageRef = 1;
      }

      reader.readAsDataURL(event.target.files[0]);
    }
  }

  addNewChoice = function () {
    var newItemNo = this.menuItems.extraOptions.length + 1;
    this.menuItems.extraOptions.push({});
  };

  removeChoice = function () {
    if (this.menuItems.extraOptions.length > 0) {
      var lastItem = this.menuItems.extraOptions.length - 1;
      this.menuItems.extraOptions.splice(lastItem);
    }
  }

  addNewPrice = function () {
    var newItemNo = this.menuItems.price.length + 1;
    this.menuItems.price.push({});
  };

  removePrice = function () {
    if (this.menuItems.price.length > 1) {
      var lastItem = this.menuItems.price.length - 1;
      this.menuItems.price.splice(lastItem);
    }
  }
  categories: Array<any>
  categoryDataRef: AngularFireList<any>;
  categoryObservable: Observable<any>;
  menuItemsDataRef: AngularFireList<any>;
  imageId: string;

  uploader: CloudinaryUploader = new CloudinaryUploader(
    new CloudinaryOptions(cloudinarUpload)
  );

  constructor(public af: AngularFireDatabase, public toastr: ToastrService, public router: Router) {
    this.menuItemsDataRef = af.list('/menuItems');
    this.categoryDataRef = af.list('/categories');

    this.categoryObservable = this.categoryDataRef.snapshotChanges().map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    });;
    this.categoryObservable.subscribe((response) => {
      this.categories = response
    })
    //Override onSuccessItem to retrieve the imageId
    this.uploader.onAfterAddingFile = (item: any) => {
      item.url = this.uploader.options.url;
      return item;
    };

  }

  onSubmitMainItems(form: NgForm) {
    if (this.menuItems.offerPercentage > 0) {
      this.ItemPrice = this.menuItems.price
      for (let i = 0; i < this.ItemPrice.length; i++) {
        this.ItemPrice[i].specialPrice = (this.ItemPrice[i].value - (this.menuItems.offerPercentage * this.ItemPrice[i].value) / 100);
      }
      this.menuItems.offer = true;
    }
    else {
      this.ItemPrice = this.menuItems.price;
      this.menuItems.offerPercentage = 0;
      this.menuItems.offer = false;
    }
    this.uploader.uploadAll();
    this.uploader.onSuccessItem = (item: any, response: string, status: number, headers: any): any => {
      let res: any = JSON.parse(response);
      this.menuItems.thumb = res.url;
      this.menuItemsDataRef.push(this.menuItems).then((res) => {
        this.toastr.success('Menu-Items Data Added Successfully!', 'Success!');
        this.router.navigate(['/menu/manageItems']);
      });
    }
  }

  cancel() {
    this.router.navigate(['/menu/manageItems']);
  }
}
