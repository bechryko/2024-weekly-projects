main: main.c
	gcc -o main.exe main.c conditions.c translation.c

run: main
	./main.exe

run hu: main
	./main.exe --language 0

clean:
	del main.exe
