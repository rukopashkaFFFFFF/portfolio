export interface StorageService {
  save(
    buffer: Buffer,
    fileName: string,
    folder?: string
  ): Promise<{ url: string; path: string }>;
  delete(filePath: string): Promise<void>;
  getUrl(filePath: string): string;
}

export class LocalStorageService implements StorageService {
  private baseDir: string;
  private baseUrl: string;

  constructor(baseDir: string, baseUrl: string = '/uploads') {
    this.baseDir = baseDir;
    this.baseUrl = baseUrl;
  }

  async save(
    buffer: Buffer,
    fileName: string,
    folder?: string
  ): Promise<{ url: string; path: string }> {
    const fs = await import('fs');
    const path = await import('path');
    const dir = folder ? path.join(this.baseDir, folder) : this.baseDir;
    fs.mkdirSync(dir, { recursive: true });
    const fullPath = path.join(dir, fileName);
    fs.writeFileSync(fullPath, buffer);
    const relativePath = folder ? `${folder}/${fileName}` : fileName;
    return { url: `${this.baseUrl}/${relativePath}`, path: fullPath };
  }

  async delete(filePath: string): Promise<void> {
    const fs = await import('fs');
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  getUrl(filePath: string): string {
    return `${this.baseUrl}/${filePath}`;
  }
}
