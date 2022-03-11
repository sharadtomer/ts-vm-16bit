import config from "../config/config.json";
import { IOHelper } from "./tools/IOHelper";
import * as path from "path";

export class CLI {

    ioHelper: IOHelper;
    inputLocation: string;
    outputLocation: string;
    
    constructor() {
        this.ioHelper = new IOHelper();
        this.inputLocation = path.resolve(__dirname, "..", config.src || "input");
        this.outputLocation = path.resolve(__dirname, "..", config.out || "output");
    }

    async run(){
        // update this method with main cli functionality
        
    }

    

}
