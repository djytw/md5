import { md5wasm } from './md5.wasm.mjs';

export class MD5 {
    static native = null;
    static async load() {
        if (MD5.native !== null) {
            return MD5.native;
        } else {
            const wasm = await WebAssembly.instantiate(Uint8Array.from(atob(md5wasm), i=>i.charCodeAt(0)), {
                js: {mem: new WebAssembly.Memory({initial: 1024, maximum: 65535})},
                env: {emscripten_notify_memory_growth:()=>{}}
            });
            MD5.native = wasm.instance.exports;
            if (!MD5.native) {
                throw 'load error';
            }
            return MD5.native;
        }
    }

    static async malloc(size) {
        const native = await MD5.load();
        const ctx = await native.malloc(size);
        if (ctx === 0) {
            throw "malloc failed";
        }
        return ctx;
    }

    static async md5(data) {
        const native = await MD5.load();
        const ctx = await MD5.malloc(152); // MD5_CTX_size
        await native.MD5_Init(ctx);
        const dataptr = await MD5.malloc(data.byteLength);
        let buffer = new Uint8Array(native.memory.buffer);
        buffer.set(data, dataptr);
        await native.MD5_Update(ctx, dataptr, data.byteLength);
        const result = await MD5.malloc(16);
        await native.MD5_Final(result, ctx);
        buffer = new Uint8Array(native.memory.buffer);
        const retdata = buffer.slice(result, result + 16);
        await native.free(ctx);
        await native.free(dataptr);
        await native.free(result);
        return new Uint8Array(retdata);
    }
}
