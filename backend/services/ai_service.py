import os
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables from .env
load_dotenv()

USE_MOCK_AI = os.getenv("USE_MOCK_AI", "true").lower() == "true"
FIREWORKS_API_KEY = os.getenv("FIREWORKS_API_KEY", "").strip()
FIREWORKS_MODEL = os.getenv("FIREWORKS_MODEL", "accounts/fireworks/models/gemma-4-31b-it")
FIREWORKS_BASE_URL = os.getenv("FIREWORKS_BASE_URL", "https://api.fireworks.ai/inference/v1")
MAX_LIVE_TOKENS = int(os.getenv("MAX_LIVE_TOKENS", "1024"))

def is_live_mode_enabled() -> bool:
    return not USE_MOCK_AI and bool(FIREWORKS_API_KEY)

def call_fireworks_api(prompt: str) -> str:
    try:
        client = OpenAI(
            base_url=FIREWORKS_BASE_URL,
            api_key=FIREWORKS_API_KEY,
            timeout=15.0
        )
        
        # Split the prompt into system instructions and user data
        system_msg = "You are a strict data formatter. You MUST NOT output any conversational text, thought process, or explanations. Start your response directly with '# NexusOps AI'."
        
        response = client.chat.completions.create(
            model=FIREWORKS_MODEL,
            messages=[
                {"role": "system", "content": system_msg},
                {"role": "user", "content": prompt}
            ],
            max_tokens=MAX_LIVE_TOKENS,
            temperature=0.2
        )
        content = response.choices[0].message.content
        if "# NexusOps AI Operations Report" in content:
            content = "# NexusOps AI Operations Report" + content.split("# NexusOps AI Operations Report", 1)[1]
            
        return content.strip()
    except Exception as e:
        # Return a safe fallback signal / raise a caught exception instead of crashing
        raise RuntimeError(f"Fireworks API call failed: {str(e)}")
