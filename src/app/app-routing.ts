import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllTicketsComponent } from './all-tickets/all-tickets.component';
import { LoginComponent } from './login/login.component';
import { CreateTicketComponent } from './create-ticket/create-ticket.component';
import { TicketInfoComponent } from './ticket-info/ticket-info.component';
import { EditTicketComponent } from './edit-ticket/edit-ticket.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { FeedbackInfoComponent } from './feedback-info/feedback-info.component';

const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  { path: 'login', component: LoginComponent },
  { path: 'all-tickets', component: AllTicketsComponent },
  { path: 'create-ticket', component: CreateTicketComponent },
  { path: 'ticket-info/:id/:name', component: TicketInfoComponent },
  { path: 'edit-ticket/:id/:name', component: EditTicketComponent },
  { path: 'feedback/:id/:name', component: FeedbackComponent },
  { path: 'feedback-info/:id/:name', component: FeedbackInfoComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }