import * as AWS from 'aws-sdk'

import { createLogger } from '../utils/logger'

const logger = createLogger('fileAccess')

export class FileAccess {
  constructor(
    private readonly s3: AWS.S3 = new AWS.S3({ signatureVersion: 'v4' }),
    private readonly bucketName: string = process.env.TABLE_NAME,
    private readonly urlExpiration: number = parseInt(process.env.SIGNED_URL_EXPIRATION)
  ) {}

  async getUploadUrl(imageId: string): Promise<string> {
    logger.info(`Getting signed url`)

    const result = await this.s3.getSignedUrl('putObject', {
      Bucket: this.bucketName,
      Key: imageId,
      Expires: this.urlExpiration
    })

    return result
  }
}
