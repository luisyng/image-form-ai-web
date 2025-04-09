import { FormDataProjection } from "./form-data";
import { FormMetadata } from "./form-metadata";

export class FormDataFactory {
    static createProjectionFromMetadata(metadata: FormMetadata): FormDataProjection {
        const projection: FormDataProjection = {};
        
        for (const element of metadata.elements) {
            projection[element.id] = element.defaultValue;
        }
        
        return projection;
    }
}