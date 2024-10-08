import request from "supertest";
import { app } from "../src";

describe("POST /api/test - Validación de Datos con Joi", () => {
  it("debería devolver 200 si los datos son válidos", async () => {
    const response = await request(app)
      .post("/api/test")
      .send({ name: "John", age: 30 });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ msg: "Datos válidos" });
  });

  it("debería devolver 400 si el nombre está ausente", async () => {
    const response = await request(app)
      .post("/api/test")
      .send({ age: 30 });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ msg: "Formato inválido" });
  });

  it("debería devolver 400 si la edad es negativa", async () => {
    const response = await request(app)
      .post("/api/test")
      .send({ name: "John", age: -5 });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ msg: "Formato inválido" });
  });

  it("debería devolver 400 si los datos están vacíos", async () => {
    const response = await request(app)
      .post("/api/test")
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ msg: "Formato inválido" });
  });
});