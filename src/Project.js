export class Project{
    constructor(name){
        this.name = name
        this.id = crypto.randomUUID()
    }
}