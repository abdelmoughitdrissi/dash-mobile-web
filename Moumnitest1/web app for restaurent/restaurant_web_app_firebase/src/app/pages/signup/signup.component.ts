import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SignupService } from './signup.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  providers: [SignupService]
})
export class SignupComponent implements OnInit {

  public signupForm: FormGroup;

  constructor(private fb: FormBuilder, private restService: SignupService) {
    this.createForm();
  }

  createForm() {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      email: [null, [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      password: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(15)]],
      phone: [null, [Validators.required, Validators.pattern('[7-9]{1}[0-9]{9}')]]
    });
  }

  onSubmit() {
    this.restService.createNewUser(this.signupForm.value);
  }
  ngOnInit() {
  }

}
