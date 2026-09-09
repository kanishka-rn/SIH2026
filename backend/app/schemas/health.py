from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: str = Field(description="Process liveness indicator.")
    service: str
    environment: str
    phase: str
