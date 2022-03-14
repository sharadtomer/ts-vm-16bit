// gap of two because each register is 2 byte

export const REGISTERS_COUNT = 12;

export enum Registers {
    IP = 0,
    ACC = 2,
    R1 = 4,
    R2 = 6,
    R3 = 8,
    R4 = 10,
    R5 = 12,
    R6 = 14,
    R7 = 16,
    R8 = 18,
    SP = 20,
    FP = 22
}
