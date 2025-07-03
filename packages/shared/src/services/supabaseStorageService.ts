import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface SupabaseStorageServiceConfig {
  supabaseUrl: string;
  supabaseKey: string;
  bucketName: string;
}

const EXPIRES_IN_30_DAYS = 60 * 60 * 24 * 30;

export class SupabaseStorageService {
  private readonly bucketName: string;
  private readonly supabase: SupabaseClient;

  constructor({ supabaseUrl, supabaseKey, bucketName }: SupabaseStorageServiceConfig) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
    this.bucketName = bucketName;
  }

  async uploadFile({
    key,
    body,
    contentType,
  }: {
    key: string;
    body: File | Blob | ArrayBuffer | Uint8Array | string;
    contentType?: string;
  }): Promise<void> {
    const { error } = await this.supabase.storage
      .from(this.bucketName)
      .upload(key, body, { contentType, upsert: true });
    if (error) {
      throw new Error(`Supabase upload error: ${error.message}`);
    }
  }

  async getSignedUrl({
    key,
    expiresInSeconds = EXPIRES_IN_30_DAYS,
  }: {
    key: string;
    expiresInSeconds?: number;
  }): Promise<string> {
    const { data, error } = await this.supabase.storage
      .from(this.bucketName)
      .createSignedUrl(key, expiresInSeconds);
    if (error || !data?.signedUrl) {
      throw new Error(`Supabase signed URL error: ${error?.message ?? 'No URL returned'}`);
    }
    return data.signedUrl;
  }

  getPublicUrl(key: string): string {
    const { publicUrl } = this.supabase.storage.from(this.bucketName).getPublicUrl(key).data;
    return publicUrl;
  }
}
