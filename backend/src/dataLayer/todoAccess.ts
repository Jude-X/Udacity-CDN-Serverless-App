import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

import { createLogger } from '../utils/logger'

import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'

const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('todosDataAccess')

export class TodoAccess {
  constructor(
    private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
    private readonly todoTable: string = process.env.TABLE_NAME
  ) {}

  async getTodos(userId: string): Promise<TodoItem[]> {
    logger.info(`Getting all todos`)

    const result = await this.docClient
      .query({
        TableName: this.todoTable,
        KeyConditionExpression: '#userId = :i',
        ExpressionAttributeNames: {
          '#userId': 'userId'
        },
        ExpressionAttributeValues: {
          ':i': userId
        }
      })
      .promise()

    const todos = result.Items as TodoItem[]
    return todos
  }

  async createTodo(todo: TodoItem): Promise<TodoItem> {
    logger.info(`Creating a todo with id ${todo.todoId}`)

    await this.docClient
      .put({
        TableName: this.todoTable,
        Item: todo
      })
      .promise()

    return todo
  }

  async updateTodo(
    todoId: string,
    userId: string,
    updatedTodo: TodoUpdate
  ): Promise<void> {
    logger.info(`Updating a todo with id ${todoId}`)

    await this.docClient
      .update({
        TableName: this.todoTable,
        Key: {
          todoId: todoId,
          userId: userId
        },
        ExpressionAttributeNames: {
          '#todo_name': 'name'
        },
        UpdateExpression:
          'set #todo_name = :name, done = :done, dueDate = :dueDate',
        ExpressionAttributeValues: {
          ':name': updatedTodo.name,
          ':done': updatedTodo.done,
          ':dueDate': updatedTodo.dueDate
        }
      })
      .promise()

    logger.info(`Updated todo successfully`)
  }

  async deleteTodo(todoId: string, userId: string): Promise<void> {
    logger.info(`Deleting a todo with id${todoId}`)

    await this.docClient
      .delete({
        TableName: this.todoTable,
        Key: {
          todoId: todoId,
          userId: userId
        }
      })
      .promise()

    logger.info(`Deleted todo successfully`)
  }
}
