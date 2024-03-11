import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Apollo } from 'apollo-angular';
import { GraphqlService } from "../services/graphql.service";
import { Ticket } from "../classes/ticket.class";


@Component({
    selector: 'app-feedback',
    templateUrl: './feedback.component.html',
    styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {
    constructor(private route: ActivatedRoute, private graphqlService: GraphqlService, private apollo: Apollo, private router: Router) { }
    ticketId: number = 0;
    ticketName: string = "";

    text: string = "";
    rate: number = 0;
    submitAttempted: boolean = true;


    ngOnInit(): void {
        if (!localStorage.getItem('token')) {
            this.router.navigate(['/login']);
        }
        console.log("token info: " + localStorage.getItem('token'));
        this.ticketId = +this.route.snapshot.paramMap.get('id')!;
        this.ticketName = this.route.snapshot.paramMap.get('name')!;
    }

    allTickets() {
        this.router.navigate(['/all-tickets']);
    }

    logout() {
        this.router.navigate(['/login']);
    }

    submit() {
        const ratingInputs = document.querySelectorAll('.rating input[type="radio"]');
        let isRatingSelected = false;

        ratingInputs.forEach(input => {
            if ((input as HTMLInputElement).checked) {
                isRatingSelected = true;
            }
        });

        if (!isRatingSelected) {
            this.submitAttempted = false;
            return;
        }

        const token = localStorage.getItem('token');
        if (token) {
            this.graphqlService.giveFeedback(token, this.rate + "", this.ticketId, this.text).subscribe({
                next: data => {
                    console.log(data);
                    if(data.errors != null){
                        alert('Can not leave the feedback! Check if the status of the ticket is "DONE" or if you are the owner of the ticket');
                    } else {
                        this.router.navigate(["/ticket-info/" + this.ticketId + "/" + this.ticketName]);
                    }
                },
                error: (errors) => console.error('Error: ', errors)
            });
        } else {
            console.error('Token not found!');
        }


    }

    setRate(rate: number) {
        this.rate = rate;
        console.log(this.rate);
    }
}