# backend/llm_utils.py

from ollama import chat

def call_local_llm(system_prompt, user_prompt):
    response = chat(
        model="mistral",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
    )
    return response['message']['content']
