import PUP from "./components/ttt.js";
import win2 from "./components/wine2.js";
import SaveHandler from "./misc/save_handler.js";

console.log(await new win2().exec().then((payload) => {
    SaveHandler.To_JSON(payload)
}))

/* await new PUP().exec() */