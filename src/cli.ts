import config from "../config/config.json";
import { IOHelper } from "./tools/IOHelper";
import * as path from "path";
import { createMemory } from "./vm/memory";
import { CPU } from "./vm/cpu";
import { Instructions } from "./vm/instructions";

export class CLI {

    ioHelper: IOHelper;
    
    constructor() {
        this.ioHelper = new IOHelper();
    }

    async run(){
        // update this method with main cli functionality
        
        // create memory
        const memory = createMemory(256);
        const writableBytes = new Uint8Array(memory.buffer);

        const cpu = new CPU(memory);
        

        // move value to r1
        writableBytes[0] = Instructions.MOV_LIT_R1;
        writableBytes[1] = 0x12; //0x1234
        writableBytes[2] = 0x34;

        // move value to r2
        writableBytes[3] = Instructions.MOV_LIT_R2;
        writableBytes[4] = 0xAB; //0xABCD
        writableBytes[5] = 0xCD;

        // add register1 and register2
        writableBytes[6] = Instructions.ADD_REG_REG;
        writableBytes[7] = 2; // r1 index
        writableBytes[8] = 3; // r2 index

        cpu.debug();

        cpu.step();
        cpu.debug();

        cpu.step();
        cpu.debug();

        cpu.step();
        cpu.debug();

    }

    

}
