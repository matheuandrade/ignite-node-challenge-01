import { randomUUID } from "crypto"
import { Database } from "./database.js"
import { buildRoutePath } from "./utils/build-route-path.js"

const context = new Database()

export const routes = [
    {
        method: 'POST', 
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { 
                title, 
                description, 
                completed_at = null, 
                created_at = new Date, 
                updated_at = null, 
            } = req.body

            const task = {
                id: randomUUID(),
                title,
                description,
                completed_at,
                created_at,
                updated_at
            }

            context.insert('tasks', task)

            return res.writeHead(201).end()
        }
    },
    {
        method: 'GET', 
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {

            const { search } = req.query

            const tasks = context.select('tasks', search)

            return res.end(JSON.stringify(tasks))
        }
    },  
    {
        method: 'GET', 
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {

            const { id } = req.params

            const task = context.selectById('tasks', id)

            if(!task){
                return res.writeHead(404).end()
            }

            return res.end(JSON.stringify(task))
        }
    },    
    {
        method: 'PUT', 
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {

            const { id } = req.params

            const task = 
            {
                updated_at: new Date,
                ...req.body
            }

            const upodatedTask = context.update('tasks', task, id)

            return res.end(JSON.stringify(upodatedTask))
        }
    },
    {
        method: 'DELETE', 
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {

            const { id } = req.params

            context.delete('tasks', id)

            return res.writeHead(204).end()
        }
    },
    {
        method: 'PATCH', 
        path: buildRoutePath('/tasks/:id/complete'),
        handler: (req, res) => {
            const { id } = req.params

            const task = context.selectById('tasks', id)

            if(task){

                task.completed_at = new Date

                const upodatedTask = context.update('tasks', task, id)

                return res.end(JSON.stringify(upodatedTask))
            }

            return response.writeHead(404).end()
        }
    },
]