import request from "supertest";
import { createApp } from "../../app";

const app = createApp();

describe("Task API", () => {
  let createdTaskId: string;

  describe("POST /tasks", () => {
    it("should create a new task", async () => {
      const response = await request(app)
        .post("/tasks")
        .send({
          title: "Integration Test Task",
          description: "Testing the API",
        });

      expect(response.status).toBe(201);
      expect(response.body.title).toBe("Integration Test Task");
      expect(response.body.status).toBe("pending");
      expect(response.body.id).toBeDefined();

      createdTaskId = response.body.id;
    });

    it("should return 400 for invalid data", async () => {
      const response = await request(app)
        .post("/tasks")
        .send({
          title: "",
          description: "Missing title",
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("ValidationError");
    });
  });

  describe("GET /tasks", () => {
    it("should return all tasks", async () => {
      const response = await request(app).get("/tasks");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("GET /tasks/:id", () => {
    it("should return a task by id", async () => {
      const response = await request(app).get(`/tasks/${createdTaskId}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(createdTaskId);
    });

    it("should return 404 for non-existent task", async () => {
      const response = await request(app).get("/tasks/non-existent-id");

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("TaskNotFoundError");
    });
  });

  describe("PUT /tasks/:id", () => {
    it("should update a task", async () => {
      const response = await request(app)
        .put(`/tasks/${createdTaskId}`)
        .send({
          title: "Updated Title",
        });

      expect(response.status).toBe(200);
      expect(response.body.title).toBe("Updated Title");
    });
  });

  describe("GET /tasks/stats", () => {
    it("should return task statistics", async () => {
      const response = await request(app).get("/tasks/stats");

      expect(response.status).toBe(200);
      expect(response.body.total).toBeDefined();
      expect(response.body.byStatus).toBeDefined();
      expect(response.body.byPriority).toBeDefined();
      expect(response.body.overdue).toBeDefined();
    });
  });

  describe("DELETE /tasks/:id", () => {
    it("should delete a task", async () => {
      const response = await request(app).delete(`/tasks/${createdTaskId}`);

      expect(response.status).toBe(204);
    });
  });
});