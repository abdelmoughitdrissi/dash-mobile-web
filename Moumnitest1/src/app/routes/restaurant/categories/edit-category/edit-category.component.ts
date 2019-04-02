import { Component } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { NgForm } from '@angular/forms';
import { CloudinaryOptions, CloudinaryUploader } from 'ng2-cloudinary';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { ToastrService } from 'ngx-toastr';
import { cloudinarUpload } from '../../../../firebase.config';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.scss']
})
export class EditCategoryComponent {
  url: any = '';
  uploader: CloudinaryUploader = new CloudinaryUploader(
    new CloudinaryOptions(cloudinarUpload)
  );
  categoryDetails: any = {};
  categoriesdataRef: any;

  constructor(private route: ActivatedRoute, public router: Router, public af: AngularFireDatabase, public toastr: ToastrService) {
    this.route.params.map(params => params['id']).subscribe((Id) => {
      if (Id != null) {
        this.categoriesdataRef = this.af.object('/categories/' + Id);
        this.af.object('/categories/' + Id).valueChanges()
          .subscribe((response) => {
            this.categoryDetails = response;
          })
      }
    });
    this.uploader.onBeforeUploadItem = (item: any) => {
      item.url = this.uploader.options.url;
      localStorage.setItem("image", "image Is going");
      return item;
    };
  }

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

  onSubmitCategory(form: NgForm) {

    this.uploader.uploadAll();
    this.uploader.onSuccessItem = (item: any, response: string, status: number, headers: any): any => {
      let res: any = JSON.parse(response);
      this.categoriesdataRef.update({
        title: this.categoryDetails.title,
        description: this.categoryDetails.description,
        thumb: res.url,
      }).then((res) => {
        localStorage.removeItem('image');
        this.router.navigate(['/categories/manageCategories']);
        this.toastr.success('Categories Data Updated Successfully!', 'Success!');
      });
    }
    if (localStorage.getItem("image") == null) {
      this.categoriesdataRef.update({
        title: this.categoryDetails.title,
        description: this.categoryDetails.description,
      }).then((res) => {
        this.router.navigate(['/categories/manageCategories']);
        this.toastr.success('Categories Data Updated Successfully!', 'Success!');
      });
    }
  }

  cancel() {
    this.router.navigate(['/categories/manageCategories']);
  }
}