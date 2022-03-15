import { IMemoryMappedDevice } from "./memoryMappedDevice.interface";

export enum ScreenCommands {
    Clear = 0xff,
    None = 0x00,
    Bold = 0x01,
    Regular = 0x02
}

export class MemoryScreen implements IMemoryMappedDevice {

    width: number;
    height: number;

    constructor(width: number, height: number){
        this.width = width;
        this.height = height;
    }

    // screen doesn't need get method, so returning just 0

    getUint16(address: number): number {
        return 0;
    }

    getUint8(address: number): number {
        return 0;
    }

    setUint16(address: number, value: number): void {
        const command = (value & 0xff00) >> 8;
        const val8Bit = value & 0x00ff;

        // exec command
        this.execCommand(command);

        this.setUint8(address, val8Bit);
    }

    setUint8(address: number, value: number): void {
        const x = (address % 16) + 1;
        const y = Math.floor(address / 16) + 1;

        this.moveTo(x, y);

        const character = String.fromCharCode(value);
        process.stdout.write(character);
    }

    private execCommand(command: ScreenCommands){
        switch(command){
            case ScreenCommands.Clear: {
                this.clear();
                return;
            }

            case ScreenCommands.Bold: {
                this.setBold();
                return;
            }

            case ScreenCommands.Regular: {
                this.setRegular();
                return;
            }
        }
    }

    private clear(){
        process.stdout.write('\x1b[2J');
    }

    private setBold(){
        process.stdout.write('\x1b[1m');
    }

    private setRegular(){
        process.stdout.write('\x1b[0m');
    }

    // move cursor to specified position on screen
    private moveTo(x: number, y: number){
        // multiply x by 2 because on terminal screens height is usually double the width,
        x *= 2;
        process.stdout.write(`\x1b[${y};${x}H`);
    }

}