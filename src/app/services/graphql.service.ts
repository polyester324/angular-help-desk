import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GraphqlService {
  private graphqlUrl = 'help-desk/graphql';

  constructor(private http: HttpClient) { }

  getAllTicketsFor(token: string) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(this.graphqlUrl, {
      query: `
        query {
          getAllTicketsFor {
            id
            name
            desiredResolutionDate
            stateId
            urgencyId
          }
        }
      `
    }, { headers });
  }

  getAllMyTicketsFor(token: string) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(this.graphqlUrl, {
      query: `
        query {
          getAllMyTicketsFor {
            id
            name
            desiredResolutionDate
            stateId
            urgencyId
          }
        }
      `
    }, { headers });
  }

  createTicketByUser(token: string, category: string, name: string, description: string,
    urgency: string, desiredResolutionDate: string, attachmentIds: string, commentText: string, state: string,) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(this.graphqlUrl, {

      query: `
        mutation CreateTicketByUser($category: String!, $name: String!, $description: String, 
          $urgency: String!, $desiredResolutionDate: String!, $attachmentIds: String, 
          $commentText: String, $state: String!) {
            createTicketByUser(dto: { category: $category, name: $name, description: $description,
                urgency: $urgency, desiredResolutionDate: $desiredResolutionDate, attachmentIds: $attachmentIds, 
                commentText: $commentText, state: $state }){
                    id
                    name
                } 
        }
      `,
      variables: {
        category: category,
        name: name,
        description: description,
        urgency: urgency,
        desiredResolutionDate: desiredResolutionDate,
        attachmentIds: attachmentIds,
        commentText: commentText,
        state: state,
      }
    }, { headers });
  }

  editTicketByUser(token: string, id: number, category: string, name: string, description: string,
    urgency: string, desiredResolutionDate: string, attachmentIds: string, commentText: string, state: string,) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(this.graphqlUrl, {

      query: `
        mutation EditTicketByUser($id: ID!, $category: String!, $name: String!, $description: String!, 
          $urgency: String!, $desiredResolutionDate: String!, $attachmentIds: String, 
          $commentText: String!, $state: String!) {
            editTicketByUser(dto: { id: $id, category: $category, name: $name, description: $description,
                urgency: $urgency, desiredResolutionDate: $desiredResolutionDate, attachmentIds: $attachmentIds, 
                commentText: $commentText, state: $state }){
                    id
                    name
                } 
        }
      `,
      variables: {
        id: id,
        category: category,
        name: name,
        description: description,
        urgency: urgency,
        desiredResolutionDate: desiredResolutionDate,
        attachmentIds: attachmentIds,
        commentText: commentText,
        state: state,
      }
    }, { headers });
  }


  createAttachment(token: string, blob: string, name: string) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(this.graphqlUrl, {
      query: `
        mutation CreateAttachment($blob: String!, $name: String!) {
          createAttachment(file: { blob: $blob, name: $name})
        }
      `,
      variables: {
        blob: blob,
        name: name,
      }
    }, { headers });
  }

  getTicketByIdForTicketInfo(token: string, id: number) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(this.graphqlUrl, {
      query: `
        query GetTicketByIdForTicketInfo($id: ID!){
          getTicketByIdForTicketInfo(id: $id) {
            description
            createdOn
            desiredResolutionDate
            assignee
            owner
            state
            category
            urgency
            approver
          }
        }
      `,
      variables: {
        id: id
      }
    }, { headers });
  }

  getAllHistoriesWithTicketId(token: string, id: number) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(this.graphqlUrl, {
      query: `
        query GetAllHistoriesWithTicketId($id: ID!){
          getAllHistoriesWithTicketId(id: $id) {
            date
            action
            user
            description
          }
        }
      `,
      variables: {
        id: id
      }
    }, { headers });
  }

  getAllCommentsWithTicketId(token: string, id: number, page: number, size: number) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(this.graphqlUrl, {
      query: `
        query GetAllCommentsWithTicketId($id: ID!, $page: Int!, $size: Int!){
          getAllCommentsWithTicketId(id: $id, page: $page, size: $size) {
            user
            text
            date
          }
        }
      `,
      variables: {
        id: id,
        page: page,
        size: size
      }
    }, { headers });
  }

  getFeedbackByTicketId(token: string, id: number) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(this.graphqlUrl, {
      query: `
        query GetFeedbackByTicketId($id: ID!){
          getFeedbackByTicketId(id: $id) {
            rate
            text
          }
        }
      `,
      variables: {
        id: id
      }
    }, { headers });
  }

  getAllAttachmentTicketLinkByTicketId(token: string, id: number) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(this.graphqlUrl, {
      query: `
        query GetAllAttachmentTicketLinkByTicketId($id: ID!){
          getAllAttachmentTicketLinkByTicketId(id: $id) {
            id
            attachmentId
          }
        }
      `,
      variables: {
        id: id
      }
    }, { headers });
  }

  getAttachmentById(token: string, id: number) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(this.graphqlUrl, {
      query: `
        query GetAttachmentById($id: ID!){
          getAttachmentById(id: $id) {
            id
            blob
            name
          }
        }
      `,
      variables: {
        id: id
      }
    }, { headers });
  }

  updateTicketStatus(token: string, id: number, newState: string) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(this.graphqlUrl, {
      query: `
        mutation UpdateTicketStatus($id: ID!, $newState: String!) {
          updateTicketStatus(dto: { id: $id, newState: $newState}){
            stateId
          }
        }
      `,
      variables: {
        id: id,
        newState: newState
      }
    }, { headers });
  }

  addComment(token: string, ticketId: number, text: string) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(this.graphqlUrl, {
      query: `
        mutation AddComment($ticketId: ID!, $text: String) {
          addComment(dto: { ticketId: $ticketId, text: $text }){
                    id
                } 
        }
      `,
      variables: {
        ticketId: ticketId,
        text: text
      }
    }, { headers });
  }

  giveFeedback(token: string, rate: string, ticketId: number, text: string) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(this.graphqlUrl, {
      query: `
      mutation GiveFeedback($id: ID, $userId: ID, $rate: String!, $date: String, $text: String, $ticketId: ID!) {
        giveFeedback(dto: { id: $id, userId: $userId, rate: $rate, date: $date, text: $text, ticketId: $ticketId }) {
          id
        }
      }
      `,
      variables: {
        rate: rate,
        ticketId: ticketId,
        text: text
      }
    }, { headers });
  }

}


