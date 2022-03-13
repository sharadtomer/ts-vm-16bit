import { execute_ADD_REG_REG } from "./instructions/arithmeticInstructions";
import { Instructions } from "./instructions/instructions.enum";
import { execute_JMP_NOT_EQ } from "./instructions/jumpInstructions";
import { execute_MOV_LIT_REG, execute_MOV_MEM_REG, execute_MOV_REG_MEM } from "./instructions/moveInstructions";
import { createMemory } from "./memory";
import { Registers } from "./registers";
export class CPU {
    memory: DataView;
    registersMemory: DataView;

    constructor(memory: DataView) {
        this.memory = memory;
        this._init();
    }

    // init cpu, assign registers and define instructions
    private _init() {
        const registerNamesArr = Object.keys(Registers).filter(key => Number.isNaN(parseInt(key)));
        // create registers memory
        this.registersMemory = createMemory(registerNamesArr.length * 2);
    }

    // logs the current state of registers
    debug() {
        const registerNamesArr = Object.keys(Registers).filter(key => Number.isNaN(parseInt(key)));
        
        registerNamesArr.forEach((name) => {
            console.log(
                `${name}: 0x${this.getRegister(Registers[name]).toString(16).padStart(4, "0")}`
            );
        });
        console.log("");
    }

    viewMemoryAt(add: number){
        const next8Bytes = Array.from({length: 8}, (_, i) => {
            return this.memory.getUint8(add + i);
        }).map(val => `0x${val.toString(16).padStart(2, "0")}`);

        console.log(`0x${add.toString(16).padStart(4, "0")}: ${next8Bytes.join(" ")}`);
    }

    // get value of register by name
    getRegister(register: Registers) {
        if (register >= this.registersMemory.byteLength) {
            throw new Error(
                `getRegister: register index exceeds available registers count '${register}'`
            );
        }

        return this.registersMemory.getUint16(register);
    }

    // set register value
    setRegister(register: Registers, value: number) {
        if (register >= this.registersMemory.byteLength) {
            throw new Error(
                `setRegister: register index exceeds available registers count '${register}'`
            );
        }

        return this.registersMemory.setUint16(register, value);
    }

    // get the next value byte from memory
    fetch() {
        const nextInstructionAddr = this.getRegister(Registers.IP);
        const instruction = this.memory.getUint8(nextInstructionAddr);
        // update instruction pointer
        this.setRegister(Registers.IP, nextInstructionAddr + 1);
        return instruction;
    }

    // get the next 16 bit value from memory
    fetch16() {
        const nextInstructionAddr = this.getRegister(Registers.IP);
        const instruction = this.memory.getUint16(nextInstructionAddr);
        // update instruction pointer
        this.setRegister(Registers.IP, nextInstructionAddr + 2);
        return instruction;
    }

    // execute an instruction
    execute(instruction) {
        switch (instruction) {
            // move literal to register
            case Instructions.MOV_LIT_REG: {
                execute_MOV_LIT_REG(this);
                return;
            }

            // move reg to memry
            case Instructions.MOV_REG_MEM: {
                execute_MOV_REG_MEM(this);
                return;
            }

            // move memory to reg
            case Instructions.MOV_MEM_REG: {
                execute_MOV_MEM_REG(this);
                return;
            }

            // add register value to another register value
            case Instructions.ADD_REG_REG: {
                execute_ADD_REG_REG(this);
                return;
            }

            // jump to add if value not equal to acc value
            case Instructions.JMP_NOT_EQ: {
                execute_JMP_NOT_EQ(this);
                return;
            }
        }
    }

    // fetch and execute next instruction
    step() {
        const instruction = this.fetch();
        return this.execute(instruction);
    }
}
