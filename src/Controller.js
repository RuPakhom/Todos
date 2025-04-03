import { Task } from "./Task.js"
import { Project } from "./Project.js"
import { format } from "date-fns"
import PubSub from "./Broker.js"
import ui  from "./UI.js"



export class Controller{
    SCREENS = Object.freeze({
        inbox: "inbox:data",
        today: "today:data",
        upcoming: "upcoming:data",
        overdue: "overdue:data",
        completed: "completed:data"
    })
    constructor(){
        this.tasks = []
        this.projects = []
        this.defaultProject = new Project("Default")
        this.projects.push(this.defaultProject)
        this.currentProjectId = this.defaultProject.id
        this.currentScreen = "inbox"
    }

    changeCurrentProject(newProjectId){
        this.currentProjectId = newProjectId
    }

    getTasks(){
        return this.tasks
    }

    getTask(id){
        return this.tasks.find(item => item.id === id)
    }

    getProject(id){
        return this.projects.find(item => item.id === id)
    }

    getTasksByProjectId(projectId){
        return this.tasks.filter(item => item.projectId === projectId)
    }

    getNonCompletedTasks(){
        return this.tasks.filter(item => item.done === false)
    }

    getCompletedTasks(){
        return this.tasks.filter(item => item.done === true)
    }

    getTasksForToday(){
        return this.tasks.filter(item => item.dueDateIsToday())

    }

    getOverdueTasks(){
        return this.tasks.filter(item => item.overdue())
    }

    getUpcomingTasks(){
        return this.tasks.filter(item => item.upcoming())
    }

    getProjects(){
        return this.projects
    }

    getCurrentScreen(){
        return this.currentScreen
    }

    createNewTask(title, description, dueDate, priority, projectId = this.currentProjectId){

        const task = new Task(title, description, dueDate, priority, projectId)
        this.tasks.push(task)

    }

    createNewProject(name){
        const project = new Project(name)
        this.projects.push(project)
    }

    deleteTaskById(id){
        this.tasks = this.tasks.filter(item => item.id !== id)
    }

    deleteProjectById(id){
        if (this.projects.length === 1) return false
        this.projects = this.projects.filter(item => item.id !== id)
        this.tasks = this.tasks.filter(item => item.projectId !== id)
        return true
    }

    updateTask(id, data){
        const task = this.getTask(id)
        const dataKeys = Object.keys(data)

        dataKeys.forEach(key => {
            task[key] = data[key]
        })
    }

    updateProject(id, data){
        const project = this.getProject(id)
        const dataKeys = Object.keys(data)

        dataKeys.forEach(key => {
            project[key] = data[key]
        })

    }

    normalizeTasksForUI(tasks){
        return tasks.map(item => {
           return {
            ...item,
            projectName: this.getProject(item.projectId).name,
            dueDate:item.dueDate
           } 
        })
    }

    screenData(screen){
        const data = {
            inbox: this.getNonCompletedTasks(),
            today: this.getTasksForToday(),
            upcoming: this.getUpcomingTasks(),
            overdue: this.getOverdueTasks(),
            completed: this.getCompletedTasks()
        }[screen]

        return data
    }

    getDataForRender(data){
        return ({
            "tasks":this.normalizeTasksForUI(data), 
            "screen":this.getCurrentScreen(), 
            "project":this.getProject(this.currentProjectId)
            })
    }


    saveToStorage(){
        const plainTasks = this.tasks.map(task => ({
            ...task,
            dueDate: task.dueDate instanceof Date ? task.dueDate.toISOString() : task.dueDate,
        }))
        localStorage.setItem("tasks", JSON.stringify(plainTasks))
        localStorage.setItem("projects", JSON.stringify(this.projects))
    }

    loadFromStorage(){
        const tasksData = JSON.parse(localStorage.getItem("tasks") || "[]")
        const projectsData = JSON.parse(localStorage.getItem("projects") || "[]")
    
        this.tasks = tasksData.map(t => {
            return new Task(t.title, t.description, t.dueDate, t.priority, t.projectId)
        })

        this.tasks.forEach((task, i) => {
            task.id = tasksData[i].id
            task.done = tasksData[i].done
        })
    
        this.projects = projectsData.map(p => new Project(p.name))
        this.projects.forEach((project, i) => {
            project.id = projectsData[i].id
        })
    }


