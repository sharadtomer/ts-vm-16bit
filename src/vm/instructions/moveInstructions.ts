import { CPU } from "../cpu";
import { Registers } from "../registers";

// move literal to register
export function execute_MOV_LIT_REG(cpu: CPU){
    const literal = cpu.fetch16();
    const register = cpu.fetch() as Registers;
    cpu.setRegister(register, literal);
}

// move register to reister
export function execute_MOV_REG_REG(cpu: CPU){
    const registerFrom = cpu.fetch() as Registers;
    const registerTo = cpu.fetch() as Registers;
    cpu.setRegister(registerTo, cpu.getRegister(registerFrom));
}

// move register to memory
export function execute_MOV_REG_MEM(cpu: CPU){
    const registerFrom = cpu.fetch() as Registers;
    const memory = cpu.fetch16();
    cpu.memory.setUint16(memory, cpu.getRegister(registerFrom));
}

// move memory to register
export function execute_MOV_MEM_REG(cpu: CPU){
    const memory = cpu.fetch16();
    const registerTo = cpu.fetch() as Registers;
    cpu.setRegister(registerTo, cpu.memory.getUint16(memory));
}
