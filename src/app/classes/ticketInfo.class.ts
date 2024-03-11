export class TicketInfo{
    constructor(public description:string, public createdOn :string, 
        public desiredResolutionDate:string, public assignee :string, 
        public owner:string, public state :string, 
        public category:string, public urgency :string,
        public approver:string){}
    }