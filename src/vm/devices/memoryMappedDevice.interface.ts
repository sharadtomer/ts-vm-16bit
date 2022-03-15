export interface IMemoryMappedDevice {
    // get 16 bit value
    getUint16(address: number): number;
    // get 8 bit value
    getUint8(address: number): number;
    // set 16 bit value
    setUint16(address: number, value: number): void;
    // set 8 bit value
    setUint8(address: number, value: number): void;
}
