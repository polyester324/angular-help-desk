import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Apollo } from 'apollo-angular';
import { GraphqlService } from "../services/graphql.service";


@Component({
    selector: 'app-feedback-info',
    templateUrl: './feedback-info.component.html',
    styleUrls: ['./feedback-info.component.css']
})
export class FeedbackInfoComponent implements OnInit {
    constructor(private route: ActivatedRoute, private graphqlService: GraphqlService, private apollo: Apollo, private router: Router) { }
    ticketId: number = 0;
    ticketName: string = "";

    text: string = "";
    submitAttempted: boolean = true;
    rating: number = 0;
    isRated: boolean = false;



    ngOnInit(): void {
        if (!localStorage.getItem('token')) {
            this.router.navigate(['/login']);
        }
        console.log("token info: " + localStorage.getItem('token'));
        this.ticketId = +this.route.snapshot.paramMap.get('id')!;
        this.ticketName = this.route.snapshot.paramMap.get('name')!;
        const token = localStorage.getItem('token');
        if (token) {
            this.graphqlService.getFeedbackByTicketId(token, this.ticketId).subscribe({
                next: data => {
                    if (data.errors != null) {
                        this.router.navigate(["/all-tickets/"]);
                        alert('There is no feedback yet!');
                    } else {
                        this.rating = data.data.getFeedbackByTicketId.rate;
                        this.text = data.data.getFeedbackByTicketId.text;
                        console.log('ticketId: ', data);
                    }

                },
                error: (error) => console.error('Error changing status:', error)
            });
        } else {
            console.error('Token not found!');
        }

    }

    allTickets() {
        this.router.navigate(['/all-tickets']);
    }

    logout() {
        this.router.navigate(['/login']);
    }

    setRate(rate: number) {
        this.rating = rate;
        this.isRated = true;
    }
}