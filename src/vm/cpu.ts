import { Instructions } from "./instructions";
import { createMemory } from "./memory";
import { RegisterNames } from "./registers";

export class CPU {

    memory: DataView;
    registers: DataView;
    registersMap: {[key: string]: number};

    constructor(memory: DataView){
        this.memory = memory;
        this._init();
    }

    // init cpu, assign registers and define instructions
    private _init(){
        const registerNamesArr = Object.keys(RegisterNames).map(key => RegisterNames[key]);
        // create registers memory
        this.registers = createMemory(registerNamesArr.length * 2);
        // create register map of offset in the register memory
        this.registersMap = registerNamesArr.reduce((map, name, i) => {
            map[name] = i * 2;
            return map;
        },  {});
    }

    // logs the current state of registers
    debug(){
        const registerNamesArr = Object.keys(RegisterNames).map(key => RegisterNames[key]);
        registerNamesArr.forEach(name => {
            console.log(`${name}: 0x${this.getRegister(name as RegisterNames).toString(16).padStart(4, "0")}`);
        });
        console.log("");
    }

    // get value of register by name
    getRegister(name: RegisterNames){
        if(!(name in this.registersMap)){
            throw new Error(`getRegister: no such register '${name}'`);
        }

        return this.registers.getUint16(this.registersMap[name]);
    }

    // set register value
    setRegister(name: RegisterNames, value: number){
        if(!(name in this.registersMap)){
            throw new Error(`setRegister: no such register '${name}'`);
        }

        return this.registers.setUint16(this.registersMap[name], value);
    }
    
    // get the next value byte from memory
    fetch(){
        const nextInstructionAddr = this.getRegister(RegisterNames.IP);
        const instruction = this.memory.getUint8(nextInstructionAddr);
        // update instruction pointer
        this.setRegister(RegisterNames.IP, nextInstructionAddr + 1);
        return instruction;
    }

    // get the next 16 bit value from memory
    fetch16(){
        const nextInstructionAddr = this.getRegister(RegisterNames.IP);
        const instruction = this.memory.getUint16(nextInstructionAddr);
        // update instruction pointer
        this.setRegister(RegisterNames.IP, nextInstructionAddr + 2);
        return instruction;
    }

    // execute an instruction
    execute(instruction){
        switch(instruction){

            // move literal to r1
            case Instructions.MOV_LIT_R1: {
                const literal = this.fetch16();
                this.setRegister(RegisterNames.R1, literal);
                return;
            }

            // move literal to r2
            case Instructions.MOV_LIT_R2: {
                const literal = this.fetch16();
                this.setRegister(RegisterNames.R2, literal);
                return;
            }

            // add register value to another register value
            case Instructions.ADD_REG_REG: {
                const registerName1 = this.fetch();
                const registerName2 = this.fetch();

                const registerValue1 = this.registers.getUint16(registerName1 * 2);
                const registerValue2 = this.registers.getUint16(registerName2 * 2);

                this.setRegister(RegisterNames.ACC, registerValue1 + registerValue2);
                return;
            }
                
        }
    }

    // fetch and execute next instruction
    step(){
        const instruction = this.fetch();
        return this.execute(instruction);
    }
}
