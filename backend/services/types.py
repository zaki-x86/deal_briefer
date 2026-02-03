from dataclasses import dataclass
from typing import Optional, Dict, Any, List, Literal
from pydantic import BaseModel, Field


class DealEntities(BaseModel):
    company: Optional[str]
    founders: List[str]
    sector: Optional[str]
    geography: Optional[str]
    stage: Literal["Seed", "Series A", "Series B", "Unknown"]
    round_size_usd: Optional[float]
    notable_metrics: List[str]

class DealTags(BaseModel):
    category: List[Literal["fintech", "deep tech", "climate tech"]]
    stage: Literal["Seed", "Series A", "Series B"]

class DealBriefSchema(BaseModel):
    investment_brief: List[str] = Field(..., min_items=10, max_items=10)
    entities: DealEntities
    tags: DealTags