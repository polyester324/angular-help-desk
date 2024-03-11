import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule} from "@angular/common/http";
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';
import { AllTicketsComponent } from './all-tickets/all-tickets.component';
import { CreateTicketComponent } from './create-ticket/create-ticket.component';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing';
import { GraphQLModule } from './graphql.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TicketInfoComponent } from './ticket-info/ticket-info.component';
import { EditTicketComponent } from './edit-ticket/edit-ticket.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { FeedbackInfoComponent } from './feedback-info/feedback-info.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    AllTicketsComponent,
    CreateTicketComponent,
    TicketInfoComponent,
    EditTicketComponent,
    FeedbackComponent,
    FeedbackInfoComponent
  ],
  imports: [
    BrowserModule,
    [HttpClientModule],
    FormsModule,
    AppRoutingModule,
    GraphQLModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class AppModule { }
