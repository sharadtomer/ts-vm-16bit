import { IMemoryMappedDevice } from "./memoryMappedDevice.interface";

export interface IMemoryRegion {
    device: IMemoryMappedDevice;
    start: number;
    end: number;
    remap: boolean; 
}

export class MemoryMapper {

    regions: IMemoryRegion[];
    byteLength: number;

    constructor(){
        this.regions = [];
    }

    setByteLength(val: number){
        this.byteLength = val;
    }

    map(device, start: number, end: number, remap: boolean = true): () => void {
        const region = {
            device,
            start,
            end,
            remap
        };

        this.regions.unshift(region);

        return () => {
            this.regions = this.regions.filter(reg => reg !== region);
        }
    }

    findRegion(address: number){
        const region = this.regions.find(reg => address >= reg.start && address <= reg.end);
        if(!region){
            throw new Error(`No memory region found for address ${address}`);
        }

        return region;
    }

    getUint16(address: number){
        const region = this.findRegion(address);

        const finalAddress = region.remap ? address - region.start: address;
        return region.device.getUint16(finalAddress);
    }

    getUint8(address: number){
        const region = this.findRegion(address);

        const finalAddress = region.remap ? address - region.start: address;
        return region.device.getUint8(finalAddress);
    }

    setUint8(address: number, value: number){
        const region = this.findRegion(address);

        const finalAddress = region.remap ? address - region.start: address;
        return region.device.setUint8(finalAddress, value);
    }

    setUint16(address: number, value: number){
        const region = this.findRegion(address);

        const finalAddress = region.remap ? address - region.start: address;
        return region.device.setUint16(finalAddress, value);
    }
}
