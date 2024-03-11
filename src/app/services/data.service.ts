import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../classes/user.class';
import { ITicket } from '../interfaces/ticket.interface';
import { Observable } from 'rxjs';
import { Login } from '../classes/login.class';
import { Ticket } from '../classes/ticket.class';
import { Attachment } from '../classes/attachment.class';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private http: HttpClient){}

  login(user: User) {
    const body = JSON.stringify({ email: user.email, password: user.password });
    const headers = { 'Content-Type': 'application/json' };
    return this.http.post<Login>("/help-desk/login", body, { headers });
  }

  getAllTickets(): Observable<ITicket[]>{
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<ITicket[]>("/help-desk/ticket/all", { headers });
  }

  getAllTicketsMine(){
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<ITicket[]>("/help-desk/ticket/mine", { headers });
  }

  createTicket(ticket: Ticket){
    const formData = new FormData();
    formData.append('category', ticket.category);
    formData.append('name', ticket.name);
    formData.append('description', ticket.description);
    formData.append('urgency', ticket.urgency);
    formData.append('desiredResolutionDate', ticket.desiredResolutionDate);
    const attachmentIdsString = ticket.attachmentIds.join(',');
    formData.append('attachmentIds', attachmentIdsString);
    formData.append('commentText', ticket.comment);
    formData.append('state', ticket.state);
    //const body = JSON.stringify({ category: ticket.category, name: ticket.name, description: ticket.description, urgency: ticket.urgency,
    //  desiredResolutionDate: ticket.desiredResolutionDate, attachmentIds: ticket.attachmentIds, commentText: ticket.comment, state: ticket.state});
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<Ticket>("/help-desk/ticket/by-user", formData, { headers });
  }
  
  uploadAttachment(attachment: Attachment){
    const token = localStorage.getItem('token');
    const formData = new FormData();
    if (attachment.file) {
      formData.append('fileKey', attachment.file);
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<Attachment>("/help-desk/attachment", formData, { headers });
  }
}