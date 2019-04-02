import { Component, OnInit, ViewChild } from '@angular/core';
import { ContactService } from './contact.service';
import swal from 'sweetalert2';
@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss'],
  providers: [ContactService]
})
export class ContactUsComponent implements OnInit {
  @ViewChild("name") name;
  constructor(private contactService: ContactService) { }

  ngOnInit() {
  }

  sendContact(name, email, subject, message) {
    if (name.value !== "" && email.value !== "" && subject.value !== "" && message.value !== "") {
      var body = {
        name: name.value,
        email: email.value,
        subject: subject.value,
        message: message.value
      };

      this.contactService.sendContacts(body).then(
        () => {
          swal({
            title: 'Thank You!!',
            text: 'We have received your message, we will get back to you shortly',
            background: '#fff',
            type: 'success',
            showConfirmButton: false,
            width: 300,
            timer: 2000
          }).then(() => { }, () => { });
        }
      );
    } else {
      swal({
        title: 'Oops!!',
        text: 'Please fill all the inputs',
        background: '#fff',
        type: 'error',
        showConfirmButton: false,
        width: 300,
        timer: 2000
      }).then(() => { }, () => { });
    }
  }

}
