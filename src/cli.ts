import config from "../config/config.json";
import { IOHelper } from "./tools/IOHelper";
import { createMemory } from "./vm/memory";
import { CPU } from "./vm/cpu";
import { Instructions } from "./vm/instructions/instructions.enum";
import { Registers } from "./vm/registers";
import * as readline from "readline";
import { stdin, stdout } from "process";
import { MemoryMapper } from "./vm/devices/memoryMapper";
import { IMemoryMappedDevice } from "./vm/devices/memoryMappedDevice.interface";
import { MemoryScreen, ScreenCommands } from "./vm/devices/screen";

export class CLI {
    ioHelper: IOHelper;
    readline: readline.Interface;
    memory: DataView;
    writableStream: Uint8Array;
    memoryOffset: number;
    screenStartAddr: number;
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

        // create memory mapper
        const memoryMapper = new MemoryMapper();
        memoryMapper.setByteLength(this.memory.byteLength);
        // set writable region
        memoryMapper.map(this.memory as IMemoryMappedDevice, 0x0000, 0xffff);
        // create screen
        const screen = new MemoryScreen(16, 16);
        const screenStartAdd = 0x4000;
        this.screenStartAddr = 0x4000;
        memoryMapper.map(screen, screenStartAdd, screenStartAdd + screen.width * screen.height, true);
        // create CPU
        this.cpu = new CPU(memoryMapper);
    }

    async run() {
        // update this method with main cli functionality

        // add instructions
        // this.testStack();
        // this.testCountTill3();

        this.writeScreen();
        


        this.cpu.run();

        
        // this.cpu.debug();
        // this.cpu.viewMemoryAt(this.cpu.getRegister(Registers.IP));

        // this.readline.on("line", () => {
        //     this.cpu.step();
        //     this.cpu.debug();
        //     this.cpu.viewMemoryAt(this.cpu.getRegister(Registers.IP));
        // });
    }

    writeScreen() {
        // write hello world
        const writeCharToScreen = (char, command, position) => {
            this.addInstructionToMemory(Instructions.MOV_LIT_REG, command, char.charCodeAt(0), Registers.R1);
            this.addInstructionToMemory(Instructions.MOV_REG_MEM, Registers.R1, (this.screenStartAddr & 0xff00) >> 8, position);
        };

        // clear screen
        writeCharToScreen(' ', ScreenCommands.Clear, 0);

        const message = "hello binary!";
        for(let i = 0; i < message.length; i++){
            writeCharToScreen(message[i], ScreenCommands.None, i);
        }
        
        this.addInstructionToMemory(Instructions.HALT);
    }

    testStack() {
        const subrouteAddr = 0x3000;

        // push value 0x3333, 0x2222, 0x1111 to stack
        this.addInstructionToMemory(Instructions.PSH_LIT, 0x33, 0x33);
        this.addInstructionToMemory(Instructions.PSH_LIT, 0x22, 0x22);
        this.addInstructionToMemory(Instructions.PSH_LIT, 0x11, 0x11);

        // move values to registers
        this.addInstructionToMemory(Instructions.MOV_LIT_REG, 0x12, 0x34, Registers.R1);
        this.addInstructionToMemory(Instructions.MOV_LIT_REG, 0x56, 0x78, Registers.R4);

        // push number of arguments on stack
        this.addInstructionToMemory(Instructions.PSH_LIT, 0x00, 0x00);

        // call subroutine
        this.addInstructionToMemory(Instructions.CAL_LIT, ((subrouteAddr & 0xff00) >> 8), (subrouteAddr & 0x00ff));

        // push more values to stack after subroutine is finished executing
        this.addInstructionToMemory(Instructions.PSH_LIT, 0x44, 0x44);

        // define subroutine

        // set subroutine address
        this.memoryOffset = subrouteAddr;

        this.addInstructionToMemory(Instructions.PSH_LIT, 0x01, 0x02);
        this.addInstructionToMemory(Instructions.PSH_LIT, 0x03, 0x04);
        this.addInstructionToMemory(Instructions.PSH_LIT, 0x05, 0x06);

        this.addInstructionToMemory(Instructions.MOV_LIT_REG, 0x07, 0x08, Registers.R1);
        this.addInstructionToMemory(Instructions.MOV_LIT_REG, 0x09, 0x0A, Registers.R8);

        this.addInstructionToMemory(Instructions.RET);

    }

    testCountTill3(){
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

        this.addInstructionToMemory(Instructions.HALT);
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
