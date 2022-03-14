import { CPU } from "../cpu";
import { Registers } from "../registers";

export function execute_PSH_LIT(cpu: CPU){
    const value = cpu.fetch16();
    cpu.stack.push(value);
}

export function execute_PSH_REG(cpu: CPU){
    const regIndex = this.fetch();
    cpu.stack.push(cpu.getRegister(regIndex));
}

export function execute_POP(cpu: CPU){
    const regIndex = this.fetch();
    cpu.setRegister(regIndex, cpu.stack.pop());
}

export class Stack {

    private cpu: CPU;
    private stackFrameSize: number;

    constructor(cpu: CPU) {
        this.cpu = cpu;
        this.stackFrameSize = 0;

        // init stack pointer and frame pointer
        this.cpu.setRegister(Registers.SP, this.cpu.memory.byteLength - 1 - 1);
        this.cpu.setRegister(Registers.FP, this.cpu.memory.byteLength - 1 - 1);
    }

    push(value){
        const spAddress = this.cpu.getRegister(Registers.SP);
        this.cpu.memory.setUint16(spAddress, value);
        this.cpu.setRegister(Registers.SP, spAddress - 2);
        this.stackFrameSize += 2;
    }

    pop(){
        const nextSpAddress = this.cpu.getRegister(Registers.SP) + 2;
        this.cpu.setRegister(Registers.SP, nextSpAddress);
        this.stackFrameSize -= 2;
        return this.cpu.memory.getUint16(nextSpAddress);
    }

    pushState(){
        this.push(this.cpu.getRegister(Registers.R1));
        this.push(this.cpu.getRegister(Registers.R2));
        this.push(this.cpu.getRegister(Registers.R3));
        this.push(this.cpu.getRegister(Registers.R4));
        this.push(this.cpu.getRegister(Registers.R5));
        this.push(this.cpu.getRegister(Registers.R6));
        this.push(this.cpu.getRegister(Registers.R7));
        this.push(this.cpu.getRegister(Registers.R8));
        this.push(this.cpu.getRegister(Registers.IP));
        this.push(this.stackFrameSize + 2); // +2 also include the stackframe size bytes

        this.cpu.setRegister(Registers.FP, this.cpu.getRegister(Registers.SP));
        this.stackFrameSize = 0;
    }

    popState(){
        const fpAddresss = this.cpu.getRegister(Registers.FP);
        this.cpu.setRegister(Registers.SP, fpAddresss);

        this.stackFrameSize = this.pop();
        const stackFrameSize = this.stackFrameSize;

        this.cpu.setRegister(Registers.IP, this.pop());
        this.cpu.setRegister(Registers.R8, this.pop());
        this.cpu.setRegister(Registers.R7, this.pop());
        this.cpu.setRegister(Registers.R6, this.pop());
        this.cpu.setRegister(Registers.R5, this.pop());
        this.cpu.setRegister(Registers.R4, this.pop());
        this.cpu.setRegister(Registers.R3, this.pop());
        this.cpu.setRegister(Registers.R2, this.pop());
        this.cpu.setRegister(Registers.R1, this.pop());

        const nArgs = this.pop();
        for(let i = 0; i < nArgs; i++){
            this.pop();
        }

        this.cpu.setRegister(Registers.FP, fpAddresss + stackFrameSize);
    }

}
