import config from "../config/config.json";
import { IOHelper } from "./tools/IOHelper";
import { createMemory } from "./vm/memory";
import { CPU } from "./vm/cpu";
import { Instructions } from "./vm/instructions/instructions.enum";
import { Registers } from "./vm/registers";
import * as readline from "readline";
import { stdin, stdout } from "process";
import { threadId } from "worker_threads";

export class CLI {
    ioHelper: IOHelper;
    readline: readline.Interface;
    memory: DataView;
    writableStream: Uint8Array;
    memoryOffset: number;
    cpu: CPU;

    constructor() {
        this.ioHelper = new IOHelper();
        this.readline = readline.createInterface({
            input: stdin,
            output: stdout,
        });

        this._init();
    }

    _init() {
        this.memory = createMemory(256*256);
        this.writableStream = new Uint8Array(this.memory.buffer);
        this.memoryOffset = 0;

        this.cpu = new CPU(this.memory);
    }

    async run() {
        // update this method with main cli functionality

        // add instructions

        // move value to r1
        this.addInstructionToMemory(Instructions.MOV_MEM_REG, 0x01, 0x00, Registers.R1);

        // move value to r2
        this.addInstructionToMemory(Instructions.MOV_LIT_REG, 0x00, 0x01, Registers.R2);

        // add register1 and register2
        this.addInstructionToMemory(Instructions.ADD_REG_REG, Registers.R1, Registers.R2);

        // mov register to memory
        this.addInstructionToMemory(Instructions.MOV_REG_MEM, Registers.ACC, 0x01, 0x00);

        // jump to start if not equals to 3
        this.addInstructionToMemory(Instructions.JMP_NOT_EQ, 0x00, 0x03, 0x00, 0x00);

        this.cpu.debug();
        this.cpu.viewMemoryAt(this.cpu.getRegister(Registers.IP));
        this.cpu.viewMemoryAt(0x0100);

        this.readline.on("line", () => {
            this.cpu.step();
            this.cpu.debug();
            this.cpu.viewMemoryAt(this.cpu.getRegister(Registers.IP));
            this.cpu.viewMemoryAt(0x0100);
        });
    }

    addInstructionToMemory(...instructionBytes) {
        instructionBytes.forEach((byte) => {
            this.writableStream[this.memoryOffset] = byte;
            this.memoryOffset++;
        });
    }

    resetMemoryOffSet() {
        this.memoryOffset = 0;
    }
}
