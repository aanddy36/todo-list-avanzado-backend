"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* const fs = require("fs") */
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const PORT = 5000;
app.get("/ping", (_, res) => {
    res.send("pong");
});
app.listen(PORT, () => {
    console.log("Esta activo");
});

