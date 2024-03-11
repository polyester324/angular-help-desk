import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Apollo } from 'apollo-angular';
import { GraphqlService } from "../services/graphql.service";
import { Ticket } from "../classes/ticket.class";


@Component({
    selector: 'app-edit-ticket',
    templateUrl: './edit-ticket.component.html',
    styleUrls: ['./edit-ticket.component.css']
})
export class EditTicketComponent implements OnInit {
    constructor(private route: ActivatedRoute, private graphqlService: GraphqlService, private apollo: Apollo, private router: Router) { }
    ticketId: number = 0;
    ticketName: string = "";
    fileInputs: any[] = [];
    category: string = "";
    name: string = "";
    description: string = "";
    urgency: string = "";
    desiredResolutionDate: string = "";
    attachmentIds: number[] = [];
    comment: string = "";
    state: string = "";

    wrongFileType: Record<number, boolean> = {};
    wrongFileSize: Record<number, boolean> = {};
    responseId: string = "";
    submitAttempted: boolean = false;
    today: Date = new Date();
    exceptedRegex = /^[a-zA-Z0-9~."(), :;<>@[\]!#$%&'*+\-/=?^_`{|}]+$/;


    ngOnInit(): void {
        if (!localStorage.getItem('token')) {
            this.router.navigate(['/login']);
        }
        console.log("token info: " + localStorage.getItem('token'));
        this.ticketId = +this.route.snapshot.paramMap.get('id')!;
        this.ticketName = this.route.snapshot.paramMap.get('name')!;
        this.fileInputs.push({});
        this.graphqlService.getTicketByIdForTicketInfo(localStorage.getItem('token')!, this.ticketId).subscribe({
            next: data => {
                this.category = data.data.getTicketByIdForTicketInfo.category;
                this.name = this.ticketName;
                this.urgency = data.data.getTicketByIdForTicketInfo.urgency;
                this.description = data.data.getTicketByIdForTicketInfo.description;
            },
            error: (error) => console.error('Error fetching tickets:', error)
        })
    }

    handleFileInput(event: any, index: number) {
        const token = localStorage.getItem('token');
        if (event && event.target) {
            const file: File = event.target.files[0];
            const fileName: string = file.name;

            const reader = new FileReader();
            reader.onload = (e: any) => {
                const fileBase: string = e.target.result;

                this.wrongFileType[index] = false;
                this.wrongFileSize[index] = false;
                const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/png', 'image/jpeg', 'image/jpg'];
                if (!allowedTypes.includes(file.type)) {
                    this.wrongFileType[index] = true;
                    return;
                }
                const maxFileSize = 5 * 1024 * 1024;
                if (file.size > maxFileSize) {
                    this.wrongFileSize[index] = true;
                    return;
                }

                if (token) {
                    this.graphqlService.createAttachment(token, fileBase, fileName).subscribe({
                        next: data => {
                            console.log(data.data.createAttachment); 
                            const attachmentId: number = parseInt(data.data.createAttachment);
                            this.attachmentIds.push(attachmentId);
                        },
                        error: (error) => console.error('Error fetching tickets:', error)
                    })
                } else {
                    console.error('Token not found!');
                }
            };

            reader.readAsDataURL(file);
        } else {
            console.error('Event or event.target is null!');
        }
    }

    addFileInput() {
        this.fileInputs.push({});
    }

    removeFileInput(index: number) {
        this.fileInputs.splice(index, 1);
        if (index < this.attachmentIds.length) {
            this.attachmentIds.splice(index, 1);
        }
    }


    allTickets() {
        this.router.navigate(['/all-tickets']);
    }

    logout() {
        this.router.navigate(['/login']);
    }

    saveAsDraft() {
        this.state = "DRAFT";
        this.editTicketByUser();
    }

    submit() {
        this.state = "NEW";
        this.editTicketByUser();
    }

    editTicketByUser(): void {
        const token = localStorage.getItem('token');
        const ticket: Ticket = new Ticket(
            this.category,
            this.name,
            this.description,
            this.urgency,
            this.desiredResolutionDate!,
            this.attachmentIds,
            this.comment,
            this.state
        );
        if (token && ticket.category && ticket.name && ticket.urgency && ticket.desiredResolutionDate) {
            this.graphqlService.editTicketByUser(token, this.ticketId, ticket.category, ticket.name, ticket.description, ticket.urgency,
                ticket.desiredResolutionDate, [...ticket.attachmentIds].join(","), ticket.comment, ticket.state).subscribe({
                    next: data => { 
                        console.log(ticket.name) 
                        if(data.errors != null){
                            alert('failed to edit ticket.');
                        } else {
                            this.router.navigate(["/all-tickets/"]);
                        }
                    },
                    error: (error) => console.error('Error :', error)
                })
        } else {
            console.error('Wrong Input');
        }
    }
    

}