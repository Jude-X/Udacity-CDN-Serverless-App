import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { cors } from 'middy/middlewares'
import * as middy from 'middy'

import { updateTodo } from '../../businessLogic/todos'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('Update Todo Handler')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event', { event })

    const todoId = event.pathParameters.todoId as string
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
    const userId = getUserId(event)

    try {
      await updateTodo(todoId, userId, updatedTodo)
      return {
        statusCode: 200,
        body: ''
      }
    } catch (error) {
      return {
        statusCode: 404,
        body: 'Error' + error.message
      }
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
