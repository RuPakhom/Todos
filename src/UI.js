import PubSub from "./Broker.js"

class UI {
     ICONS = Object.freeze({
        PENCIL: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>`,
        TRASH: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>`,
        ARROW_DOWN: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z"/></svg>`,
        HASH: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="m240-160 40-160H120l20-80h160l40-160H180l20-80h160l40-160h80l-40 160h160l40-160h80l-40 160h160l-20 80H660l-40 160h160l-20 80H600l-40 160h-80l40-160H360l-40 160h-80Zm140-240h160l40-160H420l-40 160Z"/></svg> `,
      });
    constructor(){
        this.container = document.querySelector(".tasks")
        this.projectsMenu = document.querySelector(".projects")
        this.modalTask = document.querySelector("#task-modal")
        this.modalProject = document.querySelector("#project-modal")
        this.addTask = document.querySelector("#addTask")
        this.addProject = document.querySelector("#addProject")
        this.cancelTask = document.querySelector("#closeModalTask")
        this.cancelProject = document.querySelector("#closeModalProject")
        this.saveTask = document.querySelector("#saveModalTask")
        this.saveProject = document.querySelector("#saveModalProject")

        this.taskSection = document.querySelector(".task-section")
        this.projectSection = document.querySelector(".project-section")
        this.currentHandler = null
        
    }

    createCard(task){
        const taskDiv = document.createElement("div")
        taskDiv.classList.add("task")
        taskDiv.dataset.id = task.id

        const mainTask = document.createElement("div")
        mainTask.classList.add("main-task")

        const label = document.createElement("label")
        label.classList.add("input-container")
        label.classList.add("action")

        const input = document.createElement("input")
        input.type = "checkbox"
        input.checked = task.done

        const span = document.createElement("span")
        span.classList.add("custom-checkbox")

        label.appendChild(input)
        label.appendChild(span)
        mainTask.appendChild(label)

        const taskInfo = document.createElement("div")
        taskInfo.classList.add("task-info")

        const taskTitle = document.createElement("div")
        taskTitle.classList.add("task-title")
        taskTitle.textContent = task.title

        const taskAdditionalInfo = document.createElement("div")
        taskAdditionalInfo.classList.add("task-additional-info")

        const taskDueDate = document.createElement("div")
        taskDueDate.classList.add("due-date")
        taskDueDate.textContent = task.dueDate

        const taskPriority = document.createElement("div")
        taskPriority.classList.add("priority")
        taskPriority.textContent = task.priority

        const taskProjectName = document.createElement("div")
        taskProjectName.classList.add("project-name")
        taskProjectName.textContent = task.projectName

        taskAdditionalInfo.appendChild(taskDueDate)
        taskAdditionalInfo.appendChild(taskPriority)
        taskAdditionalInfo.appendChild(taskProjectName)

        taskInfo.appendChild(taskTitle)
        taskInfo.appendChild(taskAdditionalInfo)

        mainTask.appendChild(taskInfo)

        const iconsDiv = document.createElement("div")
        iconsDiv.classList.add("icons")

        const spanEdit = document.createElement("span")
        spanEdit.classList.add("editTask")
        spanEdit.classList.add("action")
        spanEdit.innerHTML = this.ICONS.PENCIL

        const spanDelete = document.createElement("span")
        spanDelete.classList.add("deleteTask")
        spanDelete.classList.add("action")
        spanDelete.innerHTML = this.ICONS.TRASH

        const spanExpand = document.createElement("span")
        spanExpand.classList.add("expandTask")
        spanExpand.classList.add("action")
        spanExpand.innerHTML = this.ICONS.ARROW_DOWN
        
        iconsDiv.appendChild(spanEdit)
        iconsDiv.appendChild(spanDelete)
        iconsDiv.appendChild(spanExpand)

        mainTask.appendChild(iconsDiv)

        const descriptionDiv = document.createElement("div")
        descriptionDiv.classList.add("description")
        descriptionDiv.textContent = task.description

        taskDiv.appendChild(mainTask)
        taskDiv.appendChild(descriptionDiv)
        
        return taskDiv
    }

    renderCards({tasks,screen,project}){
        

        const currentActive = document.querySelector(".active")
        const title = document.querySelector(".main h2")
        
        if(currentActive){
            currentActive.classList.remove("active")
        }

        if(screen){
            const screenUI = document.querySelector(`#${screen.toLowerCase()}`)
            screenUI.classList.add("active")
            title.textContent = screenUI.textContent
        }
        else{
            if(project){
                const screenUI = document.querySelector(`[data-id="${project.id}"]`)
                screenUI.classList.add("active")
                title.textContent = screenUI.textContent
            }    
        }
        
    

        this.container.textContent = ""
        tasks.forEach(task => {
            const card = this.createCard(task)
            this.container.appendChild(card)
        })
    }

