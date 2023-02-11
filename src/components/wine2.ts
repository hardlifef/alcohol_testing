import Hero_Scrapper from "./scrapper.js"
import { product } from "../types/index.js"
import Sleep from "../misc/sleep.js"
import SaveHandler from "../misc/save_handler.js"
import fs from "fs"


export default class win2 extends Hero_Scrapper {
    private source: string
    public static env: any | null = null
    constructor(source: string) {
        super()
        this.source = source
    }
    protected async $extract(): Promise<void> {
        if (!this.$client) return
        await this.$bypass("https://shopredspirits.com/")
        await this.$client!.goto(this.source, { timeoutMs: 0 })
        await this.$client!.waitForLoad('AllContentLoaded')
        await Sleep.For(2)

        let nextPage = true
        let numberOfElements = 0

        let increment = 250

        while (nextPage) {
            try {
                console.log(await this.$client.url)
                let Links = await this.$client.querySelectorAll('div.item-wrapper.product').$map((async (t) => {
                    return await t.querySelector('a').href
                }))
                console.log(Links)
                if (Links.length > 0) {
                    for (const link of Links) {
                        let product = await this.SinglePage(link)
                        if (product !== undefined) {
                            console.log(product)
                            this.$payload.push(product)
                        }
                    }
                    SaveHandler.To_JSON(this.$payload)
                    this.$payload = []

                    numberOfElements = numberOfElements + 18

                    if (numberOfElements % increment === 0) {
                        console.log('Starting the Server Again for a bit')
                        await this.$restart("https://shopredspirits.com/")
                    }

                    await this.$client!.goto(`${this.source}&skip=${numberOfElements}`
                        , { timeoutMs: 0 })
                    await this.$client.waitForLoad('AllContentLoaded')

                } else {
                    nextPage = false
                }

            } catch (error) {
                console.log(error)
                nextPage = false

            }
        }
    }

    protected async SinglePage(url: string): Promise<product | undefined> {
        console.log(url)
        let Attempting = 0

        while (Attempting < 5) {
            try {
                let Product: any = {}
                await this.$client!.goto(url, { timeoutMs: 0 })
                await this.$client!.waitForLoad("AllContentLoaded")
                fs.writeFileSync('fe.jpeg', await this.$client!.takeScreenshot())
                let t = JSON.parse(await this.$client!.document.querySelector('#product-metadata').innerText)
                let content = this.$client!.xpathSelector('/html/body/main/div/div/article/ch-elements.product.page/div/div[1]/div[3]/div[2]/div[6]/div[2]');
                Product["name"] = t.name
                Product["url"] = t.url
                Product["image"] = t.image
                Product["description"] = t.description
                Product["Address"] = t.offers.seller.address
                Product["PhoneNumber"] = t.offers.seller.telephone
                Product["price"] = t.offers.price
                Product["priceCurrency"] = t.offers.priceCurrency
                Product["ratingValue"] = t.aggregateRating.ratingValue
                Product["revieCount"] = t.aggregateRating.reviewCount

                let ProductDetails = (await content.innerText).split('\n')

                for (let i = 0; i < ProductDetails.length; i += 2) {
                    let key = ProductDetails[i].replace(/\s+/g, "_");
                    let value = ProductDetails[i + 1];
                    if (value !== undefined) {
                        if (value.endsWith(',')) {
                            value = value.slice(0, -1);

                            value = ProductDetails[i + 1] + `${ProductDetails[i + 2]}`
                            i += 1
                        }
                        Product[key] = value;
                    }

                }

                TODO: // This needs to check if there is a value of null and will try again if fails again it will return null non the less 
                /*    let check_null = Object.values(Product).every(value => value != null);
   
                   if (check_null) {
                       return Product
                   } else {
                       Attempting++
                   } */
                return Product

            } catch (error) {
                console.log('Trying again')
                Attempting++
                return undefined
            }
        }
    }
}