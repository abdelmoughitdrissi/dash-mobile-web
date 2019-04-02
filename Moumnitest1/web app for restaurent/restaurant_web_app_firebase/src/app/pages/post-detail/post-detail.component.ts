import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
//import { Meta, Title} from '@angular/platform-browser';
import { Router, ActivatedRoute } from "@angular/router";
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { shareLink } from '../../firebase.config';
import swal from 'sweetalert2';
import { PostDetailService } from './post-detail.service';
@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss'],
  providers: [PostDetailService]
})
export class PostDetailComponent implements OnInit {
  @ViewChild('commentForm') commentForm: FormGroup;
  public socialShareLink: string;
  public postInfo: any = {
    title: '',
    thumb: '',
    description: ""
  };
  commentData: Array<any> = [];
  userImage: string;
  public loading: number = 0;

  newsdataRef: AngularFireObject<any>;
  newsObservable: Observable<any>;
  newsId: string;
  constructor(private route: ActivatedRoute,
    public router: Router,
    public af: AngularFireDatabase,
    public fb: FormBuilder,
    public restService: PostDetailService
  ) {
    // meta:Meta,
    //          title:Title
    this.route.params.map(params => params['id']).subscribe((Id) => {
      if (Id != null) {
        this.newsId = Id;
        this.socialShareLink = shareLink + '/post-detail/' + Id;
        this.newsdataRef = this.af.object('/news/' + Id);
        this.newsObservable = this.newsdataRef.valueChanges();
        this.newsObservable.subscribe((response) => {
          // title.setTitle(response.title);
          // meta.addTags([
          //   {
          //     url: this.socialShareLink,
          //     image : response.thumb,
          //     content: "my contant"
          //   }
          //   ])
          this.postInfo = response;
          this.loading = 1;
          //console.log("post data "+JSON.stringify(this.postInfo));
        });
        this.getUserImage();
        this.getComments(Id);
      }
    });

  }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.commentForm = this.fb.group({
      name: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      message: [null, Validators.required]
    });
  }

  getUserImage() {
    let image = localStorage.getItem('user_image');
    if (image != null || image != undefined) {
      this.userImage = image
      //console.log(this.userImage)
    } else {
      this.userImage = "https://firebasestorage.googleapis.com/v0/b/restaurant-1440e.appspot.com/o/default-profile.png?alt=media&token=a0676782-f3ac-4c1e-a2fe-fdd1b0a30545";
      //console.log(this.userImage);
    }
  }

  getComments(id: string) {
    this.restService.getComments(id).snapshotChanges().subscribe((res) => {
      this.commentData = [];
      res.forEach(comments => {
        let commnet = comments.payload.toJSON();
        commnet['_id'] = comments.payload.key;
        this.commentData.push(commnet);
      });
      //console.log(this.commentData);
    }, (error) => {
      console.log(error);
    });
  }

  submitComment() {
    //console.log(this.commentForm.value);
    if (this.commentForm.value.name === null || this.commentForm.value.email === null || this.commentForm.value.message === null) {
      swal({
        title: 'Please fill the inputs',
        text: 'Name, Email, Message fields are mandatory',
        type: 'error',
        background: '#fff',
        showConfirmButton: false,
        showCancelButton: false,
        width: 300,
        timer: 2000
      }).then(() => { }, () => { });
    } else {
      var comment = {
        name: this.commentForm.value.name,
        email: this.commentForm.value.email,
        message: this.commentForm.value.message,
        image: this.userImage,
        createdAt: Date.now()
      }
      //console.log(comment);
      this.restService.postComment(this.newsId, comment).then(
        () => {
          swal({
            title: 'Thank you',
            text: 'We will get back to you shortly',
            background: '#fff',
            type: 'success',
            showCancelButton: false,
            width: 300,
            timer: 2000
          }).then(() => { }, () => { });
          this.commentForm.reset();
        }
      );
    }
  }


  commentlist = [
    {
      "img": "assets/img/profile/profile.jpg",
      "name": "Meghna Sachar",
      "comment": `
     You provide best service and I would like to dolor sit amet, consectetur  amet,
      consectetur adipisicing elit, sed do eiusmod adipisicing elit, sed do eiusmod
     `,
    },
    {
      "img": "assets/img/profile/profile2.jpg",
      "name": "Raghav Mundar",
      "comment": `
        I would like to suggest that dolor sit amet, consectetur  amet,
        consectetur adipisicing elit, sed do eiusmod adipisicing elit, sed
        sed do eiusmod adipisicing do eiusmod
       `,
    },
    {
      "img": "assets/img/profile/profile3.jpg",
      "name": "Riya Somani",
      "comment": `
          Best service and I would like to dolor sit amet, consectetur  amet,
          consectetur adipisicing elit, sed do eiusmod adipisicing elit, sed do eiusmod
         `,
    },
  ];
}
