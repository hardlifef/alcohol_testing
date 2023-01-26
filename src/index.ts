import win2 from "./components/wine2.js";
import SaveHandler from "./misc/save_handler.js";
import MSSQL from "./misc/mssql.js";
import Locals from "./misc/localls.js";

let Links = [
    "https://shopredspirits.com/shop?category=all_spirits&category=all_exclud_sale_newarrivals&title=Explore",
    "https://shopredspirits.com/shop?category=wines_sake_cider&category=all_exclud_sale_newarrivals&title=Explore",
    "https://shopredspirits.com/shop?category=all_beers&category=all_exclud_sale_newarrivals&title=Explore"
]


for (const Link of Links) {

    await new win2().exec().then((payload) => {
        //save to JSON
        SaveHandler.To_JSON(payload)

        // data baseConfig
        const database = new MSSQL({
            user: Locals.User,
            password: Locals.Password,
            server: Locals.Server,
            database: Locals.DataBase,
            options: {
                encrypt: true
            }
        });
        database.insertData(Locals.TableName, [])
    })
} 