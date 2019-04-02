import { Component } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { NgForm } from '@angular/forms';
import { CloudinaryOptions, CloudinaryUploader } from 'ng2-cloudinary';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-edit-news',
  templateUrl: './edit-news.component.html',
  styleUrls: ['./edit-news.component.scss']
})
export class EditNewsComponent {
  uploader: CloudinaryUploader = new CloudinaryUploader(
    new CloudinaryOptions({ cloudName: 'pietechsolutions', uploadPreset: 't0iey0lk' })
  );
  url: any = '';

  newsDetails: any = {
    title: '',
    shortDescription: "",
    description: ""
  };

  newsdataRef: AngularFireObject<any>;
  newsObservable: Observable<any>;
  constructor(private route: ActivatedRoute, public router: Router, public af: AngularFireDatabase, public toastr: ToastrService) {
    this.route.params.map(params => params['id']).subscribe((Id) => {
      if (Id != null) {
        this.newsdataRef = this.af.object('/news/' + Id);
        this.newsObservable = this.newsdataRef.valueChanges();
        this.newsObservable.subscribe((response) => {
          this.newsDetails = response;
        })
      }
    });
    this.uploader.onBeforeUploadItem = (item: any) => {
      item.url = this.uploader.options.url;
      localStorage.setItem("image", "image Is going");
      return item;
    };
  }
  //Image Preview
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

  //Submit function

  onSubmitNews(form: NgForm) {
    this.uploader.uploadAll();
    this.uploader.onSuccessItem = (item: any, response: string, status: number, headers: any): any => {
      let res: any = JSON.parse(response);
      this.newsdataRef.update({
        title: this.newsDetails.title,
        description: this.newsDetails.description,
        shortDescription: this.newsDetails.shortDescription,
        thumb: res.url,
      }).then((res) => {
        localStorage.removeItem('image');
        this.router.navigate(['/news/manageNews']);
        this.toastr.success('news Data Updated Successfully!', 'Success!');
      });
    }
    if (localStorage.getItem("image") == null) {
      this.newsdataRef.update({
        title: this.newsDetails.title,
        shortDescription: this.newsDetails.shortDescription,
        description: this.newsDetails.description,
      }).then((res) => {
        this.router.navigate(['/news/manageNews']);
        this.toastr.success('news Data Updated Successfully!', 'Success!');
      });
    }
  }
  cancel() {
    this.router.navigate(['/news/manageNews']);
  }
}