import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PushNotificationService } from './push-notification.service';
import { Router, ActivatedRoute } from "@angular/router";
import { timeout } from 'q';

@Component({
  selector: 'app-push-notification',
  templateUrl: './push-notification.component.html',
  styleUrls: ['./push-notification.component.scss'],
  providers: [PushNotificationService]
})
export class PushNotificationComponent {
  notification: any = {}

  message: any = {
    //app_id: "614240e3-c369-44a1-82fb-73227bd2c71c",
    app_id: "9740a50f-587f-4853-821f-58252d998399",
    contents: { "en": '' },
    headings: { "en": '' },
    included_segments: ["All"]
  };

  constructor(public router: Router, public pushNotification: PushNotificationService, public toster: ToastrService) { }


  onpushNotification(form: NgForm) {
    this.pushNotification.sendNotification(this.message).subscribe(res => {
      this.toster.success('Notification Send Successfully!', 'Success!', { timeOut: 3000 });
    }, error => {
      this.toster.error('Somthing Went Wrong', 'Error!', { timeOut: 3000 });
    })
  }

  cancel() {
    this.router.navigate(['/coupons/all']);

  }


}
