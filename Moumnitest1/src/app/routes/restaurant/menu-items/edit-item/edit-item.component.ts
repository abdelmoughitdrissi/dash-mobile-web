import { Component } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { NgForm } from '@angular/forms';
import { CloudinaryOptions, CloudinaryUploader } from 'ng2-cloudinary';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { ToastrService } from 'ngx-toastr';
import { cloudinarUpload } from '../../../../firebase.config';
@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.scss']
})
export class EditItemComponent {
  uploader: CloudinaryUploader = new CloudinaryUploader(
    new CloudinaryOptions(cloudinarUpload)
  );
  menuItems = {
    title: '',
    description: '',
    offerPercentage: 0,
    offer: false,
    extraOptions: [{}],
    price: [{}],
    category: '',
    thumb: '',
  }
  ItemPrice = [];
  url: any = '';
  categories: any = []

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
    if (this.menuItems.extraOptions == null) {
      this.menuItems.extraOptions = [{}]
    } else {
      var newItemNo = this.menuItems.extraOptions.length + 1;
      this.menuItems.extraOptions.push({});
    }

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
  menuItemsdataRef: AngularFireObject<any>;
  menuObservable: Observable<any>;
  categoryDataRef: AngularFireList<any>;
  categoryObservable: Observable<any>;
  constructor(private route: ActivatedRoute, public router: Router, public af: AngularFireDatabase, public toastr: ToastrService) {
    this.categoryDataRef = this.af.list('/categories');
    this.categoryObservable = this.categoryDataRef.snapshotChanges().map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    });;
    this.categoryObservable.subscribe((response) => {
      this.categories = response;
    })
    this.route.params.map(params => params['id']).subscribe((Id) => {
      if (Id != null) {
        this.menuItemsdataRef = this.af.object('/menuItems/' + Id);
        this.menuObservable = this.menuItemsdataRef.valueChanges();
        this.menuObservable.subscribe((response) => {
          this.menuItems = response;

        })
      }
    });
    this.uploader.onBeforeUploadItem = (item: any) => {
      item.url = this.uploader.options.url;
      localStorage.setItem("image", "image Is going");
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
    if (this.menuItems.extraOptions == undefined) {
      this.menuItems.extraOptions = [{}]
    }
    this.uploader.uploadAll();
    this.uploader.onSuccessItem = (item: any, response: string, status: number, headers: any): any => {
      let res: any = JSON.parse(response);
      this.menuItemsdataRef.update({
        title: this.menuItems.title,
        description: this.menuItems.description,
        thumb: res.url,
        offerPercentage: this.menuItems.offerPercentage,
        offer: this.menuItems.offer,
        extraOptions: this.menuItems.extraOptions,
        price: this.ItemPrice
      }).then((res) => {
        localStorage.removeItem("image");
        this.toastr.success('Menu-Items Data Updated Successfully!', 'Success!');
        this.router.navigate(['/menu/manageItems']);
      });
    }
    if (localStorage.getItem("image") == null) {

      this.menuItemsdataRef.update({
        title: this.menuItems.title,
        description: this.menuItems.description,
        offerPercentage: this.menuItems.offerPercentage,
        offer: this.menuItems.offer,
        extraOptions: this.menuItems.extraOptions,
        price: this.ItemPrice
      }).then((res) => {
        this.toastr.success('Menu-Items Data Updated Successfully!', 'Success!');
        this.router.navigate(['/menu/manageItems']);
      });

    }
  }
  cancel() {
    this.router.navigate(['/menu/manageItems']);
  }
}