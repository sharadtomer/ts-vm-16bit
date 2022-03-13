export function createMemory(byteSize: number){
    const memory = new ArrayBuffer(byteSize);
    const view = new DataView(memory);

    return view;
}
