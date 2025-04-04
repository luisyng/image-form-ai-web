import { Injectable } from "@angular/core";
import { MalariaData } from "../malaria/malaria-data";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
import { LlmPromptService } from "./llm-prompt.service";
import { LlmRequestHelperService } from "./llm-request-helper.service";
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: 'root'
  })
export class LlmService {
  private readonly OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
  private readonly OPENAI_TRANSCRIPTION_URL = 'https://api.openai.com/v1/audio/transcriptions';
  private apiKey: string = environment.openai.apiKey;

  constructor(private http: HttpClient,
    private llmPromptService: LlmPromptService,
    private llmRequestHelperService: LlmRequestHelperService
  ) { }
  
  async transformImageToMalariaData(imageFile: File): Promise<MalariaData> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key is not configured. Please check your environment settings.');
    }
    
    try {
      // Convert the image to base64
      const base64Image = await this.llmRequestHelperService.fileToBase64(imageFile);
      
      // Create the prompt for the OpenAI API
      const prompt = this.llmPromptService.createMalariaDataPrompt('image');
      
      // Make the API call
      const response = await this.callOpenAI(
        this.llmRequestHelperService.createPayloadForImage(base64Image, prompt));
      console.log('OpenAI image analysis response:', response);
      
      // Parse the response to extract the malaria data
      return this.parseMalariaDataResponse(response);
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      throw error; // Propagate the error to handle it in the component
    }
  }

  async transformAudioToMalariaData(audioFile: File): Promise<MalariaData> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key is not configured. Please check your environment settings.');
    }
    
    try {
      // First, we need to transcribe the audio
      const transcription = await this.transcribeAudio(audioFile);
      console.log('Transcription result:', transcription);
      
      // Then, we extract the malaria data from the transcription
      return this.extractMalariaDataFromText(transcription);
    } catch (error) {
      console.error('Error in transformAudioToMalariaData:', error);
      throw error;
    }
  }
  
  private async callOpenAI(payload: any): Promise<any> {
    return firstValueFrom(this.http.post(this.OPENAI_API_URL, payload,
      { headers: this.llmRequestHelperService.createHeaders(this.apiKey) }));
  }

  private async transcribeAudio(audioFile: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', audioFile);
      formData.append('model', 'whisper-1');
      
      const response = await fetch(this.OPENAI_TRANSCRIPTION_URL, {
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
    const prompt = this.llmPromptService.createMalariaDataPrompt('text');
    const response = await this.callOpenAI(
      this.llmRequestHelperService.createPayloadForText(text, prompt));
    console.log('OpenAI text analysis response:', response);
    return this.parseMalariaDataResponse(response);
  }

  private parseMalariaDataResponse(response: any): MalariaData {
    try {
      // Extract the content from the OpenAI response
      console.log('Parsing response:', response.choices);
      const content = response.choices[0].message.content;
      
      // Parse the JSON from the content
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/{[\s\S]*?}/);
      const jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : content;
      
      console.log('Extracted JSON string:', jsonString);
      
      // Parse the JSON string into an object
      const data = JSON.parse(jsonString.trim());
      console.log('Parsed data:', data);
      
      // Convert the data to a MalariaData object, only including fields that are in the interface
      return {
        name: data.name || data.patientName || '',
        age: data.age || null,
        fever: !!data.fever,
        chills: !!data.chills,
        sweating: !!data.sweating,
        headache: !!data.headache,
        nausea: !!data.nausea,
        vomiting: !!data.vomiting,
        musclePain: !!data.musclePain,
        fatigue: !!data.fatigue,
        otherSymptoms: data.otherSymptoms || data.notes || ''
      };
    } catch (error) {
      console.error('Error parsing OpenAI response:', error);
      throw new Error('Failed to parse response from OpenAI');
    }
  }
}