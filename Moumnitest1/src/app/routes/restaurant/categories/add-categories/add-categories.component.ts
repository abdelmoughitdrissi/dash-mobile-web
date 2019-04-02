import { Component } from '@angular/core';
import { CloudinaryOptions, CloudinaryUploader } from 'ng2-cloudinary';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import {AngularFireDatabase, AngularFireObject} from 'angularfire2/database';
import {Observable} from 'rxjs/Observable';
import { ToastrService } from 'ngx-toastr';
import { cloudinarUpload } from '../../../../firebase.config'; 

@Component({
  selector: 'app-add-categories',
  templateUrl: './add-categories.component.html',
  styleUrls: ['./add-categories.component.scss']
})
export class AddCategoriesComponent  {

  url:any='';
  category:any={};
  categoryRef:any;
  imageId: string;
       uploader: CloudinaryUploader = new CloudinaryUploader(
        new CloudinaryOptions(cloudinarUpload)
    );

    constructor(public af:AngularFireDatabase, public router:Router,public toastr: ToastrService) {
     this.categoryRef = af.list('/categories');
        //Override onSuccessItem to retrieve the imageId
           this.uploader.onAfterAddingFile = (item: any) => {
            item.url = this.uploader.options.url;
            return item;
        };
    }
    
    readUrl(event) {
                 if (event.target.files && event.target.files[0]) {
                 var reader = new FileReader();
               
               reader.onload = (event:any) => {
                 this.url = event.target.result;
                 //this.imageRef = 1;
               }

             reader.readAsDataURL(event.target.files[0]);
             }
           }

    onSubmitCategory(form: NgForm){
       this.uploader.uploadAll();
        this.uploader.onSuccessItem = (item: any, response: string, status: number, headers: any): any => {
            let res: any = JSON.parse(response);
          this.category.thumb = res.url;
    	  this.categoryRef.push(this.category).then((res)=>{
           this.toastr.success('Categories Data Added Successfully!', 'Success!');
          this.router.navigate(['/categories/manageCategories']);
        });
      }
    }
    
     cancel(){
       this.router.navigate(['/categories/manageCategories']);
    }
}

