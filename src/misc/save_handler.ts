import fs from "node:fs"
import { product } from "../types"

export default class SaveHandler {

    public static To_JSON(Data: product[]) {
        console.log(`[+] Saving to json file ...`)
        try {
            fs.writeFileSync('../output/test.json', JSON.stringify(Data))
            console.log(`[+] Saving Succsefull...`)

        } catch (error) {
            console.log(`[-] saving Failed ...`)
            console.log(error)
        }

    }
}

