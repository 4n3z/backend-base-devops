import app from "../src/server.js";
import request from "supertest";
import { configuration } from "../src/config.js";
import { esPalindromo } from "../src/palindromo.js";
import { esPrimo } from "../src/numeros.js";

describe("Test Suite App", () => {
    // Test para el endpoint raíz "/"
    test("endpoint /", async () => {
        return await request(app)
            .get("/")
            .expect("Content-Type", /text/)
            .expect(200)
            .then((response) => {
                expect(response.text).toBe(`Hola, esta api fue configurada por el usuario ${configuration.username}`);
            });
    });

    // Test para el endpoint "/key"
    test("endpoint /key", async () => {
        return await request(app)
            .get("/key")
            .expect("Content-Type", /text/)
            .expect(200)
            .then((response) => {
                expect(response.text).toBe(`Hola, esta api contiene la siguiente api-key: ${configuration.apiKey}`);
            });
    });

    // Test para el endpoint "/palindromo/:frase"
    test("endpoint /palindromo - frase es palindromo", async () => {
        return await request(app)
            .get("/palindromo/ana")
            .expect("Content-Type", /text/)
            .expect(200)
            .then((response) => {
                expect(response.text).toBe("Hola, La frase ingresada es palindromo");
            });
    });

    test("endpoint /palindromo - frase no es palindromo", async () => {
        return await request(app)
            .get("/palindromo/hola")
            .expect("Content-Type", /text/)
            .expect(200)
            .then((response) => {
                expect(response.text).toBe("Hola, La frase ingresada no es palindromo");
            });
    });

    // Test para el endpoint "/primo/:numero"
    test("endpoint /primo - numero es primo", async () => {
        return await request(app)
            .get("/primo/7")
            .expect("Content-Type", /text/)
            .expect(200)
            .then((response) => {
                expect(response.text).toBe("Hola, el numero ingresado es un numero primo");
            });
    });

    test("endpoint /primo - numero no es primo", async () => {
        return await request(app)
            .get("/primo/8")
            .expect("Content-Type", /text/)
            .expect(200)
            .then((response) => {
                expect(response.text).toBe("Hola, el numero ingresado no es un numero primo");
            });
    });

    // Tests unitarios para las funciones esPalindromo y esPrimo
    describe("Test Unitarios para esPalindromo", () => {
        test("es palindromo", () => {
            expect(esPalindromo("Ana")).toBe(true);
        });

        test("no es palindromo", () => {
            expect(esPalindromo("Hola")).toBe(false);
        });

        test("palindromo con espacios", () => {
            expect(esPalindromo("Anita lava la tina")).toBe(true);
        });
    });

    describe("Test Unitarios para esPrimo", () => {
        test("numero primo", () => {
            expect(esPrimo(7)).toBe(true);
        });

        test("numero no primo", () => {
            expect(esPrimo(8)).toBe(false);
        });

        test("numero menor a 2 no es primo", () => {
            expect(esPrimo(1)).toBe(false);
        });
    });
});