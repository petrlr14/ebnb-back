import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v1 as uuid } from 'uuid';
import { Resource } from './resource.entity';
@Injectable()
export class ResourcesService {
  constructor(private readonly configService: ConfigService) {}

  getClient(imgName: string): BlockBlobClient {
    const key = this.configService.get<string>('AZURE_STORAGE_SAS_KEY');
    const blobClientService = BlobServiceClient.fromConnectionString(key);
    const containerClinet = blobClientService.getContainerClient('ebnb');
    const blobClient = containerClinet.getBlockBlobClient(`${imgName}`);
    return blobClient;
  }

  async upload(file: Express.Multer.File): Promise<string> {
    const originalName = file.originalname.split('.');
    const blobClient = this.getClient(
      `${originalName[0]}${uuid()}.${originalName[1]}`,
    );
    await blobClient.uploadData(file.buffer);
    return blobClient.url;
  }

  async uploadMultipleFiles(files: Express.Multer.File[]): Promise<string[]> {
    const filesUrls = await Promise.all(
      files.map(async (file) => {
        return await this.upload(file);
      }),
    );
    return filesUrls;
  }

  async getNewResourcesFromFiles(
    files: Express.Multer.File[],
  ): Promise<Resource[]> {
    const urls = await this.uploadMultipleFiles(files);
    const resources = [];
    for (const url in urls) {
      const resource = new Resource();
      resource.url = urls[url];
      resources.push(resource);
    }
    return resources;
  }
}
