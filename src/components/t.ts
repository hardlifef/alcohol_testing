import Hero_Scrapper from "./scrapper.js";
import fs from "node:fs"


let url = 'https://shopredspirits.com/shop?product-id=5edfcbdb8baad42ff9a54890&option-id=0c15fe7067a25677d0de6724dd62212c1ca0c6b84e5f8f3ae88e4dd89fd1e655'
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

        let ProductDetails = (await content.innerText).trim().split('\n')

        console.log((await content.innerText))
        console.log(JSON.stringify(ProductDetails))

        for (let i = 0; i < ProductDetails.length; i += 2) {
            let key = ProductDetails[i]
            let value = ProductDetails[i + 1]
            Product[ProductDetails[i]] = ProductDetails[i + 1];
        }
        console.log(Product)


    }
}