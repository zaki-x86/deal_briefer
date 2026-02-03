export interface DealBriefSchema {
    investment_brief: string[];
    entities: DealEntities;
    tags: DealTags;
}

export interface DealEntities {
    company: string;
    founders: string[];
    sector: string;
    geography: string;
    stage: "Seed" | "Series A" | "Series B";
    round_size_usd: number;
    notable_metrics: string[];
}

export type Category = "fintech" | "deep tech" | "climate tech";

export type Stage = "Seed" | "Series A" | "Series B";

export interface DealTags {
    category: Category[];
    stage: Stage;
}

export interface Deal {
    id: string;
    raw_text: string;
    extracted_json: DealBriefSchema;
    status: "pending" | "processed" | "failed";
    last_error: string | null;
    created_at: string;
    updated_at: string;
}