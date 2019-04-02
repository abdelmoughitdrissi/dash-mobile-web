import {Component} from '@angular/core';
import {CloudinaryOptions, CloudinaryUploader} from 'ng2-cloudinary';
import {NgForm} from '@angular/forms';
import {Router, ActivatedRoute} from "@angular/router";
import {AngularFireDatabase, AngularFireList} from 'angularfire2/database';
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'app-add-tags',
    templateUrl: './add-tags.component.html',
    styleUrls: ['./add-tags.component.scss']
})
export class AddTagsComponent {

    tag: any = {
        tags: ''
    };
    tagDataRef: AngularFireList<any>;


    constructor(public af: AngularFireDatabase, public router: Router, public toastr: ToastrService) {
        this.tagDataRef = af.list('/tags');
    }

    onSubmitTag(form: NgForm) {
        this.tagDataRef.push(this.tag).then((res) => {
            this.router.navigate(['/tags/all']);
            this.toastr.success('Tags Added Successfully!', 'Success!');
        })
    }
     cancel(){
       this.router.navigate(['/tags/all']);
    }
}

