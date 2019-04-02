import {Component, OnInit, ViewChild} from '@angular/core';
import {FooterService} from './footer.service';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import swal from 'sweetalert2';
import {shareLink} from '../../firebase.config';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
    providers: [FooterService]
})
export class FooterComponent implements OnInit {
    items: Array<any> = [];
    @ViewChild('f') f: NgForm;
    @ViewChild('g') g: NgForm;
    contact: any = {
        name: '',
        email: '',
        message: ''
    };

    news: any = {
        email: ''
    }

    public recentNewsData: any [] = [];
    public socialShareLink: any = shareLink;
    public instagramData: any [] = [];

    constructor(private restService: FooterService, private route: Router) {
        this.items = [
            {name: 'assets/img/profile/profile.jpg'},
            {name: 'assets/img/profile/profile.jpg'},
            {name: 'assets/img/profile/profile.jpg'},
            {name: 'assets/img/profile/profile.jpg'},

        ];
        this.getInstaData();
        this.getRecentNews();
    }

    getRecentNews() {
        this.restService.getRecentNewsData().snapshotChanges().subscribe((res) => {
            this.recentNewsData = [];
            res.forEach(newsData => {
                let newsValues = newsData.payload.toJSON();
                newsValues['_id'] = newsData.payload.key;
                this.recentNewsData.push(newsValues);
            });
        });
    }

    getDetail(key) {
        this.route.navigate(['post-detail/' + key]);
    }

    onSaveContact(ngform: NgForm) {
        this.restService.contactUs(ngform.value).then(
            () => {
                swal({
                    title: 'Thank You!!',
                    text: 'We have received your message, we will get back to you shortly',
                    background: '#fff',
                    type: 'success',
                    showConfirmButton: false,
                    width: 300,
                    timer: 2000
                }).then(() => {
                }, () => {
                });
                this.f.reset();
            });
    }

    onSubscribe(form: NgForm) {
        this.restService.subscribeMe(form.value).then(
            () => {
                swal({
                    title: 'Thank You!!',
                    text: 'We have received your request, we will get back to you shortly',
                    background: '#fff',
                    type: 'success',
                    showConfirmButton: false,
                    width: 300,
                    timer: 2000
                }).then(() => {
                }, () => {
                });
                this.g.reset();
            });
    }

    getInstaData() {
        this.restService.instaData().subscribe((res: any) => {
            for (let i = 0; i < 6; i++) {
                this.instagramData.push({image: res.data[i].images.low_resolution, link: res.data[i].link});
            }
            //this.instagramData = res.data;
            //console.log("Instagram Data "+ JSON.stringify(this.instagramData));
        })
    }

    ngOnInit() {
    }


}
