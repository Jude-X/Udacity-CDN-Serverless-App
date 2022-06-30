import * as uuid from 'uuid'
import { parseUserId } from '../auth/utils'
import { FileAccess } from '../dataLayer/fileAccess'

import { TodoAccess } from '../dataLayer/todoAccess'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'

const todoAccess = new TodoAccess()
const fileAccess = new FileAccess()
const bucketName = process.env.BUCKET_NAME

export async function getTodos(userId: string): Promise<TodoItem[]> {
  return await todoAccess.getTodos(userId)
}

export async function getUrl(todoId: string): Promise<string> {
  return await fileAccess.getUploadUrl(todoId)
}

export async function createTodo(
  todoRequest: CreateTodoRequest,
  jwtToken: string
): Promise<TodoItem> {
  const todoId = uuid.v4()
  const userId = parseUserId(jwtToken)

  const todo: TodoItem = {
    ...todoRequest,
    todoId,
    userId,
    done: false,
    createdAt: new Date().toISOString(),
    attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${todoId}`
  }

  return await todoAccess.createTodo(todo)
}

export async function deleteTodo(
  todoId: string,
  userId: string
): Promise<void> {
  return await todoAccess.deleteTodo(todoId, userId)
}

export async function updateTodo(
  todoId: string,
  userId: string,
  updatedTodo: TodoUpdate
): Promise<void> {
  return await todoAccess.updateTodo(todoId, userId, updatedTodo)
}