    createProjectButton(project){
        const btn = document.createElement("button")
        btn.classList.add("menu-item")
        btn.dataset.id = project.id

        const spanName = document.createElement("span")
        spanName.classList.add("project-name")
        spanName.textContent = project.name

        const spanIcon = document.createElement("span")
        spanIcon.classList.add("spanIcon")
        spanIcon.innerHTML = this.ICONS.HASH

        const spanEdit = document.createElement("span")
        spanEdit.classList.add("spanEdit")
        spanEdit.innerHTML = this.ICONS.PENCIL

        const spanDelete = document.createElement("span")
        spanDelete.classList.add("spanDelete")
        spanDelete.innerHTML = this.ICONS.TRASH


        btn.appendChild(spanIcon)
        btn.appendChild(spanName)
        btn.appendChild(spanEdit)
        btn.appendChild(spanDelete)

        return btn
    }

    renderProjects(projects){

        const projectSelect = this.modalTask.querySelector("select#projectName")

        projectSelect.textContent = ""
        this.projectsMenu.textContent = ""
        projects.forEach(project => {
            const projectBtn = this.createProjectButton(project)
            this.projectsMenu.appendChild(projectBtn)

            const option = document.createElement("option")
            option.value = project.id
            option.textContent = project.name
            projectSelect.appendChild(option)
        })     

    }

    openModal({modal, mode, data = null}){
        modal.classList.remove("hidden")
        modal.classList.add("show")

        const btn = modal.querySelector(`[type="submit"]`)

        if(mode === "create" && modal === this.modalTask){

            const handler = (e) => {
                e.preventDefault()
 
                const title = this.modalTask.querySelector("#title").value
                const description = this.modalTask.querySelector("#description").value
                const dueDate = this.modalTask.querySelector("#duedate").value
                const priority = this.modalTask.querySelector("#priority").value
                const projectId = this.modalTask.querySelector("#projectName").value
        
                if(!title.trim() || !dueDate || !description.trim()){
                    alert("Please populate all mandatory fields")
                    return
                }
        
                PubSub.publish("task:new", {title,description,dueDate,priority,projectId})
                this.closeModal(this.modalTask)

            }
            this.currentHandler = handler
            btn.addEventListener("click", handler)
        }

        if(mode === "create" && modal === this.modalProject){
            const handler = (e) => {
                e.preventDefault()
                const name = this.modalProject.querySelector("#name").value
        
                if(!name.trim()){
                    alert("Please populate all mandatory fields")
                    return
                }
        
                PubSub.publish("project:new", name)
                this.closeModal(this.modalProject)
            }
            this.currentHandler = handler
            btn.addEventListener("click", handler)
        }

        if(mode === "edit" && modal === this.modalTask){
           
            const title = this.modalTask.querySelector("#title")
            title.value = data.title
            const description = this.modalTask.querySelector("#description")
            description.value = data.description
            const dueDate = this.modalTask.querySelector("#duedate")
            dueDate.value = data.formattedDate
            const priority = this.modalTask.querySelector("#priority")
            priority.value = data.priority
            const projectId = this.modalTask.querySelector("#projectName") 
            projectId.value = data.projectId
            const handler = (e) => {
                e.preventDefault()
                if(!title.value.trim() || !dueDate.value || !description.value.trim()){
                    alert("Please populate all mandatory fields")
                    return
                }
                PubSub.publish("click:updateTask", {
                    "taskId": data.id, 
                    "title":title.value,
                    "description": description.value,
                    "dueDate": dueDate.value,
                    "priority": priority.value,
                    "projectId": projectId.value
                })
                this.closeModal(this.modalTask)
            }
            this.currentHandler = handler
            btn.addEventListener("click", handler)

            
        }

        if(mode === "edit" && modal === this.modalProject){
            const name = modal.querySelector("#name")
            name.value = data.name
            
            const handler = (e) => {
                e.preventDefault()
                if(!name.value.trim()){
                    alert("Please populate all mandatory fields")
                    return
                }
                PubSub.publish("click:updateproject", {"name":name.value, "projectId":data.id})
                this.closeModal(modal)
            }
            this.currentHandler = handler
            btn.addEventListener("click", handler)
        }
        

    }