    init(){

        ui.init()
        this.loadFromStorage()

        PubSub.subscribe("task:new", (data) => {
            const {title, description, dueDate, priority, projectId} = data
            this.createNewTask(title, description, dueDate, priority, projectId)
            const event = this.SCREENS[this.currentScreen] || "project:data"
            const eventData = this.screenData(this.currentScreen) || this.getTasksByProjectId(this.currentProjectId)
            PubSub.publish(event, this.getDataForRender(eventData))
            this.saveToStorage()
        })

        PubSub.subscribe("project:new", (name) => {
            this.createNewProject(name)
            PubSub.publish("project:created", this.getProjects())
            if(!this.currentScreen){
                const data = this.getTasksByProjectId(this.currentProjectId)
                PubSub.publish("project:data", this.getDataForRender(data))
            }
            this.saveToStorage()
        })

        Object.keys(this.SCREENS).forEach(screen => {
            PubSub.subscribe(`click:${screen}`, () => {
                const data = this.screenData(screen)
                this.currentScreen = screen
                PubSub.publish(this.SCREENS[screen], this.getDataForRender(data))
            })
        })

        PubSub.subscribe("click:project", (projectID) => {
            const data = this.getTasksByProjectId(projectID)
            this.currentScreen = ""
            this.changeCurrentProject(projectID)
            PubSub.publish("project:data", this.getDataForRender(data))
    })

        PubSub.subscribe("click:deleteproject", (projectId) => {
            
            const succes = this.deleteProjectById(projectId)
            if(!succes){
                alert("You can't delete all projects")
                return
            }
            if(!this.currentScreen)
            if(this.currentProjectId === projectId){
                this.currentProjectId = this.projects[0].id
            }
            this.saveToStorage()
            
            PubSub.publish("project:deleted", this.getProjects())
            if(!this.currentScreen){
                this.currentScreen = "inbox"
                PubSub.publish("inbox:data",this.getDataForRender(this.getTasks()))
            }
            this.saveToStorage()
        })

        PubSub.subscribe("click:editproject", ({projectId, modal}) => {
            const project = this.getProject(projectId)
            PubSub.publish("project:edit", {
                modal,
                "mode":"edit",
                "data":project
                
            })
            this.saveToStorage()
        })

        PubSub.subscribe("click:updateproject", ({name, projectId}) => {
            const project = this.getProject(projectId)
            project.name = name
            PubSub.publish("project:created", this.getProjects())
            if(!this.currentScreen){
                const data = this.getTasksByProjectId(this.currentProjectId)
                PubSub.publish("project:data", this.getDataForRender(data))
            }
            this.saveToStorage()
            
        })

        PubSub.subscribe("click:edittask", ({taskId, modal}) => {
            const task = this.getTask(taskId)
            const dueDate = task.dueDate
            const date = format(dueDate, "dd MMMM yyyy", new Date())
            task.formattedDate = format(date, "yyyy-MM-dd")
            if(task){
                PubSub.publish("task:edit", {
                    modal,
                    "mode":"edit",
                    "data":task
                })
            }
            this.saveToStorage()
        })

        PubSub.subscribe("click:updateTask", ({taskId, title,description,dueDate,priority,projectId}) => {
            const task = this.getTask(taskId)

            task.title = title
            task.description = description
            task.dueDate = dueDate
            task.priority = priority
            task.projectId = projectId

            delete task.formattedDate

            if(this.currentScreen){
                const screen = this.currentScreen
                const data = this.screenData(screen)
                PubSub.publish(this.SCREENS[screen], this.getDataForRender(data))
            }
            else{
                const data = this.getTasksByProjectId(this.currentProjectId)
                PubSub.publish("project:data", this.getDataForRender(data))
            }
            this.saveToStorage()
        })

        PubSub.subscribe("click:deletetask", (id) => {

            this.deleteTaskById(id)
            if(this.currentScreen){
                const screen = this.currentScreen
                const data = this.screenData(screen)
                PubSub.publish(this.SCREENS[screen], this.getDataForRender(data))
            }
            else{
                const data = this.getTasksByProjectId(this.currentProjectId)
                PubSub.publish("project:data", this.getDataForRender(data))
            }
            this.saveToStorage()
        })

        PubSub.subscribe("click:taskstatuschanged", (id) => {
            const task = this.getTask(id)
            task.done = !task.done

            if(this.currentScreen){
                const screen = this.currentScreen
                const data = this.screenData(screen)
                PubSub.publish(this.SCREENS[screen], this.getDataForRender(data))
            }
            else{
                const data = this.getTasksByProjectId(this.currentProjectId)
                PubSub.publish("project:data", this.getDataForRender(data))
            }
            this.saveToStorage()
        })


        
        PubSub.publish("project:created", this.getProjects())
        PubSub.publish("inbox:data", this.getDataForRender(this.getNonCompletedTasks()))
        
    }
    

}