import { Component, ElementRef, HostListener, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { GraphqlService } from "../services/graphql.service";
import { TicketInfo } from "../classes/ticketInfo.class";
import { IHistory } from "../interfaces/history.interface";
import { IComment } from "../interfaces/comment.interface";
import { BehaviorSubject } from "rxjs";

@Component({
    selector: 'app-ticket-info',
    templateUrl: './ticket-info.component.html',
    styleUrls: ['./ticket-info.component.css']
})
export class TicketInfoComponent implements OnInit {
    constructor(private route: ActivatedRoute, private graphqlService: GraphqlService, private router: Router) { }
    flag: boolean = false;
    ticketId: number = 0;
    ticketName: string = "";
    attachmentIds: number[] = [];
    createdOn: string = "";
    category: string = "";
    description: string = "";
    urgency: string = "";
    desiredResolutionDate: string = "";
    comment: string = "";
    state: string = "";
    owner: string = "";
    assignee: string = "";
    approver: string = "";
    isShowAll = false;
    imageData: string[] = []; 

    @ViewChild('listOfComments', { static: true }) listOfComments!: ElementRef;
    commentsPerPage: number = 5;
    currentPage: number = 0;

    ticket: TicketInfo | null = null;
    histories: IHistory[] = [];
    comments: IComment[] = [];

    ngOnInit(): void {
        const token = localStorage.getItem('token');
        if (!token) {
            this.router.navigate(['/login']);
        } else {
            console.log("token info: " + token);
            this.ticketId = +this.route.snapshot.paramMap.get('id')!;
            this.ticketName = this.route.snapshot.paramMap.get('name')!;
            this.graphqlService.getAllAttachmentTicketLinkByTicketId(token, this.ticketId).subscribe({
                next: data => {
                    for (let i = 0; i < data.data.getAllAttachmentTicketLinkByTicketId.length; i++) {
                        this.attachmentIds.push(data.data.getAllAttachmentTicketLinkByTicketId[i].attachmentId);
                        this.graphqlService.getAttachmentById(token, data.data.getAllAttachmentTicketLinkByTicketId[i].attachmentId).subscribe({
                            next: data => {
                                this.imageData.push(data.data.getAttachmentById.blob);
                            },
                            error: (error) => console.error('Error fetching tickets:', error)
                        })
                    }
                    console.log(this.attachmentIds)
                },
                error: (error) => console.error('Error fetching tickets:', error)
            })
    
            this.graphqlService.getTicketByIdForTicketInfo(token!, this.ticketId).subscribe({
                next: data => {
                    this.ticket = this.formatTicket(data.data.getTicketByIdForTicketInfo);
                },
                error: (error) => console.error('Error fetching tickets:', error)
            })
            this.loadHistoryComments();
        }
    }
    downloadImage(imageSrc: string): void {
        const byteString = atob(imageSrc.split(',')[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ia], { type: 'image/png' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `image_${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }

    allTickets() {
        this.router.navigate(['/all-tickets']);
    }

    logout() {
        this.router.navigate(['/login']);
    }

    formatTicket(ticket: TicketInfo): TicketInfo {
        if (!ticket || !ticket.desiredResolutionDate || !ticket.createdOn) return ticket;
        const formattedTicket = { ...ticket };
        const formatDate = (dateString: string): string => {
            const date = new Date(dateString);
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        };

        formattedTicket.desiredResolutionDate = formatDate(ticket.desiredResolutionDate);
        formattedTicket.createdOn = formatDate(ticket.createdOn);

        return formattedTicket;
    }

    page$ = new BehaviorSubject<number>(1);

    loadHistoryComments(): void {
        const token = localStorage.getItem('token');
        if (this.flag) {
            if (token) {
                this.graphqlService.getAllCommentsWithTicketId(token, this.ticketId, 0, this.page$.value * 5).subscribe({
                    next: data => {
                        this.comments = data.data.getAllCommentsWithTicketId;
                        this.comments = this.formatCommentDates(this.comments);
                        console.log(this.comments);
                    },
                    error: (error) => console.error('Error fetching Comments:', error)
                });
            } else {
                console.error('Token not found!');
            }
        } else {
            if (token) {
                this.graphqlService.getAllHistoriesWithTicketId(token, this.ticketId).subscribe({
                    next: data => {
                        this.histories = data.data.getAllHistoriesWithTicketId;
                        this.histories = this.formatCommentDates(this.histories);
                    },
                    error: (error) => console.error('Error fetching Histories:', error)
                })
            } else {
                console.error('Token not found!');
            }
        }
    }

    showAll() {
        if (!this.isShowAll) {
            this.isShowAll = true;
            this.page$.next(2);
            this.loadHistoryComments();
        }
    }

    getHistory() {
        this.flag = false;
        this.loadHistoryComments();
    }

    getComments() {
        this.flag = true;
        this.loadHistoryComments();
    }

    private countPage = 1;

    @HostListener('window:scroll', [])
    onScroll(): void {
        if (this.isShowAll && window.innerHeight + window.scrollY >= document.body.offsetHeight) {
            this.countPage++;
            this.page$.next(this.countPage);
            this.loadHistoryComments();
        }
    }

    addComment(){
        const token = localStorage.getItem('token');
        if (token) {
            this.graphqlService.addComment(token, this.ticketId, this.comment).subscribe({
                next: data => {
                    console.log(data);
                    this.loadHistoryComments();
                },
                error: (error) => console.error('Error fetching Histories:', error)
            })
        } else {
            console.error('Token not found!');
        }
    }

    formatCommentDates(objects: any[]): any[] {
        const formattedObjects = objects.map(obj => {
            if (obj.date) {
                const date = new Date(obj.date);
                obj.date = date.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' });
                obj.timestamp = date.getTime();
            }
            return obj;
        });
        formattedObjects.sort((a, b) => b.timestamp - a.timestamp);
    
        return formattedObjects;
    }
}