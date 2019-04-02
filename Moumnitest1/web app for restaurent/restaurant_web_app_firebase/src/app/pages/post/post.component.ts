import { Component, OnInit } from '@angular/core';
import { PostService } from './post.service';
import { Router } from '@angular/router'
@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
  providers: [PostService]
})
export class PostComponent implements OnInit {

  public postlist = [];
  public loading: number = 0;
  public p: number = 1;
  constructor(private restService: PostService, private route: Router) {
    this.getRecentNews();
  }

  getRecentNews() {
    this.restService.getRecentNewsData().snapshotChanges().subscribe((res) => {
      this.postlist = [];
      res.forEach(newsData => {
        let newsValues = newsData.payload.toJSON();
        newsValues["_id"] = newsData.payload.key;
        this.postlist.push(newsValues);
      });
      this.loading = 1;
    });
  }

  getDetail(key) {
    this.route.navigate(['post-detail/' + key]);
  }

  ngOnInit() {
  }
}
