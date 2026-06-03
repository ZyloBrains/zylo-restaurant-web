export interface HeroImageResponse {
  id: number;
  fileUrl: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  sortOrder: number;
  title?: string;
  description?: string;
}
