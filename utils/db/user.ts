// db.ts
import Dexie, { Table } from "dexie"

export interface UserData {
    id: number
    name: string
}

export class UserDB extends Dexie {
    userData!: Table<UserData>

    private id: number = 1

    constructor() {
        super("user")
        this.version(1).stores({
            userData: "id, name",
        })
    }

    async get() {
        const data = await this.userData.get(this.id)
        // if (!data) {
        //     await this.userData.add({ id: this.id, name: "" }, this.id)
        //     return { id: this.id, name: "" }
        // }
        return data
    }

    async set(data: Omit<UserData, "id">) {
        // check if exists
        const exists = await this.userData.get(this.id)
        if (exists) {
            await this.userData.update(this.id, data)
        } else {
            await this.userData.add({ id: this.id, ...data }, this.id)
        }
    }
}

export const userDB = new UserDB()
