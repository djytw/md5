
CC = emcc

all:
	$(CC) $(CFLAGS) md5.c -o md5.wasm -sEXPORTED_FUNCTIONS="[_MD5_Init,_MD5_Update,_MD5_Final,_malloc,_free]" \
		-sSTANDALONE_WASM -sALLOW_MEMORY_GROWTH=1 -sTOTAL_MEMORY=32MB -Os --no-entry
	base64 -w0 md5.wasm > md5.wasm.base64
	echo "export const md5wasm=\""`cat md5.wasm.base64`"\"" > md5.wasm.mjs
	npx rollup -c

clean:
	rm -f md5.wasm* md5.min*

