import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
    #database = {}

    constructor(){
        fs.readFile(databasePath, 'utf8')
            .then(data => {
                this.#database = JSON.parse(data)
            })
            .catch(() => {
                this.#persist()
            })
    }

    #persist() {
        fs.writeFile(databasePath, JSON.stringify(this.#database))
    }

    selectById(tableName, id) {
        let data =  this.#database[tableName] ?? []     

        return data.find(row => row.id === id)
    }

    select (tableName, search) {
       let data =  this.#database[tableName] ?? []       

       if(search){
        const lowerCaseSearch = search.toLowerCase()

        data = data.filter(row => {
            return  row.name === lowerCaseSearch || 
                    row.email.toLowerCase() === lowerCaseSearch
        })
       }

       return data
    }

    insert(tableName, data) {
        if(Array.isArray(this.#database[tableName])) {
            this.#database[tableName].push(data)
        }else {
            this.#database[tableName] = [data]
        }

        this.#persist()

        return data
    }

    update(tableName, data, id) {
        const rowIndex = this.#database[tableName].findIndex(row => row.id === id)

        if(rowIndex > -1) {

            const object = {
                ...this.#database[tableName][rowIndex],
                ...data
            }

            this.#database[tableName][rowIndex] = object
        }

        this.#persist()
    }

    delete(tableName, id) {
        const rowIndex = this.#database[tableName].findIndex(row => row.id === id)

        if(rowIndex > -1) {
            this.#database[tableName].splice(rowIndex, 1)
        }

        this.#persist()
    }
}