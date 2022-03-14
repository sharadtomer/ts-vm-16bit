import { CPU } from "../cpu";
import { Registers } from "../registers";

export function execute_CAL_LIT(cpu: CPU){
    const addr = cpu.fetch16();
    cpu.stack.pushState();
    cpu.setRegister(Registers.IP, addr);
}

export function execute_CAL_REG(cpu: CPU){
    const regIndex = cpu.fetch();
    const addr = cpu.getRegister(regIndex);
    cpu.stack.pushState();
    cpu.setRegister(Registers.IP, addr);
}

export function execute_RET(cpu: CPU){
    cpu.stack.popState();
}
