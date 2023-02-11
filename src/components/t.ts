import Hero_Scrapper from "./scrapper.js";
import fs from "node:fs"


let url = 'https://shopredspirits.com/shop?product-id=61928ca41691ac0ff4bd38c8&option-id=50cc6bcc5f177363ef8f459aaff1e27ff95bfd79cae36f63b294d96d18d8d540'

export default class WIN3 extends Hero_Scrapper {
    protected async $extract() {
        let Product: any = {}
        if (!this.$client) return
        await this.$bypass("https://shopredspirits.com/")
        await this.$client!.goto(url,
            { timeoutMs: 0 })
        await this.$client!.waitForLoad('AllContentLoaded')
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


        console.log(ProductDetails)

        for (let i = 0; i < ProductDetails.length; i += 2) {
            let key = ProductDetails[i].replace(/\s+/g, "_");
            let value = ProductDetails[i + 1];
            let sweep = true
            if (value !== undefined) {
                while (sweep) {
                    if (value.endsWith(',')) {
                        value = value.slice(0, -1)

                    }
                }
            }
            Product[key] = value;
        }

        console.log(Product)
    }

}
/* 
        for (let i = 0; i < ProductDetails.length; i += 2) {
            let key = ProductDetails[i]
            let value = ProductDetails[i + 1]
            Product[ProductDetails[i]] = ProductDetails[i + 1];
        } */

