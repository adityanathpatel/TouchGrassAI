import json
from abc import ABC, abstractmethod
import httpx
from config import settings
from typing import Dict, Any, List

class AIProvider(ABC):
    @abstractmethod
    async def generate_adventure(self, lat: float, lng: float, activity: str, duration_minutes: int, difficulty: str, interests: List[str]) -> Dict[str, Any]:
        pass
        
    @abstractmethod
    async def generate_journal(self, adventure_data: Dict[str, Any], observations: List[Dict[str, Any]]) -> Dict[str, Any]:
        pass

class MockAIProvider(AIProvider):
    async def generate_adventure(self, lat: float, lng: float, activity: str, duration_minutes: int, difficulty: str, interests: List[str]) -> Dict[str, Any]:
        return {
            "title": f"The {activity.capitalize()} Expedition",
            "description": f"A delightful {duration_minutes} minute {activity} through nature focusing on {', '.join(interests)}.",
            "difficulty": difficulty,
            "duration_minutes": duration_minutes,
            "missions": [
                {"title": "Spot a wild bird", "description": "Look for a local bird species."},
                {"title": "Find a unique leaf", "description": "Find a leaf with an interesting texture."}
            ],
            "checklist": ["Water bottle", "Comfortable shoes", "Curiosity"],
            "safety_notes": ["Stay on marked paths", "Be aware of your surroundings"]
        }
        
    async def generate_journal(self, adventure_data: Dict[str, Any], observations: List[Dict[str, Any]]) -> Dict[str, Any]:
        return {
            "title": f"Reflections on {adventure_data.get('title', 'My Walk')}",
            "summary": "This was a wonderful outdoor excursion.",
            "content": f"I completed {len(observations)} observations during this adventure."
        }

class OllamaProvider(AIProvider):
    def __init__(self):
        self.base_url = settings.OLLAMA_BASE_URL
        self.model = settings.MODEL_NAME
        
    async def _generate(self, prompt: str) -> str:
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    f"{self.base_url}/api/generate",
                    json={
                        "model": self.model,
                        "prompt": prompt,
                        "stream": False,
                        "format": "json"
                    },
                    timeout=60.0
                )
                response.raise_for_status()
                return response.json()["response"]
            except Exception as e:
                print(f"Ollama error: {e}")
                raise e
                
    async def generate_adventure(self, lat, lng, activity, duration_minutes, difficulty, interests):
        prompt = f"""
        Generate a personalized outdoor adventure in JSON format.
        Activity: {activity}
        Duration: {duration_minutes} minutes
        Difficulty: {difficulty}
        Interests: {', '.join(interests)}
        
        The JSON should have this schema:
        {{
            "title": "...",
            "description": "...",
            "difficulty": "{difficulty}",
            "duration_minutes": {duration_minutes},
            "missions": [{{"title": "...", "description": "..."}}],
            "checklist": ["..."],
            "safety_notes": ["..."]
        }}
        """
        try:
            response_text = await self._generate(prompt)
            return json.loads(response_text)
        except Exception as e:
            print("Falling back to mock AI due to error.")
            mock = MockAIProvider()
            return await mock.generate_adventure(lat, lng, activity, duration_minutes, difficulty, interests)
            
    async def generate_journal(self, adventure_data, observations):
        prompt = f"""
        Generate a journal entry for this adventure in JSON format.
        Adventure: {adventure_data.get('title')}
        Observations: {json.dumps(observations)}
        
        JSON schema:
        {{
            "title": "...",
            "summary": "...",
            "content": "..."
        }}
        """
        try:
            response_text = await self._generate(prompt)
            return json.loads(response_text)
        except Exception as e:
            mock = MockAIProvider()
            return await mock.generate_journal(adventure_data, observations)

def get_ai_provider() -> AIProvider:
    if settings.AI_PROVIDER.lower() == "ollama":
        return OllamaProvider()
    return MockAIProvider()
