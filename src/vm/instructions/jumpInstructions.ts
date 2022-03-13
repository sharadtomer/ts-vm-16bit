import { CPU } from "../cpu";
import { Registers } from "../registers";

// jump if value not equals to accumulator value
export function execute_JMP_NOT_EQ(cpu: CPU) {
    const value = cpu.fetch16();
    const address = cpu.fetch16();

    if (value !== cpu.getRegister(Registers.ACC)) {
        cpu.setRegister(Registers.IP, address);
    }

}
