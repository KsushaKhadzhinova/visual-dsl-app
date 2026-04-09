export const CONFIG = {
API: {
TEMPLATES_URL: "https://jsonplaceholder.typicode.com/posts?_limit=6",
AI_ENDPOINT: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
MOCK_POST_URL: "https://jsonplaceholder.typicode.com/posts"
},
KEYS: {
AI_API_KEY: ""
},
STORAGE: {
CODE_DRAFT: "diagramcode_v13_editor_draft",
TEMPLATES_CACHE: "diagramcode_v13_cached_data",
SYNC_TIMESTAMP: "diagramcode_v13_last_sync",
SETTINGS: "diagramcode_v13_app_settings"
},
DEFAULTS: {
ENGINE: "mermaid",
DSL_CODE: "graph TD\n A[Start Process] --> B{Check Network}\n B -- Online --> C[Fetch Templates]\n B -- Offline --> D[Load Cache]\n C --> E[IDE Ready]\n D --> E",
AUTO_SAVE_INTERVAL: 1000
},
VALIDATION: {
MIN_PROMPT_LENGTH: 10,
MAX_RETRY_ATTEMPTS: 3,
RETRY_DELAY: 2000
}
};