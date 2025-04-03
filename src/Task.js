import { format } from "date-fns"

export class Task{
    #dueDate
    constructor(title, description, dueDate, priority, projectId){
        this.title = title
        this.description = description
        this.#dueDate = new Date(dueDate)
        this.priority = priority
        this.done = false
        this.id = crypto.randomUUID()
        this.projectId = projectId
    }

    toggleDone(){
        this.done = !this.done
    }

    dueDateIsToday(){
        return (new Date().toDateString() === this.#dueDate.toDateString()) && !this.done
    }

    overdue(){
        const today = new Date()
        return (this.#dueDate < today) && !this.done
    }

    upcoming(){
        const today = new Date()
        return (this.#dueDate > today) && !this.done
    }

    getDateObject(){
        return this.#dueDate
    }

    get dueDate(){
        return format(this.#dueDate, "dd MMMM yyyy")
    }
    set dueDate(date){
        this.#dueDate = new Date(date)
    }
} 