from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Optional, Dict, Any

@dataclass
class DealBriefResult:
    success: bool
    data: Optional[Dict] = None
    error: Optional[str] = None
    raw_response: Optional[Any] = None

class BriefGeneratorInterface(ABC):
    @abstractmethod
    def generate_brief(self, deal_text: str) -> DealBriefResult:
        pass