import { Injectable } from "@angular/core";
import { HttpHeaders } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
  })
export class LlmRequestHelperService {
  private readonly MODEL = 'gpt-4o-mini';


  async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  }

  createHeaders(apiKey: string): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    })
  }

  createPayloadForImage(base64Image: string, prompt: string): any {
    return this.createPayload(prompt, this.createImageMessageContent(base64Image));
  }

  createPayloadForText(text: string, prompt: string): any {
    return this.createPayload(prompt, this.createTextMessageContent(text));
  }

  private createImageMessageContent(base64Image: string) {
    return [
      {
        type: "image_url",
        image_url: {
          url: `data:image/jpeg;base64,${base64Image}`
        }
      }
    ];
  }

  private createTextMessageContent(text: string) {
    return `Extract malaria test data from this transcription: ${text}`
  }

  private createPayload(prompt: string, userContent: any): any {
    return {
      model: this.MODEL,
      messages: [
        {
          role: 'system',
          content: prompt
        },
        {
          role: "user",
          content: userContent
        }
      ],
      max_tokens: 1000
    }
  }
}