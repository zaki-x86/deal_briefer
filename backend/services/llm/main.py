from google import genai
import json
from pydantic import ValidationError
from django.conf import settings
from services.interfaces.brief_generator import BriefGeneratorInterface, DealBriefResult
from core.prompts import SYSTEM_PROMPT, EXTRACTION_PROMPT, REPAIR_PROMPT
from services.types import DealBriefSchema

class DealLLMBriefer(BriefGeneratorInterface):
    def __init__(self, model: str = "gemini-3-flash-preview"):
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
        self.model = model
    
    def schema_prompt(self) -> str:
        return f"""
                You MUST output JSON that matches this schema exactly:

                {json.dumps(DealBriefSchema.model_json_schema(), indent=2)}

                Additional constraints:
                - investment_brief must contain EXACTLY 10 items
                - Arrays must be present even if empty
                - Do not add or remove fields
                """


    def generate_brief(self, raw_text: str) -> DealBriefResult:
        try:
            response = self._call_llm(raw_text)
            print("LLM Response:", response)
            parsed = self._parse_and_validate(response)
            return DealBriefResult(success=True, data=parsed, raw_response=response)

        except ValidationError as ve:
            # Retry once with repair prompt
            print("Validation error:", ve)
            try:
                response = self._call_llm(
                    raw_text,
                    repair_error=str(ve)
                )
                parsed = self._parse_and_validate(response)
                return DealBriefResult(success=True, data=parsed, raw_response=response)

            except Exception as e:
                print("Repair attempt failed:", e)
                return DealBriefResult(
                    success=False,
                    error=str(e),
                )

        except Exception as e:
            return DealBriefResult(success=False, error=str(e))
    
    def _call_llm(self, raw_text: str, repair_error: str | None = None) -> str:
        if repair_error:
            prompt = REPAIR_PROMPT.format(
                error=repair_error,
                schema=DealBriefSchema.model_json_schema()
            )
        else:
            prompt = EXTRACTION_PROMPT + raw_text

        response = self.client.models.generate_content(
            model=self.model,
            contents=f"""
            {SYSTEM_PROMPT}
            {self.schema_prompt()}
            {prompt}
            """,
        )

        return response.text

    def _parse_and_validate(self, response_text: str) -> dict:
        parsed = json.loads(response_text)
        validated = DealBriefSchema.model_validate(parsed)
        return validated.model_dump()