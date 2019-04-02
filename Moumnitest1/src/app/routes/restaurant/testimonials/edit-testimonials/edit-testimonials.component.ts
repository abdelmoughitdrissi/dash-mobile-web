import { Component } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { NgForm } from '@angular/forms';
import { CloudinaryOptions, CloudinaryUploader } from 'ng2-cloudinary';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { ToastrService } from 'ngx-toastr';
import { cloudinarUpload } from '../../../../firebase.config';

@Component({
  selector: 'app-edit-testimonials',
  templateUrl: './edit-testimonials.component.html',
  styleUrls: ['./edit-testimonials.component.scss']
})
export class EditTestimonialsComponent {

  public url: any = './assets/img/profile/people-01.jpg';

  uploader: CloudinaryUploader = new CloudinaryUploader(
    new CloudinaryOptions(cloudinarUpload)
  );

  public testimonial: any = {};
  public categoriesdataRef: any;
  private imageRef: boolean = false;
  public ratingStates: any = [
    {
      stateOn: 'fa fa-star',
      stateOff: 'fa fa-star-o'
    },
  ];
  public maxRat: number = 5;
  public isReadonly: boolean = false;

  constructor(private route: ActivatedRoute, public router: Router, public af: AngularFireDatabase, public toastr: ToastrService) {
    this.route.params.map(params => params['id']).subscribe((Id) => {
      if (Id != null) {
        this.categoriesdataRef = this.af.object('/testimonials/' + Id);
        this.af.object('/testimonials/' + Id).valueChanges()
          .subscribe((response: any) => {
            this.testimonial = response;
            this.url = response.thumb;
          })
      }
    });
  }

  readerImage(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.url = event.target.result;
        this.imageRef = true;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  onUpdateTestimonial(form: NgForm) {

    if (this.imageRef) {
      this.uploader.uploadAll();
      this.uploader.onSuccessItem = (item: any, response: string, status: number, headers: any): any => {
        let res: any = JSON.parse(response);
        this.categoriesdataRef.update({
          name: this.testimonial.name,
          companyName: this.testimonial.companyName,
          message: this.testimonial.message,
          rating: this.testimonial.rating,
          thumb: res.url,
        }).then((res) => {
          this.imageRef = false;
          this.router.navigate(['/testimonials/manageTestimonials']);
          this.toastr.success('Testimonials Data Updated Successfully!', 'Success!');
        });
      }
    }
    else {
      this.categoriesdataRef.update({
        name: this.testimonial.name,
        companyName: this.testimonial.companyName,
        message: this.testimonial.message,
        rating: this.testimonial.rating
      }).then((res) => {
        this.router.navigate(['/testimonials/manageTestimonials']);
        this.toastr.success('Testimonials Data Updated Successfully!', 'Success!');
      });
    }

  }

  cancel() {
    this.router.navigate(['/testimonials/manageTestimonials']);
  }
}