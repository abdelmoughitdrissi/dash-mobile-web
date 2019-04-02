import { Component } from '@angular/core';
import { CloudinaryOptions, CloudinaryUploader } from 'ng2-cloudinary';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import {AngularFireDatabase, AngularFireList} from 'angularfire2/database';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-news',
  templateUrl: './add-news.component.html',
  styleUrls: ['./add-news.component.scss']
})
export class AddNewsComponent  {

  url:any='';
  news:any={
    title:'',
    category:'',
    shortDescription:"",
    description:"",
    createdAt:Date.now()
  }
  newsDataRef: AngularFireList<any>;
  imageId: string;

    uploader: CloudinaryUploader = new CloudinaryUploader(
        new CloudinaryOptions({ cloudName: 'pietechsolutions', uploadPreset: 't0iey0lk' })
    );

    constructor(public af:AngularFireDatabase, public router:Router,public toastr: ToastrService) {
     this.newsDataRef = af.list('/news');
        //Override onSuccessItem to retrieve the imageId
           this.uploader.onAfterAddingFile = (item: any) => {
            item.url = this.uploader.options.url;
            return item;
        };
       
    }

    //Image Preview
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

           //Submit function
    onSubmitNews(form: NgForm){
       this.uploader.uploadAll();
        this.uploader.onSuccessItem = (item: any, response: string, status: number, headers: any): any => {
            let res: any = JSON.parse(response);
          this.news.thumb = res.url;
    	  this.newsDataRef.push(this.news).then((res)=>{
           this.toastr.success('News Data Added Successfully!', 'Success!');
          this.router.navigate(['/news/manageNews']);
        });
      }
    }
    cancel(){
       this.router.navigate(['/news/manageNews']);
    }
}

