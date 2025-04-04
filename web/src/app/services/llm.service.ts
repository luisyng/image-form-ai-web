import { Injectable } from "@angular/core";
import { MalariaData } from "../malaria/malaria-data";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { firstValueFrom } from "rxjs";

@Injectable({
    providedIn: 'root'
  })
export class LlmService {
  private readonly OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
  private readonly MODEL = 'gpt-4o-mini';
  private apiKey: string = '';

  constructor(private http: HttpClient) { }
  
  setApiKey(key: string): void {
    this.apiKey = key;
  }

  async transformImageToMalariaData(imageFile: File): Promise<MalariaData> {
    if (!this.apiKey) {
      throw new Error('API key is required');
    }
    
    try {
      // Convert the image to base64
      const base64Image = await this.fileToBase64(imageFile);
      
      // Create the prompt for the OpenAI API
      const prompt = this.createMalariaDataPrompt();
      
      // Make the API call
      const response = await this.callOpenAIAPI(base64Image, prompt);
      
      // Parse the response to extract the malaria data
      return this.parseMalariaDataResponse(response);
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      throw error; // Propagate the error to handle it in the component
    }
  }

  private async fileToBase64(file: File): Promise<string> {
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

  private createMalariaDataPrompt(): string {
    return `
You are an AI assistant specialized in analyzing medical images and extracting structured data about malaria cases.

Please analyze the provided image and extract the following information in a structured JSON format:
- Patient name
- Patient age
- Symptoms (fever, chills, sweating, headache, nausea, vomiting, muscle pain, fatigue, other symptoms)

Return ONLY a valid JSON object with the following structure:
{
  "name": string,
  "age": number,
  "fever": boolean,
  "chills": boolean,
  "sweating": boolean,
  "headache": boolean,
  "nausea": boolean,
  "vomiting": boolean,
  "musclePain": boolean,
  "fatigue": boolean,
  "otherSymptoms": string
}

If any field is not available in the image, use null for strings, 0 for numbers, and false for booleans.
`;
  }

  private async callOpenAIAPI(base64Image: string, prompt: string): Promise<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    });

    const payload = {
      model: this.MODEL,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 1000
    };

    return firstValueFrom(this.http.post(this.OPENAI_API_URL, payload, { headers }));
  }

  private parseMalariaDataResponse(response: any): MalariaData {
    try {
      // Extract the content from the OpenAI response
      const content = response.choices[0].message.content;
      
      // Parse the JSON from the content
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/{[\s\S]*?}/);
      const jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : content;
      
      // Parse the JSON string into an object
      const data = JSON.parse(jsonString.trim());
      
      // Convert the data to a MalariaData object, only including fields that are in the interface
      return {
        name: data.name || '',
        age: data.age || null,
        fever: !!data.fever,
        chills: !!data.chills,
        sweating: !!data.sweating,
        headache: !!data.headache,
        nausea: !!data.nausea,
        vomiting: !!data.vomiting,
        musclePain: !!data.musclePain,
        fatigue: !!data.fatigue,
        otherSymptoms: data.otherSymptoms || ''
      };
    } catch (error) {
      console.error('Error parsing OpenAI response:', error);
      throw new Error('Failed to parse response from OpenAI');
    }
  }

  async transformAudioToMalariaData(audioFile: File): Promise<MalariaData> {
    if (!this.apiKey) {
      throw new Error('API key not set');
    }
    
    try {
      // First, we need to transcribe the audio
      const transcription = await this.transcribeAudio(audioFile);
      
      // Then, we extract the malaria data from the transcription
      return this.extractMalariaDataFromText(transcription);
    } catch (error) {
      console.error('Error in transformAudioToMalariaData:', error);
      throw error;
    }
  }
  
  private async transcribeAudio(audioFile: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', audioFile);
      formData.append('model', 'whisper-1');
      
      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Transcription failed: ${errorData.error?.message || response.statusText}`);
      }
      
      const data = await response.json();
      return data.text;
    } catch (error) {
      console.error('Error transcribing audio:', error);
      throw error;
    }
  }
  
  private async extractMalariaDataFromText(text: string): Promise<MalariaData> {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are a medical data extraction assistant. Extract structured malaria test data from the provided text. Return ONLY a valid JSON object with the following structure:
{
  "name": string,
  "age": number,
  "fever": boolean,
  "chills": boolean,
  "sweating": boolean,
  "headache": boolean,
  "nausea": boolean,
  "vomiting": boolean,
  "musclePain": boolean,
  "fatigue": boolean,
  "otherSymptoms": string
}`
            },
            {
              role: 'user',
              content: `Extract malaria test data from this transcription: ${text}`
            }
          ],
          response_format: { type: 'json_object' }
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Data extraction failed: ${errorData.error?.message || response.statusText}`);
      }
      
      return this.parseMalariaDataResponse(response);
    } catch (error) {
      console.error('Error extracting malaria data from text:', error);
      throw error;
    }
  }
}