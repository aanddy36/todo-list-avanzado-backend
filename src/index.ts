import express from "express";
import http from "http";
import { Server as SocketServer } from "socket.io";
import users from "./users/routes";
import tasks from "./tasks/routes";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./db/sequelize";
import { validateRequest } from "./middleware/validateRequest";
import Joi from "joi";

dotenv.config();
const app = express();

const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.use("/users", users);
app.use("/tasks", tasks);

const PORT = process.env.PORT || 5000;

app.get("/", (_, res) => {
  res.send("hola");
});

const schema = Joi.object({
  name: Joi.string().required(),
  age: Joi.number().integer().min(0).required(),
});

app.post("/api/test", validateRequest(schema), (_, res) => {
  res.status(200).json({ msg: "Datos válidos" });
});

io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

export { io, app };

const startServer = async () => {
  try {
    await sequelize.sync();

    server.listen(PORT, () => {
      /* console.log(`El servidor corre en el puerto ${PORT}`); */
    });
  } catch (error) {
    console.error("No se pudo conectar:", error);
  }
};

startServer();

/*
-app.get('/tasks')                      -Get the tasks of all the users   
-app.get('/tasks/:userId')              -Get the tasks of the user ___    
-app.post('/tasks')                     -Create a task
-app.patch('/tasks/:taskId')            -Edit the task of id ___
-app.delete('/tasks/:taskId')           -Delete the task of id ___

-app.post('/users/login')                 -Login user
-app.post('/users/register')             -Register user  

 */
