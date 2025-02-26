from fastapi import FastAPI, File, UploadFile, HTTPException
from pydantic import BaseModel, Field
from typing import Optional
import uvicorn
import pytesseract
from PIL import Image
import io
import re
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Malaria Symptoms Form Extractor",
    description="API to extract data from malaria symptoms forms and return structured JSON",
    version="1.0.0"
)

# Pydantic model matching the provided schema
class MalariaSymptomsForm(BaseModel):
    name: str
    age: int
    fever: bool
    chills: bool
    sweating: bool
    headache: bool
    nausea: bool
    vomiting: bool
    musclePain: bool
    fatigue: bool
    otherSymptoms: Optional[str] = Field(None)

# Helper function to extract text from image
def extract_text_from_image(image_bytes):
    try:
        image = Image.open(io.BytesIO(image_bytes))
        text = pytesseract.image_to_string(image)
        return text
    except Exception as e:
        logger.error(f"Error extracting text from image: {e}")
        raise HTTPException(status_code=500, detail="Failed to process the image")

# Helper function to parse form data from text
def parse_form_data(text):
    logger.info("Parsing extracted text")
    
    # Initialize form data with default values
    form_data = {
        "name": "",
        "age": 0,
        "fever": False,
        "chills": False,
        "sweating": False,
        "headache": False,
        "nausea": False,
        "vomiting": False,
        "musclePain": False,
        "fatigue": False,
        "otherSymptoms": None
    }
    
    # Extract name
    name_match = re.search(r"Name:?\s*([^\n]+)", text, re.IGNORECASE)
    if name_match:
        form_data["name"] = name_match.group(1).strip()
    
    # Extract age
    age_match = re.search(r"Age:?\s*(\d+)", text, re.IGNORECASE)
    if age_match:
        form_data["age"] = int(age_match.group(1))
    
    # Extract boolean fields
    boolean_fields = [
        "fever", "chills", "sweating", "headache", 
        "nausea", "vomiting", "musclePain", "fatigue"
    ]
    
    for field in boolean_fields:
        # Look for field followed by yes/no, checkboxes [x], or similar indicators
        field_pattern = field.replace("musclePain", "muscle pain")
        yes_pattern = fr"{field_pattern}:?\s*(yes|y|true|\[x\]|\☑|\✓|marked|checked)"
        if re.search(yes_pattern, text, re.IGNORECASE):
            form_data[field] = True
    
    # Extract other symptoms if present
    other_symptoms_match = re.search(r"Other symptoms:?\s*([^\n]+)", text, re.IGNORECASE)
    if other_symptoms_match:
        form_data["otherSymptoms"] = other_symptoms_match.group(1).strip()
    
    return form_data

@app.post("/extract-form", response_model=MalariaSymptomsForm)
async def extract_form(file: UploadFile = File(...)):
    """
    Extract data from an uploaded image of a malaria symptoms form
    and return it as structured JSON.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be an image")
    
    contents = await file.read()
    
    # Extract text from image
    text = extract_text_from_image(contents)
    logger.info(f"Extracted text: {text[:100]}...")
    
    # Parse form data
    form_data = parse_form_data(text)
    
    # Validate form data
    try:
        # Create Pydantic model instance to validate the data
        return MalariaSymptomsForm(**form_data)
    except Exception as e:
        logger.error(f"Validation error: {e}")
        raise HTTPException(
            status_code=422, 
            detail=f"Invalid form data extracted: {str(e)}"
        )

@app.get("/")
def read_root():
    return {"message": "Malaria Symptoms Form Extractor API", "status": "online"}

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
