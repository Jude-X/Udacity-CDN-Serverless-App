import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { cors } from 'middy/middlewares'
import * as middy from 'middy'

import { deleteTodo } from '../../businessLogic/todos'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('Delete Todo Handler')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event', { event })

    const todoId = event.pathParameters.todoId as string
    const userId = getUserId(event)

    try {
      await deleteTodo(todoId, userId)
      return {
        statusCode: 204,
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
