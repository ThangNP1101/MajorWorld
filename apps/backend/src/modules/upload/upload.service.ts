import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadService {
  private s3: AWS.S3;
  private bucketName: string;

  constructor(private configService: ConfigService) {
    this.s3 = new AWS.S3({
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get<string>('AWS_REGION') || 'ap-northeast-2',
    });
    this.bucketName = this.configService.get<string>('AWS_S3_BUCKET') || 'majorworld-assets';
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: string = 'uploads',
  ): Promise<string> {
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${folder}/${uuidv4()}.${fileExtension}`;

    const params: AWS.S3.PutObjectRequest = {
      Bucket: this.bucketName,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
      // ACL removed - bucket uses Bucket owner enforced (ACLs disabled)
      // Public access is controlled via Bucket Policy instead
    };

    try {
      const result = await this.s3.upload(params).promise();
      return result.Location;
    } catch (error) {
      throw new Error(`Failed to upload file to S3: ${error.message}`);
    }
  }

  async deleteFile(fileUrl: string): Promise<void> {
    try {
      // Extract key from URL
      const url = new URL(fileUrl);
      const key = url.pathname.substring(1); // Remove leading '/'

      const params: AWS.S3.DeleteObjectRequest = {
        Bucket: this.bucketName,
        Key: key,
      };

      await this.s3.deleteObject(params).promise();
    } catch (error) {
      // Log error but don't throw - file might not exist
      console.error(`Failed to delete file from S3: ${error.message}`);
    }
  }
}

