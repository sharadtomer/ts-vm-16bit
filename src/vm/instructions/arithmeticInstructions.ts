import { CPU } from "../cpu";
import { Registers } from "../registers";

// move register to reister
export function execute_ADD_REG_REG(cpu: CPU){
    const register1 = cpu.fetch() as Registers;
    const register2 = cpu.fetch() as Registers;
    cpu.setRegister(Registers.ACC, cpu.getRegister(register1) + cpu.getRegister(register2));
}
