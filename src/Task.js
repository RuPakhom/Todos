import { format } from "date-fns"

export class Task{
    #dueDate
    constructor(title, description, dueDate, priority, projectId){
        this.title = title
        this.description = description
        this.#dueDate = dueDate
        this.priority = priority
        this.done = false
        this.id = crypto.randomUUID()
        this.projectId = projectId
    }

    toggleDone(){
        this.done = !this.done
    }

    get dueDate(){
        return format(this.#dueDate, "dd MMMM yyyy")
    }
    set dueDate(date){
        this.#dueDate = date
    }
} 