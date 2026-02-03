from api.models import Deal
import hashlib
import re

from services.interfaces.brief_generator import BriefGeneratorInterface


class DuplicatedDealError(Exception):
    pass

class DealBrieferSvc:
    def __init__(self, brief_generator: BriefGeneratorInterface) -> None:
        self.brief_generator = brief_generator
    
    def create_brief(self, raw_text: str) -> Deal:
        input_hash = self._hash_text(self._normalize_text(raw_text))
        existing = Deal.objects.filter(input_hash=input_hash).first()
        if existing:
            raise DuplicatedDealError("Deal with this input hash already exists.")
        deal = Deal.objects.create(raw_text=raw_text, input_hash=input_hash)
        try:
            result = self.brief_generator.generate_brief(raw_text)
            if result.success:
                deal.extracted_json = result.data
                deal.status = "processed"
            else:
                deal.status = "failed"
                deal.last_error = result.error
        except Exception as e:
            print(f"Error saving deal: {e}")
            deal.status = "failed"
            deal.last_error = str(e)
        deal.save()
        return deal

    def _hash_text(self, text: str) -> str:
        return hashlib.sha256(text.encode('utf-8')).hexdigest()
    
    def _normalize_text(self, text: str) -> str:
        text = text.strip()
        text = re.sub(r"\s+", " ", text)
        return text.lower()