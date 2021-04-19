import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ResourcesService {
  constructor(private readonly configService: ConfigService) {}

  getClient(imgName: string): BlockBlobClient {
    const key = this.configService.get<string>('AZURE_STORAGE_SAS_KEY');
    const blobClientService = BlobServiceClient.fromConnectionString(key);
    const containerClinet = blobClientService.getContainerClient('ebnb');
    const blobClient = containerClinet.getBlockBlobClient(imgName);
    return blobClient;
  }

  async upload(file: Express.Multer.File) {
    const blobClient = this.getClient(file.originalname);
    const x = await blobClient.uploadData(file.buffer);
    return blobClient.url;
  }
}
