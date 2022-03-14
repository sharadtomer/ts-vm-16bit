
export enum Instructions {

    // move instructions
    MOV_LIT_REG = 0x10,
    MOV_REG_REG = 0x11,
    MOV_REG_MEM = 0x12,
    MOV_MEM_REG = 0x13,

    // arithmetic instructions
    ADD_REG_REG = 0x14,

    // branching instructions
    JMP_NOT_EQ = 0x15,

    // stack operations
    PSH_LIT = 0x17,
    PSH_REG = 0x18,
    POP = 0x1A,

    // subroutines
    CAL_LIT = 0x5E,
    CAL_REG = 0x5F,
    RET = 0x60

}

