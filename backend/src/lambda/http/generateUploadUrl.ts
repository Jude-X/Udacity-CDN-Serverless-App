import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { cors } from 'middy/middlewares'
import * as middy from 'middy'

import { getUrl } from '../../businessLogic/todos'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId

    const uploadUrl = await getUrl(todoId)

    return {
      statusCode: 201,
      body: JSON.stringify({ uploadUrl })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
