export class Ticket{
    constructor(public category:string, public name :string,
         public description :string, public urgency :string, public desiredResolutionDate :string, public attachmentIds :number[], public comment :string, public state :string){}
    }