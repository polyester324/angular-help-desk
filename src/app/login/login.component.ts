import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { Apollo } from "apollo-angular";
import { LOGIN } from "../graphql.operations";

@Component({
    selector:'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})

export class LoginComponent {
  email: string = "";
  password: string = "";
  submitAttempted: boolean = false;

  constructor(private apollo: Apollo, private router: Router) {}

  onSubmit() {
    this.apollo.mutate({
      mutation: LOGIN,
      variables: {
        email: this.email,
        password: this.password
      }
    }).subscribe({
      next: (data: any) => {
        const token = data.data.generateToken.token;
        const message = data.data.generateToken.message;
        console.log("login message: " + message);
        localStorage.setItem('token', token);
        this.router.navigate(['/all-tickets']);
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }
}