    closeModal(modal){
        modal.classList.remove("show")
        modal.classList.add("hidden")
        modal.querySelector("form").reset()
        const btn = modal.querySelector(`[type="submit"]`)
        btn.removeEventListener("click", this.currentHandler)
        this.currentHandler = null
    }

    showTaskForm(){
        this.openModal({"modal": this.modalTask, "mode":"create"})
    }


    showProjectForm(){
        this.openModal({"modal": this.modalProject, "mode":"create"})
    }


    taskSectionHandler(e){
        if(!e.target.classList.contains("menu-item")) return
        const currentActive = document.querySelector(".active")
        
        if(e.target === currentActive) return

        if(e.target.id === "inbox"){
            PubSub.publish("click:inbox")
        }
        if(e.target.id === "today"){
            PubSub.publish("click:today")
        }
        if(e.target.id === "upcoming"){
            PubSub.publish("click:upcoming")
        }
        if(e.target.id === "overdue"){
            PubSub.publish("click:overdue")
        }
        if(e.target.id === "completed"){
            PubSub.publish("click:completed")
        }
    }

    projectSectionHandler(e){
        const targetBtn = e.target.closest(".menu-item")
        if(!targetBtn) return
        
        if(e.target.closest(".spanDelete")){
            this.deleteProject(e)
            return
        }
        if(e.target.closest(".spanEdit")){
            this.editProject(e)
            return
        }
      
        const currentActive = document.querySelector(".active")

        if(targetBtn === currentActive) return

        const projectID = targetBtn.dataset.id        
        PubSub.publish("click:project", projectID)
    }

    deleteProject(e){
        const projectBtn = e.target.closest(".menu-item")
        
        PubSub.publish("click:deleteproject", projectBtn.dataset.id)
        if(!document.querySelector(".active")){
            PubSub.publish("click:inbox")
        }
    }

    editProject(e){
        const projectBtn = e.target.closest(".menu-item")
        PubSub.publish("click:editproject", 
            {
                "projectId":projectBtn.dataset.id,
                 "modal":this.modalProject
            }
        )
    }

    editTask(id){
        PubSub.publish("click:edittask", 
            {
                "taskId": id,
                "modal": this.modalTask
            })
    }

    deleteTask(id){
        PubSub.publish("click:deletetask", id)
    }

    changeStatus(id){
        PubSub.publish("click:taskstatuschanged", id)
    }

    containerHandler(e){
        const action = e.target.closest(".action")
        if(!action) return

        const task = action.closest(".task")
        const id = task.dataset?.id

        if(action.classList.contains("expandTask")){
            const description = task.querySelector(".description")
            const { display } = getComputedStyle(description)
            if(display === "none"){
                description.style.display = "block"
            }
            if(display === "block"){
                description.style.display = "none"
            }

        }

        if(action.classList.contains("editTask")){
            this.editTask(id)
        }

        if(action.classList.contains("deleteTask")){
            this.deleteTask(id)
        }
        if(action.classList.contains("input-container")){
            this.changeStatus(id)
        }
    }

    init(){
        this.addTask.addEventListener("click",this.showTaskForm.bind(this))
        this.addProject.addEventListener("click",this.showProjectForm.bind(this))
        this.cancelTask.addEventListener("click", () => this.closeModal(this.modalTask))
        this.cancelProject.addEventListener("click", () => this.closeModal(this.modalProject))
        this.taskSection.addEventListener("click",this.taskSectionHandler.bind(this))
        this.projectSection.addEventListener("click",this.projectSectionHandler.bind(this))
        this.container.addEventListener("click", this.containerHandler.bind(this))

        PubSub.subscribe("task:created", this.renderCards.bind(this))
        PubSub.subscribe("project:created", this.renderProjects.bind(this))
        PubSub.subscribe("inbox:data", this.renderCards.bind(this))
        PubSub.subscribe("today:data", this.renderCards.bind(this))
        PubSub.subscribe("upcoming:data", this.renderCards.bind(this))
        PubSub.subscribe("overdue:data", this.renderCards.bind(this))
        PubSub.subscribe("completed:data", this.renderCards.bind(this))
        PubSub.subscribe("project:data", this.renderCards.bind(this))
        PubSub.subscribe("project:deleted", this.renderProjects.bind(this))
        PubSub.subscribe("project:edit", this.openModal.bind(this))
        PubSub.subscribe("task:edit", this.openModal.bind(this))
    }




  
}

export default new UI()