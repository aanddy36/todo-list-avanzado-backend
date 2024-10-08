import { getAllTasksService, getTasksOfUserService, createTaskService, editTaskService, deleteTaskService } from "../../src/tasks/services";
import Task from "../../src/tasks/models";
import User from "../../src/users/models";

// Mock de los modelos
jest.mock("../../src/tasks/models", () => {
  const actualTask = jest.requireActual("../../src/tasks/models");
  return {
    __esModule: true,
    ...actualTask,
    belongsTo: jest.fn(),
    hasMany: jest.fn(),
    findAll: jest.fn(),
    count: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
  };
});

jest.mock("../../src/users/models", () => {
  const actualUser = jest.requireActual("../../src/users/models");
  return {
    __esModule: true,
    ...actualUser,
    findByPk: jest.fn(),
  };
})

describe("Task Services", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllTasksService', () => {
    it('should return tasks with pagination and user email included', async () => {
      const mockTasks = [
        { id: 1, name: 'Task 1', completed: false, userId: 1, user: { email: 'user1@example.com' } },
        { id: 2, name: 'Task 2', completed: false, userId: 1, user: { email: 'user1@example.com' } },
      ];
  
      Task.findAll = jest.fn().mockResolvedValue(mockTasks);
      Task.count = jest.fn().mockResolvedValue(2);
  
      const result = await getAllTasksService(1);
  
      expect(Task.findAll).toHaveBeenCalledWith({
        where: {},
        limit: 5,
        offset: 0,
        order: [['createdAt', 'DESC']],
        include: [{ model: User, attributes: ['email'], as: 'user' }],
      });
  
      expect(result.tasks).toEqual(mockTasks);
      expect(result.totalTasks).toBe(2);
    });
  
    it('should filter tasks by completed status', async () => {
      const mockTasks = [
        { id: 1, name: 'Task 1', completed: false, userId: 1, user: { email: 'user1@example.com' } },
      ];
    
      Task.findAll = jest.fn().mockResolvedValue(mockTasks);
      Task.count = jest.fn().mockResolvedValue(1);
    
      // Llamada al servicio con el valor 'false' para filtrar por tareas no completadas
      const result = await getAllTasksService(1, false);
    
      expect(Task.findAll).toHaveBeenCalledWith({
        where: { completed: false }, // Verificación del filtro aplicado correctamente
        limit: 5,
        offset: 0,
        order: [['createdAt', 'DESC']],
        include: [{ model: User, attributes: ['email'], as: 'user' }],
      });
    
      expect(result.tasks).toEqual(mockTasks);
      expect(result.totalTasks).toBe(1);
    });
  });

  describe('getTasksOfUserService', () => {
    it('should return tasks for a given user', async () => {
      const mockUser = { id: 1, email: 'user1@example.com' };
      const mockTasks = [{ id: 1, name: 'Task 1', userId: 1 }];
  
      User.findByPk = jest.fn().mockResolvedValue(mockUser);
      Task.findAll = jest.fn().mockResolvedValue(mockTasks);
  
      const result = await getTasksOfUserService('1');
  
      expect(User.findByPk).toHaveBeenCalledWith('1');
      expect(Task.findAll).toHaveBeenCalledWith({
        where: { userId: '1' },
        order: [['createdAt', 'DESC']],
        include: [{ model: User, attributes: ['email'], as: 'user' }],
      });
      expect(result).toEqual(mockTasks);
    });
  
    it('should throw an error if user does not exist', async () => {
      User.findByPk = jest.fn().mockResolvedValue(null);
  
      await expect(getTasksOfUserService('1')).rejects.toThrow('El usuario no existe');
    });
  });

  describe('createTaskService', () => {
    it('should create a task for a user', async () => {
      const mockUser = { id: 1, email: 'user1@example.com' };
      const mockTask = { id: 1, name: 'New Task', userId: 1 };
      const mockTaskWithUser = { ...mockTask, user: { email: 'user1@example.com' } };
  
      User.findByPk = jest.fn().mockResolvedValue(mockUser);
      Task.create = jest.fn().mockResolvedValue(mockTask);
      Task.findByPk = jest.fn().mockResolvedValue(mockTaskWithUser);
  
      const result = await createTaskService('1', 'New Task');
  
      expect(User.findByPk).toHaveBeenCalledWith('1');
      expect(Task.create).toHaveBeenCalledWith({ name: 'New Task', userId: '1' });
      expect(Task.findByPk).toHaveBeenCalledWith(mockTask.id, {
        include: [{ model: User, attributes: ['email'], as: 'user' }],
      });
      expect(result).toEqual(mockTaskWithUser);
    });
  
    it('should throw an error if user does not exist', async () => {
      User.findByPk = jest.fn().mockResolvedValue(null);
  
      await expect(createTaskService('1', 'New Task')).rejects.toThrow('El usuario no existe');
    });
  });

  describe('editTaskService', () => {
    it('should update the task', async () => {
      const mockTask = { id: 1, name: 'Task 1', completed: false, update: jest.fn() };
      
      Task.findByPk = jest.fn().mockResolvedValue(mockTask);
  
      const updates = { name: 'Updated Task', completed: true };
      await editTaskService('1', updates);
  
      expect(Task.findByPk).toHaveBeenCalledWith('1', {
        include: [{ model: User, attributes: ['email'], as: 'user' }],
      });
      expect(mockTask.update).toHaveBeenCalledWith(updates);
    });
  
    it('should throw an error if task does not exist', async () => {
      Task.findByPk = jest.fn().mockResolvedValue(null);
  
      await expect(editTaskService('1', { name: 'Updated Task' })).rejects.toThrow('No existe esta tarea');
    });
  });

  describe('deleteTaskService', () => {
    it('should delete the task and return its id', async () => {
      const mockTask = { id: 1, name: 'Task 1', destroy: jest.fn() };
  
      Task.findByPk = jest.fn().mockResolvedValue(mockTask);
  
      const result = await deleteTaskService('1');
  
      expect(Task.findByPk).toHaveBeenCalledWith('1', {
        include: [{ model: User, attributes: ['email'], as: 'user' }],
      });
      expect(mockTask.destroy).toHaveBeenCalled();
      expect(result).toBe(mockTask.id);
    });
  
    it('should throw an error if task does not exist', async () => {
      Task.findByPk = jest.fn().mockResolvedValue(null);
  
      await expect(deleteTaskService('1')).rejects.toThrow('No se encontró la tarea');
    });
  });
});
