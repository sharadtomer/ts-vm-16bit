
export enum Instructions {

    // move instructions
    MOV_LIT_REG = 0x10,
    MOV_REG_REG = 0x11,
    MOV_REG_MEM = 0x12,
    MOV_MEM_REG = 0x13,

    // arithmetic instructions
    ADD_REG_REG = 0x14,

    // branching instructions
    JMP_NOT_EQ = 0x15
}

