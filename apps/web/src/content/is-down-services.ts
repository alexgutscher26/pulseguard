export type ServiceCategory =
  | "ai-ml"
  | "cloud-infra"
  | "payments-fintech"
  | "devtools-git"
  | "auth-security"
  | "databases-storage"
  | "comms-email"
  | "productivity-collab"
  | "media-streaming"
  | "web3-crypto";

export interface ServiceDownInfo {
  slug: string;
  name: string;
  category: ServiceCategory;
  domain: string;
  officialStatusUrl: string;
  apiEndpoint?: string;
  description: string;
  impactSummary: string;
  keyComponents: string[];
  commonErrorCodes: string[];
  troubleshootingSteps: string[];
  relatedServices: string[];
  featured?: boolean;
}

export const CATEGORY_LABELS: Record<ServiceCategory, string> = {
  "ai-ml": "AI & Machine Learning",
  "cloud-infra": "Cloud & Infrastructure",
  "payments-fintech": "Payments & Fintech",
  "devtools-git": "Developer Tools & CI/CD",
  "auth-security": "Auth & Security",
  "databases-storage": "Databases & Storage",
  "comms-email": "Communications & Email",
  "productivity-collab": "Productivity & Collaboration",
  "media-streaming": "Media, Video & CDN",
  "web3-crypto": "Web3 & Blockchain APIs",
};

export const SERVICES_DATA: ServiceDownInfo[] = [
  {
    slug: "openai",
    name: "OpenAI",
    category: "ai-ml",
    domain: "api.openai.com",
    officialStatusUrl: "https://status.openai.com",
    apiEndpoint: "https://api.openai.com/v1/models",
    description:
      "OpenAI provides developer APIs for GPT-4o, ChatGPT, DALL-E, Whisper, and Embeddings.",
    impactSummary:
      "AI chat completions fail, embeddings stall, automated agent workflows hang, and ChatGPT returns 503 errors.",
    keyComponents: [
      "Chat Completions API",
      "Embeddings API",
      "Assistants API",
      "ChatGPT Web Interface",
      "Fine-Tuning API",
    ],
    commonErrorCodes: [
      "503 Service Unavailable",
      "429 Rate Limit Exceeded",
      "500 Internal Server Error",
      "504 Gateway Timeout",
    ],
    troubleshootingSteps: [
      "Check OpenAI status page for active incident reports.",
      "Switch to fallback model providers (Anthropic Claude, Groq, Mistral) via an LLM gateway.",
      "Implement exponential backoff on HTTP 429 and 503 response codes.",
      "Review client-side request timeout budgets and queue background tasks.",
    ],
    relatedServices: [
      "anthropic",
      "groq",
      "perplexity",
      "mistral-ai",
      "hugging-face",
      "pinecone",
    ],
    featured: true,
  },
  {
    slug: "anthropic",
    name: "Anthropic Claude",
    category: "ai-ml",
    domain: "api.anthropic.com",
    officialStatusUrl: "https://status.anthropic.com",
    apiEndpoint: "https://api.anthropic.com/v1/messages",
    description:
      "Anthropic develops Claude 3.5 Sonnet, Claude 3.5 Haiku, and Claude Opus AI models.",
    impactSummary:
      "Claude API calls fail, generative reasoning breaks, and Claude.ai workspace becomes unreachable.",
    keyComponents: [
      "Messages API",
      "Claude.ai Web App",
      "Token Counting",
      "Prompt Caching API",
    ],
    commonErrorCodes: [
      "529 Overloaded",
      "500 Internal Server Error",
      "429 Rate Limit",
      "504 Gateway Timeout",
    ],
    troubleshootingSteps: [
      "Check status.anthropic.com for cluster overload status.",
      "Route prompt traffic to OpenAI or Groq temporary fallbacks.",
      "Verify headers including anthropic-version and API key validity.",
    ],
    relatedServices: ["openai", "groq", "mistral-ai", "cohere", "together-ai"],
    featured: true,
  },
  {
    slug: "perplexity",
    name: "Perplexity AI",
    category: "ai-ml",
    domain: "perplexity.ai",
    officialStatusUrl: "https://status.perplexity.ai",
    description:
      "Perplexity AI provides conversational search, citations, and Sonar LLM API services.",
    impactSummary:
      "Live search-grounded answers stop generating and sonar online queries return 500 errors.",
    keyComponents: [
      "Sonar API",
      "Perplexity Pro Web",
      "Search Indexer",
      "Collections",
    ],
    commonErrorCodes: [
      "500 Internal Error",
      "502 Bad Gateway",
      "429 Too Many Requests",
    ],
    troubleshootingSteps: [
      "Check official status.",
      "Verify API balance.",
      "Switch to direct search + LLM fallback.",
    ],
    relatedServices: ["openai", "anthropic", "tavily"],
    featured: true,
  },
  {
    slug: "groq",
    name: "Groq",
    category: "ai-ml",
    domain: "api.groq.com",
    officialStatusUrl: "https://status.groq.com",
    description:
      "Ultra-fast LPU inference engine for Llama 3, Mixtral, and Gemma open-weights models.",
    impactSummary:
      "Low-latency inference pipelines hang or fail back to slower cloud providers.",
    keyComponents: [
      "LPU Inference Engine",
      "OpenAI Compatible API",
      "GroqCloud Console",
    ],
    commonErrorCodes: [
      "503 Service Unavailable",
      "429 Rate Limit Exceeded",
      "500 Internal Server Error",
    ],
    troubleshootingSteps: [
      "Switch inference traffic to Together AI or Fireworks AI.",
      "Verify token quota on GroqCloud.",
    ],
    relatedServices: ["openai", "together-ai", "fireworks-ai", "deepinfra"],
  },
  {
    slug: "midjourney",
    name: "Midjourney",
    category: "ai-ml",
    domain: "midjourney.com",
    officialStatusUrl: "https://status.midjourney.com",
    description:
      "Generative text-to-image AI platform operating on Discord and web.",
    impactSummary:
      "Image generation queues stop progressing, prompt jobs error out on Discord bot.",
    keyComponents: [
      "Discord Bot Dispatch",
      "Web Generation Engine",
      "Image Upscaler",
      "Billing Portal",
    ],
    commonErrorCodes: [
      "Job Execution Failed",
      "Discord Gateway Timeout",
      "500 Server Error",
    ],
    troubleshootingSteps: [
      "Check #status in Midjourney Discord.",
      "Test web alpha interface.",
      "Check Discord bot latency.",
    ],
    relatedServices: ["openai", "stability-ai", "replicate", "fal-ai"],
  },
  {
    slug: "hugging-face",
    name: "Hugging Face",
    category: "ai-ml",
    domain: "huggingface.co",
    officialStatusUrl: "https://status.huggingface.co",
    description:
      "Open source AI model hub, dataset repository, and Inference Endpoints cloud.",
    impactSummary:
      "Model weight downloads fail in CI/CD, Spaces crash, Inference API returns 503.",
    keyComponents: [
      "Model Hub Git LFS",
      "Spaces Hosting",
      "Inference Endpoints",
      "Datasets Hub",
    ],
    commonErrorCodes: [
      "502 Bad Gateway",
      "503 Model Loading",
      "504 Gateway Timeout",
    ],
    troubleshootingSteps: [
      "Check local HF cache.",
      "Verify token permissions on huggingface.co.",
    ],
    relatedServices: ["replicate", "together-ai", "github"],
  },
  {
    slug: "mistral-ai",
    name: "Mistral AI",
    category: "ai-ml",
    domain: "api.mistral.ai",
    officialStatusUrl: "https://status.mistral.ai",
    description:
      "European AI lab providing Mistral Large, Codestral, and Pixtral developer APIs.",
    impactSummary:
      "Codestral completion in IDE extensions fails, Mistral Large API calls return 500s.",
    keyComponents: [
      "La Plateforme API",
      "Le Chat Web",
      "Codestral IDE Endpoint",
      "Embeddings",
    ],
    commonErrorCodes: [
      "500 Internal Server Error",
      "429 Rate Limit",
      "502 Bad Gateway",
    ],
    troubleshootingSteps: [
      "Check status.mistral.ai.",
      "Switch to self-hosted Ollama / vLLM fallback.",
    ],
    relatedServices: ["openai", "anthropic", "groq", "cohere"],
  },
  {
    slug: "replicate",
    name: "Replicate",
    category: "ai-ml",
    domain: "api.replicate.com",
    officialStatusUrl: "https://status.replicate.com",
    description: "Run open-source machine learning models with a cloud API.",
    impactSummary:
      "Model cold boots hang, batch predictions time out, image generation pipelines halt.",
    keyComponents: [
      "Predictions API",
      "Cog Container Runtime",
      "Hardware Autoscaler",
      "Webhook Dispatch",
    ],
    commonErrorCodes: [
      "504 Prediction Timeout",
      "500 Worker Error",
      "429 Quota Exceeded",
    ],
    troubleshootingSteps: [
      "Check model hardware availability.",
      "Switch to Fal.ai or self-hosted GPU node.",
    ],
    relatedServices: ["fal-ai", "hugging-face", "together-ai", "runpod"],
  },
  {
    slug: "elevenlabs",
    name: "ElevenLabs",
    category: "ai-ml",
    domain: "api.elevenlabs.io",
    officialStatusUrl: "https://status.elevenlabs.io",
    description:
      "AI voice generation, text-to-speech, and conversational voice agents.",
    impactSummary:
      "Real-time voice synthesis stutters, audio streaming drops, conversational bots go silent.",
    keyComponents: [
      "TTS Streaming API",
      "Voice Cloning Engine",
      "Conversational AI WebSocket",
      "Voice Library",
    ],
    commonErrorCodes: [
      "500 Internal Error",
      "503 Service Unavailable",
      "WebSocket Disconnected",
    ],
    troubleshootingSteps: [
      "Check status.elevenlabs.io.",
      "Test pre-buffered audio assets as fallback.",
    ],
    relatedServices: ["openai", "deepgram", "assemblyai"],
  },
  {
    slug: "pinecone",
    name: "Pinecone",
    category: "ai-ml",
    domain: "pinecone.io",
    officialStatusUrl: "https://status.pinecone.io",
    description:
      "Managed vector database for high-scale semantic search and RAG pipelines.",
    impactSummary:
      "Vector index queries time out, document chunk ingestion queues block, RAG retrieval fails.",
    keyComponents: [
      "Serverless Vector Index",
      "Pod-based Indexes",
      "Control Plane API",
      "Upsert Pipeline",
    ],
    commonErrorCodes: [
      "504 Gateway Timeout",
      "503 Unavailable",
      "429 Namespace Quota",
    ],
    troubleshootingSteps: [
      "Check status.pinecone.io index regions.",
      "Inspect query top_k parameter.",
    ],
    relatedServices: ["qdrant", "weaviate", "supabase", "openai"],
  },
  {
    slug: "qdrant",
    name: "Qdrant Cloud",
    category: "ai-ml",
    domain: "qdrant.tech",
    officialStatusUrl: "https://status.qdrant.io",
    description: "Vector search engine and managed vector database cloud.",
    impactSummary:
      "Vector similarity search fails, neural search clusters drop connections.",
    keyComponents: [
      "Managed Clusters",
      "gRPC / REST Endpoints",
      "Snapshot Backup",
      "Payload Index",
    ],
    commonErrorCodes: [
      "503 Service Unavailable",
      "gRPC UNAVAILABLE",
      "504 Timeout",
    ],
    troubleshootingSteps: [
      "Check cluster health metrics.",
      "Test local memory limits on collection.",
    ],
    relatedServices: ["pinecone", "weaviate", "chroma"],
  },
  {
    slug: "weaviate",
    name: "Weaviate Cloud",
    category: "ai-ml",
    domain: "weaviate.io",
    officialStatusUrl: "https://status.weaviate.io",
    description:
      "Open-source and cloud vector database with hybrid search and generative modules.",
    impactSummary:
      "Hybrid keyword/vector search requests fail, GraphQL query endpoint errors.",
    keyComponents: [
      "Weaviate Cloud Services",
      "Hybrid Search Engine",
      "Vector Ingestion",
      "Backup Service",
    ],
    commonErrorCodes: ["500 Internal Error", "504 Gateway Timeout"],
    troubleshootingSteps: [
      "Check cluster memory usage.",
      "Verify GraphQL query syntax.",
    ],
    relatedServices: ["pinecone", "qdrant"],
  },
  {
    slug: "cohere",
    name: "Cohere",
    category: "ai-ml",
    domain: "api.cohere.com",
    officialStatusUrl: "https://status.cohere.com",
    description:
      "Enterprise AI platform for Command R+, reranking, and multilingual embeddings.",
    impactSummary:
      "Search reranking fails, Command R+ completions return 500s.",
    keyComponents: [
      "Rerank API",
      "Embeddings Multilingual API",
      "Command R+ Generation",
      "Fine-Tuning",
    ],
    commonErrorCodes: ["500 Server Error", "429 Rate Limit", "503 Overloaded"],
    troubleshootingSteps: [
      "Check status page.",
      "Fallback to local cross-encoder model.",
    ],
    relatedServices: ["openai", "anthropic", "pinecone"],
  },
  {
    slug: "together-ai",
    name: "Together AI",
    category: "ai-ml",
    domain: "api.together.xyz",
    officialStatusUrl: "https://status.together.ai",
    description:
      "Cloud platform for fast open-source model inference and fine-tuning.",
    impactSummary: "Llama 3 and Flux.1 generation requests fail or return 503.",
    keyComponents: [
      "Inference API",
      "Dedicated GPU Endpoints",
      "Fine-Tuning Clusters",
    ],
    commonErrorCodes: ["503 Unavailable", "504 Timeout", "429 Rate Limit"],
    troubleshootingSteps: [
      "Check GPU cluster availability.",
      "Switch to Groq or Fireworks.",
    ],
    relatedServices: ["groq", "fireworks-ai", "replicate"],
  },
  {
    slug: "fireworks-ai",
    name: "Fireworks AI",
    category: "ai-ml",
    domain: "api.fireworks.ai",
    officialStatusUrl: "https://status.fireworks.ai",
    description:
      "Fast production inference platform for multimodal and open-source models.",
    impactSummary: "Function calling and streaming completions time out.",
    keyComponents: [
      "Fast Inference Engine",
      "Speculative Decoding",
      "LoRA Serving",
    ],
    commonErrorCodes: ["503 Service Unavailable", "504 Gateway Timeout"],
    troubleshootingSteps: [
      "Check status.fireworks.ai.",
      "Switch to fallback inference provider.",
    ],
    relatedServices: ["together-ai", "groq", "openai"],
  },
  {
    slug: "deepinfra",
    name: "DeepInfra",
    category: "ai-ml",
    domain: "api.deepinfra.com",
    officialStatusUrl: "https://status.deepinfra.com",
    description:
      "Scalable serverless AI inference infrastructure for LLMs and speech models.",
    impactSummary:
      "Whisper audio transcription and LLM responses return 500 errors.",
    keyComponents: [
      "Serverless Inference",
      "Whisper Speech-to-Text",
      "Text-to-Image",
    ],
    commonErrorCodes: ["500 Internal Error", "502 Bad Gateway"],
    troubleshootingSteps: [
      "Check endpoint latency.",
      "Verify account credit balance.",
    ],
    relatedServices: ["groq", "together-ai"],
  },
  {
    slug: "fal-ai",
    name: "Fal.ai",
    category: "ai-ml",
    domain: "fal.ai",
    officialStatusUrl: "https://status.fal.ai",
    description:
      "Lightning-fast generative media inference platform for image, video, and audio models.",
    impactSummary:
      "Real-time Flux image generations fail and WebSocket pipelines disconnect.",
    keyComponents: [
      "Real-Time Inference",
      "WebSocket Streaming",
      "Queue System",
    ],
    commonErrorCodes: ["500 Internal Error", "504 Gateway Timeout"],
    troubleshootingSteps: [
      "Check queue latency on fal.ai/status.",
      "Switch to Replicate.",
    ],
    relatedServices: ["replicate", "stability-ai"],
  },
  {
    slug: "stability-ai",
    name: "Stability AI",
    category: "ai-ml",
    domain: "api.stability.ai",
    officialStatusUrl: "https://status.stability.ai",
    description:
      "Stable Diffusion 3.5, Stable Video, and SDXL API generation platform.",
    impactSummary:
      "Image synthesis requests fail and credit deductions desynchronize.",
    keyComponents: [
      "REST Generation API",
      "Stable Diffusion 3 API",
      "Inpainting Engine",
    ],
    commonErrorCodes: [
      "500 Server Error",
      "400 Invalid Prompt Filter",
      "503 Capacity",
    ],
    troubleshootingSteps: [
      "Check status.stability.ai.",
      "Switch to Fal.ai Flux endpoint.",
    ],
    relatedServices: ["midjourney", "fal-ai", "replicate"],
  },
  {
    slug: "deepgram",
    name: "Deepgram",
    category: "ai-ml",
    domain: "api.deepgram.com",
    officialStatusUrl: "https://status.deepgram.com",
    description:
      "Real-time voice AI, automated speech recognition (Nova-2), and text-to-speech APIs.",
    impactSummary:
      "Live call transcription drops audio packets and WebSocket closes abruptly.",
    keyComponents: [
      "Live Audio WebSocket API",
      "Prerecorded Audio REST API",
      "Nova-2 Speech Engine",
      "Aura TTS",
    ],
    commonErrorCodes: [
      "1006 WebSocket Closed",
      "500 Internal Server Error",
      "504 Gateway Timeout",
    ],
    troubleshootingSteps: [
      "Check WebSocket keepalive ping/pong frames.",
      "Verify Deepgram status.",
    ],
    relatedServices: ["elevenlabs", "assemblyai", "openai"],
  },
  {
    slug: "assemblyai",
    name: "AssemblyAI",
    category: "ai-ml",
    domain: "api.assemblyai.com",
    officialStatusUrl: "https://status.assemblyai.com",
    description:
      "Speech-to-text and audio intelligence APIs for transcription and speaker diarization.",
    impactSummary:
      "Transcription queue backlogs, webhook notifications fail to dispatch.",
    keyComponents: [
      "Async Transcription Queue",
      "Streaming Real-Time API",
      "Audio Intelligence (PII Redaction)",
    ],
    commonErrorCodes: ["500 Server Error", "504 Gateway Timeout"],
    troubleshootingSteps: [
      "Check status.assemblyai.com.",
      "Check webhook receiver URL health.",
    ],
    relatedServices: ["deepgram", "elevenlabs"],
  },
  {
    slug: "langfuse",
    name: "Langfuse",
    category: "ai-ml",
    domain: "cloud.langfuse.com",
    officialStatusUrl: "https://status.langfuse.com",
    description:
      "Open source LLM engineering platform for observability, tracing, and prompt evaluation.",
    impactSummary:
      "LLM trace ingestion fails or increases latency in user-facing applications.",
    keyComponents: [
      "Trace Ingestion API",
      "Web Dashboard",
      "Prompt Management",
      "Evaluations Engine",
    ],
    commonErrorCodes: ["500 Internal Error", "504 Gateway Timeout"],
    troubleshootingSteps: [
      "Enable asynchronous non-blocking trace export in SDK.",
      "Check status.langfuse.com.",
    ],
    relatedServices: ["helicone", "langsmith"],
  },
  {
    slug: "langsmith",
    name: "LangSmith",
    category: "ai-ml",
    domain: "smith.langchain.com",
    officialStatusUrl: "https://status.langchain.com",
    description:
      "LangChain observability and evaluation platform for AI agents and chains.",
    impactSummary:
      "Agent execution traces drop, feedback collection endpoints return 500.",
    keyComponents: [
      "Trace Collector API",
      "Playground",
      "Evaluation Dataset Store",
    ],
    commonErrorCodes: ["503 Unavailable", "500 Server Error"],
    troubleshootingSteps: [
      "Check LangChain status.",
      "Disable LANGCHAIN_TRACING_V2 temporarily.",
    ],
    relatedServices: ["langfuse", "openai"],
  },
  {
    slug: "helicone",
    name: "Helicone",
    category: "ai-ml",
    domain: "helicone.ai",
    officialStatusUrl: "https://status.helicone.ai",
    description:
      "LLM proxy gateway providing logging, rate limiting, and cost tracking.",
    impactSummary:
      "AI requests proxied through oai.helicone.ai fail if the gateway encounters downtime.",
    keyComponents: [
      "Proxy Gateway",
      "Dashboard UI",
      "Prompt Cache Layer",
      "Cost Tracker",
    ],
    commonErrorCodes: ["502 Bad Gateway", "504 Gateway Timeout"],
    troubleshootingSteps: [
      "Bypass proxy by switching baseURL to api.openai.com directly.",
      "Check status.helicone.ai.",
    ],
    relatedServices: ["langfuse", "openai"],
  },
  {
    slug: "runpod",
    name: "RunPod",
    category: "ai-ml",
    domain: "runpod.io",
    officialStatusUrl: "https://status.runpod.io",
    description:
      "Cloud GPU rental and serverless endpoint platform for AI workloads.",
    impactSummary: "Serverless workers fail to scale up, GPU pods disconnect.",
    keyComponents: [
      "Serverless GPU Endpoints",
      "Pod Compute",
      "Network Storage",
      "Serverless Queue",
    ],
    commonErrorCodes: [
      "500 Internal Server Error",
      "503 No Capacity",
      "504 Execution Timeout",
    ],
    troubleshootingSteps: [
      "Check GPU capacity availability in target region.",
      "Check status.runpod.io.",
    ],
    relatedServices: ["replicate", "together-ai"],
  },
  {
    slug: "lambda-labs",
    name: "Lambda Labs Cloud",
    category: "ai-ml",
    domain: "lambdalabs.com",
    officialStatusUrl: "https://status.lambdalabs.com",
    description:
      "GPU cloud platform for deep learning training and inference on NVIDIA H100s and A100s.",
    impactSummary:
      "Instance provisioning fails, SSH tunnels drop, training cluster nodes stall.",
    keyComponents: [
      "On-Demand GPU Instances",
      "Reserved Clusters",
      "Persistent Storage",
    ],
    commonErrorCodes: ["Instance Unavailable", "SSH Connection Timeout"],
    troubleshootingSteps: [
      "Check GPU inventory status.",
      "Review instance health in Lambda Console.",
    ],
    relatedServices: ["runpod", "aws"],
  },
  {
    slug: "modal",
    name: "Modal",
    category: "ai-ml",
    domain: "modal.com",
    officialStatusUrl: "https://status.modal.com",
    description: "Serverless cloud compute for AI and Python data workloads.",
    impactSummary:
      "Modal functions fail to dispatch, container cold starts hang, web endpoints return 500.",
    keyComponents: [
      "Container Orchestration",
      "Serverless Functions",
      "Shared Volumes",
      "Cron Triggers",
    ],
    commonErrorCodes: [
      "500 Internal Server Error",
      "504 Timeout",
      "Function Execution Failed",
    ],
    troubleshootingSteps: [
      "Check modal status.",
      "Run modal app history to inspect container crashes.",
    ],
    relatedServices: ["runpod", "replicate"],
  },
  {
    slug: "cerebras",
    name: "Cerebras AI",
    category: "ai-ml",
    domain: "cerebras.ai",
    officialStatusUrl: "https://status.cerebras.ai",
    description: "Ultra-fast wafer-scale inference engine for Llama models.",
    impactSummary:
      "High-speed token streams terminate prematurely or fail on API call.",
    keyComponents: ["Wafer Scale Engine Inference", "OpenAI Compatible API"],
    commonErrorCodes: ["503 Unavailable", "500 Server Error"],
    troubleshootingSteps: [
      "Check status.cerebras.ai.",
      "Switch to Groq or SambaNova.",
    ],
    relatedServices: ["groq", "together-ai"],
  },
  {
    slug: "voyage-ai",
    name: "Voyage AI",
    category: "ai-ml",
    domain: "api.voyageai.com",
    officialStatusUrl: "https://status.voyageai.com",
    description:
      "State-of-the-art embedding and reranker models optimized for finance, code, and legal RAG.",
    impactSummary:
      "Embedding vector generation errors, breaking document search.",
    keyComponents: ["Embedding API", "Reranker API", "Batch Processing"],
    commonErrorCodes: ["500 Internal Error", "429 Rate Limit"],
    troubleshootingSteps: [
      "Check Voyage AI status.",
      "Fallback to OpenAI text-embedding-3.",
    ],
    relatedServices: ["openai", "cohere", "pinecone"],
  },
  {
    slug: "cursor",
    name: "Cursor AI",
    category: "ai-ml",
    domain: "cursor.com",
    officialStatusUrl: "https://status.cursor.com",
    description:
      "AI-first code editor with codebase indexing, Composer, and inline generation.",
    impactSummary:
      "Composer AI generation hangs, tab completions stall, codebase indexing disconnects.",
    keyComponents: [
      "Composer AI",
      "Codebase Indexing Engine",
      "Copilot Auto-Complete",
      "Authentication",
    ],
    commonErrorCodes: [
      "503 Service Overloaded",
      "Connection Refused",
      "500 Server Error",
    ],
    troubleshootingSteps: [
      "Check status.cursor.com.",
      "Toggle between Claude 3.5 Sonnet and GPT-4o models in Cursor settings.",
    ],
    relatedServices: ["github", "anthropic", "openai"],
    featured: true,
  },
  {
    slug: "v0-dev",
    name: "v0 by Vercel",
    category: "ai-ml",
    domain: "v0.dev",
    officialStatusUrl: "https://status.vercel.com",
    description:
      "Generative UI system that produces React, Tailwind CSS, and shadcn/ui components.",
    impactSummary:
      "Prompt component generation fails, chat sessions disconnect, code export errors.",
    keyComponents: ["Generative UI Engine", "Live Sandboxes", "Figma Importer"],
    commonErrorCodes: ["500 Server Error", "504 Gateway Timeout"],
    troubleshootingSteps: [
      "Check Vercel status page.",
      "Refresh browser session.",
    ],
    relatedServices: ["vercel", "openai"],
  },
  {
    slug: "poe",
    name: "Poe by Quora",
    category: "ai-ml",
    domain: "poe.com",
    officialStatusUrl: "https://status.poe.com",
    description: "Multi-bot AI platform and developer bot creation ecosystem.",
    impactSummary:
      "Server bot webhooks fail, message generation loops endlessly.",
    keyComponents: ["Bot Server Protocol", "Web Chat", "API Subscriptions"],
    commonErrorCodes: ["500 Server Error", "502 Bad Gateway"],
    troubleshootingSteps: [
      "Check bot webhook server health.",
      "Check Poe status.",
    ],
    relatedServices: ["openai", "anthropic"],
  },
  {
    slug: "character-ai",
    name: "Character.AI",
    category: "ai-ml",
    domain: "character.ai",
    officialStatusUrl: "https://status.character.ai",
    description:
      "Neural language model chatbot platform for interactive personas.",
    impactSummary:
      "Chat waiting rooms trigger, character replies stall, mobile app shows connection error.",
    keyComponents: [
      "Waiting Room Queue",
      "Persona Inference Engine",
      "Voice Call Feature",
    ],
    commonErrorCodes: ["503 Waiting Room", "500 Internal Server Error"],
    troubleshootingSteps: [
      "Check status.character.ai.",
      "Clear browser cache.",
    ],
    relatedServices: ["openai", "elevenlabs"],
  },
  {
    slug: "weights-and-biases",
    name: "Weights & Biases",
    category: "ai-ml",
    domain: "wandb.ai",
    officialStatusUrl: "https://status.wandb.ai",
    description:
      "MLOps platform for experiment tracking, model registry, and dataset versioning.",
    impactSummary:
      "Training run metric logging fails or crashes active training scripts if synchronous.",
    keyComponents: [
      "Run Metrics Ingestion",
      "Model Registry",
      "Artifacts Storage",
      "W&B Weave",
    ],
    commonErrorCodes: [
      "500 Internal Server Error",
      "502 Bad Gateway",
      "Network Timeout",
    ],
    troubleshootingSteps: [
      "Set WANDB_MODE=offline in training scripts.",
      "Sync runs later with wandb sync.",
    ],
    relatedServices: ["hugging-face", "github"],
  },
  {
    slug: "scale-ai",
    name: "Scale AI",
    category: "ai-ml",
    domain: "scale.com",
    officialStatusUrl: "https://status.scale.com",
    description:
      "Data annotation, RLHF evaluation, and Enterprise GenAI platform.",
    impactSummary:
      "Task ingestion APIs error, dataset validation workflows freeze.",
    keyComponents: [
      "Data Annotation Pipeline",
      "Scale GenAI Platform",
      "Evaluation Studio",
    ],
    commonErrorCodes: ["500 Server Error", "504 Timeout"],
    troubleshootingSteps: [
      "Check status.scale.com.",
      "Queue data export batches.",
    ],
    relatedServices: ["openai", "hugging-face"],
  },
  {
    slug: "tavily",
    name: "Tavily Search API",
    category: "ai-ml",
    domain: "tavily.com",
    officialStatusUrl: "https://status.tavily.com",
    description:
      "Search engine API purpose-built for AI agents, RAG, and LLM web retrieval.",
    impactSummary:
      "Agent internet browsing tools fail, live factual search queries return empty results.",
    keyComponents: ["Search API", "Extract API", "Reranking Engine"],
    commonErrorCodes: ["500 Server Error", "429 Rate Limit Exceeded"],
    troubleshootingSteps: [
      "Check Tavily API status.",
      "Switch to Serper or Exa fallback.",
    ],
    relatedServices: ["perplexity", "openai"],
  },
  {
    slug: "aws",
    name: "Amazon Web Services (AWS)",
    category: "cloud-infra",
    domain: "aws.amazon.com",
    officialStatusUrl: "https://health.aws.amazon.com/health/status",
    description:
      "Comprehensive cloud platform covering EC2, S3, Lambda, DynamoDB, CloudFront, and Route 53.",
    impactSummary:
      "us-east-1 outages take down hundreds of SaaS platforms, S3 buckets error, Lambda executions fail.",
    keyComponents: [
      "Amazon S3",
      "Amazon EC2",
      "AWS Lambda",
      "CloudFront CDN",
      "Amazon Route 53",
      "Amazon DynamoDB",
      "Amazon RDS",
    ],
    commonErrorCodes: [
      "500 Internal Error",
      "503 Service Unavailable",
      "504 Gateway Timeout",
      "RequestTimeout",
    ],
    troubleshootingSteps: [
      "Check AWS Health Dashboard for specific regional degraded events (especially us-east-1 / us-west-2).",
      "Trigger multi-region failover via Route 53 DNS routing policies.",
      "Check CloudWatch alarms and S3 read/write error metrics.",
    ],
    relatedServices: [
      "cloudflare",
      "vercel",
      "google-cloud",
      "azure",
      "datadog",
    ],
    featured: true,
  },
  {
    slug: "google-cloud",
    name: "Google Cloud Platform (GCP)",
    category: "cloud-infra",
    domain: "cloud.google.com",
    officialStatusUrl: "https://status.cloud.google.com",
    description:
      "Cloud computing suite covering Google Compute Engine, Cloud Run, GKE, BigQuery, and Cloud Storage.",
    impactSummary:
      "Cloud Run microservices fail to boot, GKE pods crash, BigQuery analytics queries error.",
    keyComponents: [
      "Google Kubernetes Engine (GKE)",
      "Cloud Run",
      "Google Cloud Storage (GCS)",
      "BigQuery",
      "Cloud SQL",
    ],
    commonErrorCodes: [
      "503 Service Unavailable",
      "500 Server Error",
      "DEADLINE_EXCEEDED",
    ],
    troubleshootingSteps: [
      "Check status.cloud.google.com.",
      "Inspect Cloud Logging in Google Cloud Console.",
    ],
    relatedServices: ["aws", "azure", "cloudflare", "vercel"],
    featured: true,
  },
  {
    slug: "azure",
    name: "Microsoft Azure",
    category: "cloud-infra",
    domain: "azure.microsoft.com",
    officialStatusUrl: "https://status.azure.com",
    description:
      "Enterprise cloud platform providing Virtual Machines, Azure App Service, AKS, Cosmos DB, and Entra ID.",
    impactSummary:
      "Entra ID authentication stalls, Azure App Services return 503, Azure SQL queries time out.",
    keyComponents: [
      "Azure Virtual Machines",
      "Azure Kubernetes Service",
      "Cosmos DB",
      "Entra ID (Azure AD)",
      "Azure DevOps",
    ],
    commonErrorCodes: [
      "503 Service Unavailable",
      "500 Internal Error",
      "RequestTimeout",
    ],
    troubleshootingSteps: [
      "Check status.azure.com and Azure Service Health in the portal.",
      "Verify subscription quotas.",
    ],
    relatedServices: ["aws", "google-cloud", "auth0"],
    featured: true,
  },
  {
    slug: "cloudflare",
    name: "Cloudflare",
    category: "cloud-infra",
    domain: "cloudflare.com",
    officialStatusUrl: "https://www.cloudflarestatus.com",
    description:
      "Global edge network providing CDN, DDoS protection, DNS, Workers, R2 storage, and Zero Trust.",
    impactSummary:
      "Websites globally show 520, 521, 522, 524 Cloudflare error pages; DNS resolution fails; Workers fail.",
    keyComponents: [
      "Edge CDN & Caching",
      "Authoritative DNS (1.1.1.1)",
      "Cloudflare Workers & Pages",
      "Cloudflare R2 Storage",
      "WAF & DDoS Mitigation",
    ],
    commonErrorCodes: [
      "Error 520: Web Server Returns Unknown Error",
      "Error 521: Web Server Is Down",
      "Error 522: Connection Timed Out",
      "Error 524: A Timeout Occurred",
    ],
    troubleshootingSteps: [
      "Check www.cloudflarestatus.com for edge data center incidents.",
      "Temporarily toggle Cloudflare proxy mode (gray cloud) to direct traffic to origin IP if origin is healthy.",
      "Review WAF block rules and rate limiting logs.",
    ],
    relatedServices: ["aws", "vercel", "fastly", "digitalocean"],
    featured: true,
  },
  {
    slug: "vercel",
    name: "Vercel",
    category: "cloud-infra",
    domain: "vercel.com",
    officialStatusUrl: "https://www.vercel-status.com",
    description:
      "Frontend cloud platform for Next.js, React, Serverless Functions, Edge Middleware, and AI SDK.",
    impactSummary:
      "Next.js applications throw 500/504 errors on Server Actions, SSR rendering hangs, deploy builds stall.",
    keyComponents: [
      "Next.js Edge Network",
      "Serverless Functions",
      "Edge Middleware",
      "Build & Deploy Pipeline",
      "Vercel Blob & KV",
    ],
    commonErrorCodes: [
      "504 GATEWAY_TIMEOUT",
      "FUNCTION_INVOCATION_FAILED",
      "500 INTERNAL_SERVER_ERROR",
      "DEPLOYMENT_BLOCKED",
    ],
    troubleshootingSteps: [
      "Check www.vercel-status.com for Edge Network or Function runtime incidents.",
      "Check Vercel Runtime Logs for uncaught exceptions in Server Components or API routes.",
      "Review Vercel Function memory allocation and execution timeout limits.",
    ],
    relatedServices: ["cloudflare", "netlify", "github", "aws", "supabase"],
    featured: true,
  },
  {
    slug: "netlify",
    name: "Netlify",
    category: "cloud-infra",
    domain: "netlify.com",
    officialStatusUrl: "https://www.netlifystatus.com",
    description:
      "Web development platform offering Jamstack hosting, serverless functions, and edge computing.",
    impactSummary:
      "Static web deployments return 502/504, build queue backlogs, form submission webhooks fail.",
    keyComponents: [
      "Edge CDN",
      "Netlify Functions",
      "Build Pipeline",
      "Netlify Forms",
    ],
    commonErrorCodes: [
      "502 Bad Gateway",
      "504 Gateway Timeout",
      "Build Failed",
    ],
    troubleshootingSteps: [
      "Check status.netlify.com.",
      "Trigger clear cache and redeploy.",
    ],
    relatedServices: ["vercel", "cloudflare", "github"],
  },
  {
    slug: "digitalocean",
    name: "DigitalOcean",
    category: "cloud-infra",
    domain: "digitalocean.com",
    officialStatusUrl: "https://status.digitalocean.com",
    description:
      "Developer cloud providing Droplets, Managed Kubernetes (DOKS), App Platform, and Spaces Object Storage.",
    impactSummary:
      "Droplet networking drops, App Platform deploys freeze, Spaces S3 API times out.",
    keyComponents: [
      "Droplets",
      "Managed Kubernetes",
      "Spaces Object Storage",
      "App Platform",
      "Managed Databases",
    ],
    commonErrorCodes: [
      "502 Bad Gateway",
      "Connection Refused",
      "504 Gateway Timeout",
    ],
    troubleshootingSteps: [
      "Check status.digitalocean.com for regional hypervisor maintenance.",
      "Reboot Droplet via DO Console.",
    ],
    relatedServices: ["linode", "hetzner", "aws", "vultr"],
  },
  {
    slug: "hetzner",
    name: "Hetzner Online",
    category: "cloud-infra",
    domain: "hetzner.com",
    officialStatusUrl: "https://status.hetzner.com",
    description:
      "High-performance European cloud servers, dedicated hardware, and storage boxes.",
    impactSummary:
      "Falkenstein/Nuremberg/Helsinki DC network loss, cloud server API unreachability.",
    keyComponents: [
      "Cloud Servers",
      "Dedicated Root Servers",
      "Storage Boxes",
      "Load Balancers",
    ],
    commonErrorCodes: [
      "Connection Timed Out",
      "502 Bad Gateway",
      "Network Unreachable",
    ],
    troubleshootingSteps: [
      "Check status.hetzner.com.",
      "Inspect Robot / Cloud Console vSwitch status.",
    ],
    relatedServices: ["digitalocean", "ovh", "aws"],
  },
  {
    slug: "fly-io",
    name: "Fly.io",
    category: "cloud-infra",
    domain: "fly.io",
    officialStatusUrl: "https://status.flyio.net",
    description:
      "Global application delivery platform running Docker containers on Firecracker microVMs at the edge.",
    impactSummary:
      "Fly machine instances crash, WireGuard private mesh drops routing, edge proxy returns 502.",
    keyComponents: [
      "Fly Machines",
      "Global Edge Proxy",
      "Fly Volumes",
      "WireGuard 6PN Mesh",
    ],
    commonErrorCodes: [
      "502 Bad Gateway (fly-proxy)",
      "503 Service Unavailable",
      "Instance OOM killed",
    ],
    troubleshootingSteps: [
      "Check status.flyio.net.",
      "Run fly status and fly logs to inspect machine crashes or OOM events.",
      "Scale up machine memory with fly scale memory.",
    ],
    relatedServices: ["railway", "render", "vercel", "aws"],
  },
  {
    slug: "railway",
    name: "Railway",
    category: "cloud-infra",
    domain: "railway.app",
    officialStatusUrl: "https://status.railway.app",
    description:
      "Modern infrastructure platform to provision databases, web apps, and cron workers without DevOps friction.",
    impactSummary:
      "Container builds fail, Postgres plugins crash, custom domain routing fails.",
    keyComponents: [
      "Build Orchestrator",
      "Volume Storage",
      "Internal Private Networking",
      "Managed Postgres/Redis",
    ],
    commonErrorCodes: [
      "502 Bad Gateway",
      "Application Crashed",
      "504 Gateway Timeout",
    ],
    troubleshootingSteps: [
      "Check status.railway.app.",
      "Check deploy logs in Railway Dashboard.",
    ],
    relatedServices: ["render", "fly-io", "vercel", "supabase"],
  },
  {
    slug: "render",
    name: "Render",
    category: "cloud-infra",
    domain: "render.com",
    officialStatusUrl: "https://status.render.com",
    description:
      "Unified cloud platform to build and run apps and sites with free SSL, global CDN, and private networks.",
    impactSummary:
      "Web services spin down and fail to wake on incoming traffic, background workers disconnect.",
    keyComponents: [
      "Web Services",
      "Background Workers",
      "Managed PostgreSQL",
      "Static Sites",
    ],
    commonErrorCodes: [
      "502 Bad Gateway",
      "503 Service Unavailable",
      "Build Timed Out",
    ],
    troubleshootingSteps: [
      "Check status.render.com.",
      "Inspect service logs and memory usage.",
    ],
    relatedServices: ["railway", "fly-io", "heroku"],
  },
  {
    slug: "heroku",
    name: "Heroku",
    category: "cloud-infra",
    domain: "heroku.com",
    officialStatusUrl: "https://status.heroku.com",
    description:
      "Cloud application platform for deploying Ruby, Node, Python, Java, and Go dynos.",
    impactSummary:
      "Dyno crashes throw H10/H12/H14 errors, Postgres connection limits exhaust, deploys fail.",
    keyComponents: [
      "Common Runtime Dynos",
      "Heroku Postgres",
      "Heroku Redis",
      "Buildpacks",
    ],
    commonErrorCodes: [
      "H10 - App crashed",
      "H12 - Request timeout",
      "H14 - No web dynos running",
      "H20 - App boot timeout",
    ],
    troubleshootingSteps: [
      "Run heroku logs --tail.",
      "Check heroku ps to verify running dyno count.",
    ],
    relatedServices: ["render", "railway", "aws"],
  },
  {
    slug: "linode",
    name: "Linode / Akamai Cloud",
    category: "cloud-infra",
    domain: "linode.com",
    officialStatusUrl: "https://status.linode.com",
    description:
      "Cloud hosting and computing provider offering virtual servers, Block Storage, and Object Storage.",
    impactSummary:
      "Compute instances lose connectivity, NodeBalancers fail health checks.",
    keyComponents: [
      "Linode Compute Instances",
      "NodeBalancers",
      "Object Storage",
      "DNS Manager",
    ],
    commonErrorCodes: ["502 Bad Gateway", "Connection Refused"],
    troubleshootingSteps: [
      "Check status.linode.com.",
      "Reboot Linode via Cloud Manager.",
    ],
    relatedServices: ["digitalocean", "vultr", "hetzner"],
  },
  {
    slug: "vultr",
    name: "Vultr",
    category: "cloud-infra",
    domain: "vultr.com",
    officialStatusUrl: "https://status.vultr.com",
    description:
      "High-performance SSD cloud compute, cloud GPU, bare metal, and block storage provider across 32 locations.",
    impactSummary:
      "BGP routing issues cause packet drop, Cloud GPU instances stall.",
    keyComponents: [
      "Cloud Compute",
      "Cloud GPU",
      "Bare Metal",
      "Vultr Kubernetes Engine",
    ],
    commonErrorCodes: ["504 Gateway Timeout", "Network Timeout"],
    troubleshootingSteps: [
      "Check status.vultr.com.",
      "Inspect console via Vultr panel.",
    ],
    relatedServices: ["digitalocean", "linode"],
  },
  {
    slug: "fastly",
    name: "Fastly",
    category: "cloud-infra",
    domain: "fastly.com",
    officialStatusUrl: "https://www.fastlystatus.com",
    description:
      "Edge cloud and CDN platform providing VCL caching, Compute@Edge, and DDoS security.",
    impactSummary:
      "Global CDN returns 503 errors, cache purging queues stall, origin shielding drops requests.",
    keyComponents: [
      "Edge CDN",
      "Compute@Edge (Wasm)",
      "Next-Gen WAF",
      "Image Optimizer",
    ],
    commonErrorCodes: [
      "503 Service Unavailable (Fastly error)",
      "504 Gateway Timeout",
    ],
    troubleshootingSteps: [
      "Check fastlystatus.com.",
      "Verify origin server responsiveness.",
    ],
    relatedServices: ["cloudflare", "aws"],
  },
  {
    slug: "akamai",
    name: "Akamai Technologies",
    category: "cloud-infra",
    domain: "akamai.com",
    officialStatusUrl: "https://www.akamaistatus.com",
    description:
      "Global content delivery network, cybersecurity, and cloud computing platform.",
    impactSummary:
      "Enterprise edge routing breaks, DDoS scrubbing centers block legitimate requests.",
    keyComponents: [
      "Edge CDN",
      "App & API Protector",
      "Enterprise DNS",
      "Cloud Computing",
    ],
    commonErrorCodes: ["Reference Error #18", "503 Service Unavailable"],
    troubleshootingSteps: [
      "Look up Akamai Error Reference string.",
      "Check akamaistatus.com.",
    ],
    relatedServices: ["cloudflare", "fastly"],
  },
  {
    slug: "deno-deploy",
    name: "Deno Deploy",
    category: "cloud-infra",
    domain: "deno.com/deploy",
    officialStatusUrl: "https://denostatus.com",
    description:
      "Globally distributed serverless JavaScript/TypeScript runtime with zero configuration.",
    impactSummary:
      "Deno KV requests fail, edge sub-hosting functions throw unhandled worker errors.",
    keyComponents: [
      "Deno Subhosting",
      "Deno KV",
      "BroadcastChannel",
      "Edge Runtime",
    ],
    commonErrorCodes: ["500 Worker Error", "504 Gateway Timeout"],
    troubleshootingSteps: [
      "Check denostatus.com.",
      "Inspect deployment logs in Deno dashboard.",
    ],
    relatedServices: ["cloudflare", "vercel"],
  },
  {
    slug: "scaleway",
    name: "Scaleway",
    category: "cloud-infra",
    domain: "scaleway.com",
    officialStatusUrl: "https://status.scaleway.com",
    description:
      "European cloud provider offering instances, serverless, managed Kubernetes, and object storage.",
    impactSummary:
      "Paris/Amsterdam data center issues, S3 bucket latency spikes.",
    keyComponents: [
      "Elastic Metal",
      "Instances",
      "Object Storage",
      "Serverless DB",
    ],
    commonErrorCodes: ["503 Unavailable", "500 Server Error"],
    troubleshootingSteps: [
      "Check status.scaleway.com.",
      "Verify API token permissions.",
    ],
    relatedServices: ["hetzner", "ovh"],
  },
  {
    slug: "ovh",
    name: "OVHcloud",
    category: "cloud-infra",
    domain: "ovhcloud.com",
    officialStatusUrl: "https://www.github.com/ovh/travaux",
    description:
      "Global hyperscale cloud provider offering dedicated servers, private cloud, and public cloud.",
    impactSummary:
      "Dedicated servers lose network routes, anti-DDoS filters trigger false drops.",
    keyComponents: [
      "Dedicated Servers",
      "Hosted Private Cloud",
      "Public Cloud",
      "VPS",
    ],
    commonErrorCodes: ["504 Gateway Timeout", "Connection Refused"],
    troubleshootingSteps: [
      "Check travaux.ovh.net.",
      "Reboot server via OVH API.",
    ],
    relatedServices: ["hetzner", "scaleway"],
  },
  {
    slug: "backblaze-b2",
    name: "Backblaze B2",
    category: "cloud-infra",
    domain: "backblaze.com",
    officialStatusUrl: "https://status.backblaze.com",
    description: "Low-cost S3-compatible cloud object storage provider.",
    impactSummary:
      "File downloads fail, S3 API file uploads return 503 service unavailable.",
    keyComponents: [
      "B2 Cloud Storage API",
      "S3 Compatible API",
      "Cloud Replication",
    ],
    commonErrorCodes: [
      "503 Service Unavailable",
      "500 Internal Error",
      "401 Unauthorized",
    ],
    troubleshootingSteps: [
      "Check status.backblaze.com.",
      "Verify application upload retry logic.",
    ],
    relatedServices: ["wasabi", "aws", "cloudflare"],
  },
  {
    slug: "wasabi",
    name: "Wasabi Hot Cloud Storage",
    category: "cloud-infra",
    domain: "wasabi.com",
    officialStatusUrl: "https://status.wasabisys.com",
    description: "High-speed S3-compatible cloud storage with no egress fees.",
    impactSummary:
      "Object bucket reads time out, backup replication runs fail.",
    keyComponents: ["S3 REST API", "Wasabi Account Console", "Direct Connect"],
    commonErrorCodes: ["503 SlowDown", "504 Gateway Timeout"],
    troubleshootingSteps: [
      "Check status.wasabisys.com.",
      "Verify endpoint URL region.",
    ],
    relatedServices: ["backblaze-b2", "aws"],
  },
  {
    slug: "oracle-cloud",
    name: "Oracle Cloud Infrastructure (OCI)",
    category: "cloud-infra",
    domain: "oracle.com/cloud",
    officialStatusUrl: "https://ocistatus.oraclecloud.com",
    description:
      "Enterprise cloud platform providing Autonomous Database, compute VMs, and bare metal.",
    impactSummary:
      "OCI compute instances fail health checks, Autonomous DB connection pool errors.",
    keyComponents: [
      "Compute VMs",
      "Autonomous Database",
      "Object Storage",
      "Virtual Cloud Networks",
    ],
    commonErrorCodes: [
      "503 Service Unavailable",
      "ORA-12170 TNS Connect Timeout",
    ],
    troubleshootingSteps: [
      "Check ocistatus.oraclecloud.com.",
      "Inspect VCN security list rules.",
    ],
    relatedServices: ["aws", "azure", "google-cloud"],
  },
  {
    slug: "alibaba-cloud",
    name: "Alibaba Cloud",
    category: "cloud-infra",
    domain: "alibabacloud.com",
    officialStatusUrl: "https://status.alibabacloud.com",
    description:
      "Cloud computing company providing ECS, OSS, PolarDB, and CDN across Asia and worldwide.",
    impactSummary:
      "Asia-Pacific traffic routing degraded, OSS object upload fails.",
    keyComponents: [
      "Elastic Compute Service (ECS)",
      "Object Storage Service (OSS)",
      "PolarDB",
      "CDN",
    ],
    commonErrorCodes: ["500 Internal Error", "502 Bad Gateway"],
    troubleshootingSteps: [
      "Check Alibaba Cloud status dashboard.",
      "Check ICP license status if in mainland China.",
    ],
    relatedServices: ["aws", "google-cloud"],
  },
  {
    slug: "ibm-cloud",
    name: "IBM Cloud",
    category: "cloud-infra",
    domain: "ibm.com/cloud",
    officialStatusUrl: "https://cloud.ibm.com/status",
    description:
      "Enterprise hybrid cloud platform offering Red Hat OpenShift, VPC compute, and IBM Cloud Satellite.",
    impactSummary:
      "OpenShift cluster nodes enter NotReady state, IAM authentication times out.",
    keyComponents: [
      "Red Hat OpenShift on IBM Cloud",
      "Cloud Object Storage",
      "VPC Virtual Servers",
    ],
    commonErrorCodes: ["503 Service Unavailable", "504 Gateway Timeout"],
    troubleshootingSteps: [
      "Check cloud.ibm.com/status.",
      "Check IBM Cloud CLI session token.",
    ],
    relatedServices: ["azure", "aws"],
  },
  {
    slug: "upcloud",
    name: "UpCloud",
    category: "cloud-infra",
    domain: "upcloud.com",
    officialStatusUrl: "https://status.upcloud.com",
    description:
      "European cloud hosting provider offering high-performance MaxIOPS storage and cloud servers.",
    impactSummary: "Storage IOPS degrades, server provisioning stalls.",
    keyComponents: [
      "Cloud Servers",
      "MaxIOPS Block Storage",
      "Managed Databases",
    ],
    commonErrorCodes: ["502 Bad Gateway", "Connection Timeout"],
    troubleshootingSteps: [
      "Check status.upcloud.com.",
      "Verify API connection credentials.",
    ],
    relatedServices: ["hetzner", "digitalocean"],
  },
  {
    slug: "bunny-net",
    name: "bunny.net",
    category: "cloud-infra",
    domain: "bunny.net",
    officialStatusUrl: "https://status.bunny.net",
    description:
      "Next-gen CDN, edge storage, DNS, and video streaming platform.",
    impactSummary:
      "Edge caching misses cause origin flood, Bunny Stream video playback fails.",
    keyComponents: [
      "Bunny CDN",
      "Bunny Storage",
      "Bunny DNS",
      "Bunny Stream Video",
    ],
    commonErrorCodes: [
      "502 Bad Gateway",
      "504 Gateway Timeout",
      "403 Forbidden",
    ],
    troubleshootingSteps: [
      "Check status.bunny.net.",
      "Purge edge pull zone cache.",
    ],
    relatedServices: ["cloudflare", "fastly"],
  },
  {
    slug: "ngrok",
    name: "ngrok",
    category: "cloud-infra",
    domain: "ngrok.com",
    officialStatusUrl: "https://status.ngrok.com",
    description:
      "Unified ingress platform providing secure tunnels, reverse proxy, API gateway, and edge load balancing.",
    impactSummary:
      "Developer tunnels disconnect (ERR_NGROK_3200), webhook testing workflows break.",
    keyComponents: [
      "Agent Tunnels",
      "Cloud Edge Ingress",
      "Custom Domains",
      "Traffic Inspector",
    ],
    commonErrorCodes: ["ERR_NGROK_3200", "ERR_NGROK_108", "502 Bad Gateway"],
    troubleshootingSteps: [
      "Check status.ngrok.com.",
      "Restart local ngrok agent with ngrok http.",
    ],
    relatedServices: ["cloudflare", "github"],
  },
  {
    slug: "localtunnel",
    name: "Localtunnel",
    category: "cloud-infra",
    domain: "localtunnel.me",
    officialStatusUrl: "https://status.localtunnel.me",
    description:
      "Exposes your localhost to the world for easy testing and sharing.",
    impactSummary:
      "Tunnels drop connections, public URLs return 504 gateway timeout.",
    keyComponents: ["Tunnel Gateway", "CLI Proxy"],
    commonErrorCodes: ["504 Gateway Timeout", "Connection Refused"],
    troubleshootingSteps: [
      "Restart tunnel client.",
      "Switch to ngrok or Cloudflare Tunnels.",
    ],
    relatedServices: ["ngrok", "cloudflare"],
  },
  {
    slug: "koyeb",
    name: "Koyeb",
    category: "cloud-infra",
    domain: "koyeb.com",
    officialStatusUrl: "https://status.koyeb.com",
    description:
      "Serverless platform to deploy full stack apps, APIs, and workers globally.",
    impactSummary: "Global edge routing errors, container scale-out fails.",
    keyComponents: [
      "MicroVM Engine",
      "Global Edge Mesh",
      "Service Deployments",
    ],
    commonErrorCodes: ["502 Bad Gateway", "500 Internal Server Error"],
    troubleshootingSteps: [
      "Check status.koyeb.com.",
      "Review instance runtime health.",
    ],
    relatedServices: ["fly-io", "railway"],
  },
  {
    slug: "northflank",
    name: "Northflank",
    category: "cloud-infra",
    domain: "northflank.com",
    officialStatusUrl: "https://status.northflank.com",
    description:
      "Developer platform to deploy Docker containers, cron jobs, and managed databases.",
    impactSummary:
      "Deployment pipelines stall, persistent volume mounts error.",
    keyComponents: [
      "Workload Orchestrator",
      "Managed Databases",
      "Pipeline Builds",
    ],
    commonErrorCodes: ["502 Bad Gateway", "503 Unavailable"],
    troubleshootingSteps: [
      "Check status.northflank.com.",
      "Inspect build logs in Northflank UI.",
    ],
    relatedServices: ["railway", "render"],
  },
  {
    slug: "seed-run",
    name: "SST / Seed",
    category: "cloud-infra",
    domain: "sst.dev",
    officialStatusUrl: "https://status.sst.dev",
    description:
      "Full-stack cloud framework to deploy modern apps on AWS and Cloudflare.",
    impactSummary:
      "Live Lambda development tunnels drop, deployment manifests fail.",
    keyComponents: ["SST Console", "Ion Deployer", "Live Lambda Engine"],
    commonErrorCodes: ["Deployment Failed", "Connection Timeout"],
    troubleshootingSteps: [
      "Check AWS CloudFormation stack state.",
      "Restart sst dev.",
    ],
    relatedServices: ["aws", "cloudflare"],
  },
  {
    slug: "sst-ion",
    name: "SST Ion",
    category: "cloud-infra",
    domain: "ion.sst.dev",
    officialStatusUrl: "https://status.sst.dev",
    description:
      "Next generation SST engine powered by Terraform and Pulumi providers.",
    impactSummary: "Infrastructure state sync fails during CI/CD deploy.",
    keyComponents: [
      "Ion Engine",
      "State Provider",
      "AWS / Cloudflare Bindings",
    ],
    commonErrorCodes: ["Provider Error", "State Lock Error"],
    troubleshootingSteps: [
      "Check provider permissions.",
      "Clear local .sst cache.",
    ],
    relatedServices: ["aws", "cloudflare"],
  },
  {
    slug: "zeabur",
    name: "Zeabur",
    category: "cloud-infra",
    domain: "zeabur.com",
    officialStatusUrl: "https://status.zeabur.com",
    description:
      "One-click deployment platform for full-stack web applications and services.",
    impactSummary: "Web apps fail to start, domain SSL generation times out.",
    keyComponents: [
      "Application Containers",
      "Managed Addons",
      "Domain Routing",
    ],
    commonErrorCodes: ["502 Bad Gateway", "500 Server Error"],
    troubleshootingSteps: [
      "Check status.zeabur.com.",
      "Redeploy project from git.",
    ],
    relatedServices: ["railway", "render"],
  },
  {
    slug: "hostinger",
    name: "Hostinger",
    category: "cloud-infra",
    domain: "hostinger.com",
    officialStatusUrl: "https://statuspage.hostinger.com",
    description: "Web hosting, VPS, and cloud hosting provider.",
    impactSummary:
      "hPanel unreachable, WordPress sites show database connection errors.",
    keyComponents: [
      "hPanel Control",
      "Cloud VPS",
      "Shared Hosting",
      "Nameservers",
    ],
    commonErrorCodes: [
      "Error Establishing a Database Connection",
      "503 Service Unavailable",
    ],
    troubleshootingSteps: [
      "Check statuspage.hostinger.com.",
      "Restart MySQL server in hPanel.",
    ],
    relatedServices: ["digitalocean", "cloudflare"],
  },
  {
    slug: "namecheap",
    name: "Namecheap",
    category: "cloud-infra",
    domain: "namecheap.com",
    officialStatusUrl: "https://www.namecheap.com/status-updates",
    description:
      "Domain name registrar, SSL certificate authority, and shared web host.",
    impactSummary:
      "DNS records stop propagating, SSL certificate renewals stall.",
    keyComponents: [
      "BasicDNS",
      "PremiumDNS",
      "SSL Reseller API",
      "cPanel Hosting",
    ],
    commonErrorCodes: ["DNS_PROBE_FINISHED_NXDOMAIN", "SSL Handshake Failed"],
    troubleshootingSteps: [
      "Check Namecheap status updates.",
      "Switch to Cloudflare DNS.",
    ],
    relatedServices: ["cloudflare", "godaddy"],
  },
  {
    slug: "godaddy",
    name: "GoDaddy",
    category: "cloud-infra",
    domain: "godaddy.com",
    officialStatusUrl: "https://status.godaddy.com",
    description:
      "Domain registrar and hosting company managing tens of millions of domains.",
    impactSummary:
      "DNS nameservers timeout, domain management dashboard unreachable.",
    keyComponents: ["Standard DNS", "Domain Portfolio API", "Hosting Manager"],
    commonErrorCodes: ["SERVFAIL", "DNS Timeout", "500 Internal Server Error"],
    troubleshootingSteps: [
      "Check status.godaddy.com.",
      "Migrate nameservers to Cloudflare or Route 53.",
    ],
    relatedServices: ["namecheap", "cloudflare"],
  },
  {
    slug: "cloudflare-pages",
    name: "Cloudflare Pages",
    category: "cloud-infra",
    domain: "pages.cloudflare.com",
    officialStatusUrl: "https://www.cloudflarestatus.com",
    description:
      "JAMstack platform for frontend developers to collaborate and deploy websites on Cloudflare edge.",
    impactSummary: "Pages builds time out, edge function routing fails.",
    keyComponents: [
      "Pages Build Engine",
      "Edge Delivery",
      "Functions Runtime",
      "Preview Deployments",
    ],
    commonErrorCodes: [
      "Error 1000: DNS points to prohibited IP",
      "520 Unknown Error",
    ],
    troubleshootingSteps: [
      "Check Cloudflare status.",
      "Retry deployment in dashboard.",
    ],
    relatedServices: ["cloudflare", "vercel", "netlify"],
  },
  {
    slug: "cloudflare-workers",
    name: "Cloudflare Workers",
    category: "cloud-infra",
    domain: "workers.cloudflare.com",
    officialStatusUrl: "https://www.cloudflarestatus.com",
    description:
      "Serverless execution environment running V8 isolates at hundreds of Cloudflare data centers.",
    impactSummary:
      "Worker scripts throw 1101 worker threw exception, subrequest limits trip, KV reads stall.",
    keyComponents: [
      "V8 Isolate Engine",
      "Workers KV",
      "Durable Objects",
      "D1 SQL Database",
      "Queues",
    ],
    commonErrorCodes: [
      "Error 1101: Worker threw exception",
      "Error 1015: Rate limited",
      "524 A timeout occurred",
    ],
    troubleshootingSteps: [
      "Inspect real-time logs with wrangler tail.",
      "Check cloudflarestatus.com.",
    ],
    relatedServices: ["cloudflare", "vercel", "aws"],
  },
  {
    slug: "aws-lambda",
    name: "AWS Lambda",
    category: "cloud-infra",
    domain: "aws.amazon.com/lambda",
    officialStatusUrl: "https://health.aws.amazon.com",
    description:
      "Serverless event-driven compute service that runs code in response to events.",
    impactSummary:
      "Concurrent executions throttle with 429, cold start latencies spike to 10+ seconds.",
    keyComponents: [
      "Execution Runtime",
      "Provisioned Concurrency",
      "Event Source Mapping",
      "Function URLs",
    ],
    commonErrorCodes: [
      "429 TooManyRequestsException",
      "500 InternalServerError",
      "Task timed out after 30.00 seconds",
    ],
    troubleshootingSteps: [
      "Check CloudWatch Lambda ConcurrentExecutions and Throttles metrics.",
      "Increase unreserved concurrency limits.",
    ],
    relatedServices: ["aws", "vercel", "cloudflare-workers"],
  },
  {
    slug: "aws-s3",
    name: "Amazon S3 (Simple Storage Service)",
    category: "cloud-infra",
    domain: "aws.amazon.com/s3",
    officialStatusUrl: "https://health.aws.amazon.com",
    description:
      "Object storage built to retrieve any amount of data from anywhere.",
    impactSummary:
      "503 SlowDown errors on heavy prefix writes, public bucket assets fail to load.",
    keyComponents: [
      "REST Object API",
      "S3 Transfer Acceleration",
      "Cross-Region Replication",
    ],
    commonErrorCodes: ["503 SlowDown", "500 InternalError", "AccessDenied"],
    troubleshootingSteps: [
      "Hash object key prefixes to distribute partitions.",
      "Check AWS Health Dashboard.",
    ],
    relatedServices: ["aws", "cloudflare", "backblaze-b2"],
  },
  {
    slug: "stripe",
    name: "Stripe",
    category: "payments-fintech",
    domain: "api.stripe.com",
    officialStatusUrl: "https://status.stripe.com",
    apiEndpoint: "https://api.stripe.com/v1/charges",
    description:
      "Financial infrastructure for the internet. Payment processing, Billing subscriptions, Connect, and Radar.",
    impactSummary:
      "Checkout flows fail globally, subscription renewals freeze, webhook deliveries back up, card transactions drop.",
    keyComponents: [
      "Payment Intents API",
      "Checkout Sessions",
      "Webhook Dispatcher",
      "Stripe Dashboard",
      "Radar Fraud Engine",
      "Stripe Connect",
    ],
    commonErrorCodes: [
      "500 Internal Server Error",
      "502 Bad Gateway",
      "rate_limit",
      "api_connection_error",
    ],
    troubleshootingSteps: [
      "Check status.stripe.com for active payment gateway or API degradation.",
      "Check Stripe Dashboard under Developers > Webhooks to verify failed deliveries.",
      "Ensure idempotent request headers (Idempotency-Key) are used on all retry attempts.",
      "Buffer customer cart sessions locally so customers can retry when API recovers.",
    ],
    relatedServices: ["paypal", "shopify", "paddle", "lemon-squeezy", "plaid"],
    featured: true,
  },
  {
    slug: "paypal",
    name: "PayPal",
    category: "payments-fintech",
    domain: "api.paypal.com",
    officialStatusUrl: "https://www.paypal-status.com",
    description:
      "Global online payments system and digital wallet processing millions of daily transactions.",
    impactSummary:
      "PayPal checkout buttons fail to launch modal, IPN instant payment notifications drop.",
    keyComponents: [
      "Orders API v2",
      "IPN Webhook System",
      "PayPal Checkout JS SDK",
      "Braintree Gateway",
    ],
    commonErrorCodes: [
      "500 INTERNAL_SERVER_ERROR",
      "UNPROCESSABLE_ENTITY",
      "504 GATEWAY_TIMEOUT",
    ],
    troubleshootingSteps: [
      "Check paypal-status.com.",
      "Verify API access token expiration.",
    ],
    relatedServices: ["stripe", "braintree", "adyen"],
    featured: true,
  },
  {
    slug: "shopify",
    name: "Shopify",
    category: "payments-fintech",
    domain: "shopify.com",
    officialStatusUrl: "https://www.shopifystatus.com",
    description:
      "Commerce platform powering millions of online storefronts, Checkout Extensibility, and Point of Sale.",
    impactSummary:
      "Online storefronts fail to load, checkout crashes during Black Friday surges, app webhooks fail.",
    keyComponents: [
      "Storefront API",
      "Admin GraphQL API",
      "Shopify Checkout",
      "Webhooks Infrastructure",
      "Shopify POS",
    ],
    commonErrorCodes: [
      "502 Bad Gateway",
      "429 Too Many Requests (Bucket Exceeded)",
      "504 Gateway Timeout",
    ],
    troubleshootingSteps: [
      "Check www.shopifystatus.com.",
      "Inspect GraphQL API call limit cost header.",
    ],
    relatedServices: ["stripe", "paypal", "klaviyo"],
    featured: true,
  },
  {
    slug: "plaid",
    name: "Plaid",
    category: "payments-fintech",
    domain: "plaid.com",
    officialStatusUrl: "https://status.plaid.com",
    description:
      "Financial services company facilitating communication between financial apps and bank accounts.",
    impactSummary:
      "Bank account linking modal crashes, balance inquiry APIs fail, ACH transfers pause.",
    keyComponents: [
      "Plaid Link SDK",
      "Transactions API",
      "Auth / Balance API",
      "Institutions Service",
    ],
    commonErrorCodes: [
      "ITEM_LOGIN_REQUIRED",
      "INSTITUTION_DOWN",
      "500 INTERNAL_SERVER_ERROR",
    ],
    troubleshootingSteps: [
      "Check status.plaid.com for individual bank connection health (Chase, BoA, Wells Fargo).",
      "Inspect Link error codes.",
    ],
    relatedServices: ["stripe", "mercury", "brex"],
    featured: true,
  },
  {
    slug: "paddle",
    name: "Paddle",
    category: "payments-fintech",
    domain: "paddle.com",
    officialStatusUrl: "https://paddle.statuspage.io",
    description:
      "Merchant of Record platform handling global SaaS payments, tax compliance, and billing.",
    impactSummary:
      "SaaS subscriptions fail to activate, price localization webhooks drop, invoice generation errors.",
    keyComponents: [
      "Paddle Billing API",
      "Paddle.js Checkout",
      "Tax Calculation Engine",
      "Webhook Gateway",
    ],
    commonErrorCodes: ["500 Internal Error", "502 Bad Gateway"],
    troubleshootingSteps: [
      "Check paddle.statuspage.io.",
      "Verify simulation test webhooks.",
    ],
    relatedServices: ["stripe", "lemon-squeezy"],
  },
  {
    slug: "lemon-squeezy",
    name: "Lemon Squeezy",
    category: "payments-fintech",
    domain: "lemonsqueezy.com",
    officialStatusUrl: "https://status.lemonsqueezy.com",
    description:
      "Merchant of Record for digital products and SaaS software billing.",
    impactSummary:
      "Checkout overlays fail to open, license key validation APIs return 500.",
    keyComponents: [
      "Lemon.js Checkout",
      "License Key Engine",
      "Subscriptions API",
      "Affiliate Hub",
    ],
    commonErrorCodes: ["500 Internal Error", "504 Gateway Timeout"],
    troubleshootingSteps: [
      "Check status.lemonsqueezy.com.",
      "Queue license validation checks with local cache grace period.",
    ],
    relatedServices: ["stripe", "paddle"],
  },
  {
    slug: "square",
    name: "Square (Block)",
    category: "payments-fintech",
    domain: "squareup.com",
    officialStatusUrl: "https://www.issquareup.com",
    description:
      "Financial services and mobile payment company providing point-of-sale and developer payment APIs.",
    impactSummary:
      "In-person terminal payments drop offline, Web Payments SDK tokenization fails.",
    keyComponents: [
      "Payments API",
      "Terminal API",
      "Web Payments SDK",
      "Inventory Management",
    ],
    commonErrorCodes: [
      "GENERIC_DECLINE",
      "500 INTERNAL_SERVER_ERROR",
      "GATEWAY_TIMEOUT",
    ],
    troubleshootingSteps: [
      "Check issquareup.com.",
      "Enable offline payment mode on Square Terminal hardware.",
    ],
    relatedServices: ["stripe", "paypal", "clover"],
  },
  {
    slug: "adyen",
    name: "Adyen",
    category: "payments-fintech",
    domain: "adyen.com",
    officialStatusUrl: "https://status.adyen.com",
    description:
      "Omnichannel global payment company offering gateway, risk management, and card issuing.",
    impactSummary:
      "High-volume enterprise transactions reject, 3D Secure verification flows time out.",
    keyComponents: [
      "Checkout API",
      "3D Secure 2 Engine",
      "Customer Area Portal",
      "POS Terminals",
    ],
    commonErrorCodes: ["HTTP 500", "Refused - 3D Secure error"],
    troubleshootingSteps: [
      "Check status.adyen.com.",
      "Review HMAC signature in notification webhooks.",
    ],
    relatedServices: ["stripe", "paypal"],
  },
  {
    slug: "braintree",
    name: "Braintree Payments",
    category: "payments-fintech",
    domain: "braintreepayments.com",
    officialStatusUrl: "https://status.braintreepayments.com",
    description:
      "PayPal service specializing in web and mobile payment systems for e-commerce.",
    impactSummary:
      "Credit card tokenization fails, Apple Pay / Google Pay sheets error out.",
    keyComponents: [
      "GraphQL API",
      "Drop-in UI SDK",
      "Dispute Management",
      "Fraud Protection",
    ],
    commonErrorCodes: ["500 Internal Server Error", "Gateway Rejected"],
    troubleshootingSteps: [
      "Check status.braintreepayments.com.",
      "Verify merchant account credentials.",
    ],
    relatedServices: ["paypal", "stripe"],
  },
  {
    slug: "wise",
    name: "Wise (formerly TransferWise)",
    category: "payments-fintech",
    domain: "wise.com",
    officialStatusUrl: "https://status.wise.com",
    description:
      "Cross-border international money transfer service and multi-currency account API.",
    impactSummary:
      "International payouts freeze, FX exchange rate quote API returns 500.",
    keyComponents: [
      "Payouts API",
      "Profiles API",
      "FX Rates Engine",
      "Webhooks",
    ],
    commonErrorCodes: ["500 Server Error", "429 Rate Limit"],
    troubleshootingSteps: [
      "Check status.wise.com.",
      "Verify API key certificate.",
    ],
    relatedServices: ["stripe", "revolut"],
  },
  {
    slug: "coinbase",
    name: "Coinbase API",
    category: "payments-fintech",
    domain: "coinbase.com",
    officialStatusUrl: "https://status.coinbase.com",
    description: "Cryptocurrency exchange platform and developer wallet API.",
    impactSummary:
      "Crypto order placement fails, Advanced Trade WebSocket feed disconnects, crypto withdrawals pause.",
    keyComponents: [
      "Advanced Trade API",
      "Coinbase Commerce API",
      "Sign-in with Coinbase",
      "WebSocket Market Feed",
    ],
    commonErrorCodes: [
      "503 Service Unavailable",
      "500 Internal Error",
      "Rate limit exceeded",
    ],
    troubleshootingSteps: [
      "Check status.coinbase.com.",
      "Inspect WebSocket heartbeat messages.",
    ],
    relatedServices: ["binance", "stripe", "alchemy"],
  },
  {
    slug: "circle",
    name: "Circle (USDC API)",
    category: "payments-fintech",
    domain: "circle.com",
    officialStatusUrl: "https://status.circle.com",
    description:
      "Issuer of USDC and euro-backed stablecoins with programmable wallet and payout APIs.",
    impactSummary:
      "Programmable wallet transactions stall, stablecoin mint/burn APIs fail.",
    keyComponents: [
      "Programmable Wallets API",
      "Core Payouts API",
      "Cross-Chain Transfer Protocol (CCTP)",
    ],
    commonErrorCodes: ["500 Server Error", "504 Timeout"],
    troubleshootingSteps: [
      "Check status.circle.com.",
      "Inspect gas balance on target blockchain network.",
    ],
    relatedServices: ["coinbase", "infura"],
  },
  {
    slug: "brex",
    name: "Brex",
    category: "payments-fintech",
    domain: "brex.com",
    officialStatusUrl: "https://status.brex.com",
    description:
      "Corporate credit cards, spend management, and business banking platform for startups.",
    impactSummary:
      "Corporate card authorizations decline, expense export to QuickBooks/NetSuite errors.",
    keyComponents: [
      "Card Authorizations",
      "Banking API",
      "Expense Management",
      "Integrations Engine",
    ],
    commonErrorCodes: ["500 Server Error", "Connection Timeout"],
    troubleshootingSteps: [
      "Check status.brex.com.",
      "Use backup physical card or secondary corporate account.",
    ],
    relatedServices: ["ramp", "mercury", "plaid"],
  },
  {
    slug: "ramp",
    name: "Ramp",
    category: "payments-fintech",
    domain: "ramp.com",
    officialStatusUrl: "https://status.ramp.com",
    description: "Finance automation platform and corporate card company.",
    impactSummary:
      "Receipt parsing OCR halts, virtual card generation fails, accounting sync stops.",
    keyComponents: [
      "Virtual Card Issuing",
      "Accounting Sync",
      "Vendor Management",
      "AP Automation",
    ],
    commonErrorCodes: ["500 Internal Error", "502 Bad Gateway"],
    troubleshootingSteps: [
      "Check status.ramp.com.",
      "Review accounting mapping logs.",
    ],
    relatedServices: ["brex", "mercury"],
  },
  {
    slug: "mercury",
    name: "Mercury Bank",
    category: "payments-fintech",
    domain: "mercury.com",
    officialStatusUrl: "https://status.mercury.com",
    description:
      "Fintech banking platform built for startups and technology companies.",
    impactSummary:
      "Wire transfer dispatches delay, automated API payment scripts fail authentication.",
    keyComponents: [
      "Dashboard Portal",
      "Developer API",
      "Wires & ACH Pipeline",
      "Treasury Management",
    ],
    commonErrorCodes: ["500 Server Error", "504 Gateway Timeout"],
    troubleshootingSteps: [
      "Check status.mercury.com.",
      "Verify API token permissions and IP allowlist.",
    ],
    relatedServices: ["brex", "ramp", "plaid"],
  },
  {
    slug: "gusto",
    name: "Gusto",
    category: "payments-fintech",
    domain: "gusto.com",
    officialStatusUrl: "https://status.gusto.com",
    description:
      "Cloud-based payroll, benefits, and human resource management software.",
    impactSummary:
      "Direct deposit payroll runs fail, Embedded Payroll API calls error.",
    keyComponents: [
      "Embedded Payroll API",
      "Employee Onboarding",
      "Tax Filing Engine",
      "Time Tracking",
    ],
    commonErrorCodes: ["500 Internal Server Error", "422 Unprocessable Entity"],
    troubleshootingSteps: [
      "Check status.gusto.com.",
      "Review payroll run deadlines.",
    ],
    relatedServices: ["rippling", "plaid"],
  },
  {
    slug: "rippling",
    name: "Rippling",
    category: "payments-fintech",
    domain: "rippling.com",
    officialStatusUrl: "https://status.rippling.com",
    description:
      "Workforce management system unifying HR, IT, and Finance across businesses.",
    impactSummary:
      "Automated app provisioning halts, single sign-on (SSO) logins fail.",
    keyComponents: [
      "Unified HRIS",
      "IT App Provisioning",
      "Custom App API",
      "Payroll Engine",
    ],
    commonErrorCodes: ["500 Server Error", "504 Timeout"],
    troubleshootingSteps: [
      "Check status.rippling.com.",
      "Check IDP metadata config.",
    ],
    relatedServices: ["gusto", "okta"],
  },
  {
    slug: "authorize-net",
    name: "Authorize.Net",
    category: "payments-fintech",
    domain: "authorize.net",
    officialStatusUrl: "https://status.authorize.net",
    description:
      "Visa payment gateway service enabling merchants to accept credit card and electronic check payments.",
    impactSummary:
      "Legacy merchant checkout portals throw E00001 general error.",
    keyComponents: [
      "AIM / CIM API",
      "Webhooks Service",
      "Merchant Interface",
      "Fraud Detection Suite",
    ],
    commonErrorCodes: ["E00001 An error occurred", "300 Server Error"],
    troubleshootingSteps: [
      "Check status.authorize.net.",
      "Verify API Login ID and Transaction Key.",
    ],
    relatedServices: ["stripe", "paypal"],
  },
  {
    slug: "klarna",
    name: "Klarna",
    category: "payments-fintech",
    domain: "klarna.com",
    officialStatusUrl: "https://status.klarna.com",
    description:
      "Buy now, pay later (BNPL) financial services provider for online shopping.",
    impactSummary:
      "Klarna payment widgets fail to render in e-commerce checkouts.",
    keyComponents: [
      "Payments API",
      "Klarna Checkout (KCO)",
      "Order Management API",
    ],
    commonErrorCodes: ["500 Internal Server Error", "BAD_REQUEST"],
    troubleshootingSteps: [
      "Check status.klarna.com.",
      "Verify client-side SDK version.",
    ],
    relatedServices: ["afterpay", "stripe", "shopify"],
  },
  {
    slug: "afterpay",
    name: "Afterpay / Clearpay",
    category: "payments-fintech",
    domain: "afterpay.com",
    officialStatusUrl: "https://status.afterpay.com",
    description:
      "Buy now, pay later platform operating across Australia, US, UK, and Canada.",
    impactSummary:
      "Installment plan calculation errors, checkout confirmation loops.",
    keyComponents: ["Online Checkout API", "In-Store SDK", "Merchant Portal"],
    commonErrorCodes: ["500 Server Error", "504 Gateway Timeout"],
    troubleshootingSteps: [
      "Check status.afterpay.com.",
      "Inspect checkout payload parameters.",
    ],
    relatedServices: ["klarna", "square", "stripe"],
  },
  {
    slug: "revolut",
    name: "Revolut Business",
    category: "payments-fintech",
    domain: "revolut.com",
    officialStatusUrl: "https://www.revolut.com/system-status",
    description:
      "Global neo-bank providing business accounts, corporate cards, and merchant payments.",
    impactSummary:
      "Merchant API card payments fail, Open Banking API connections disconnect.",
    keyComponents: [
      "Merchant API",
      "Business Open Banking API",
      "Card Processing",
    ],
    commonErrorCodes: ["500 Internal Server Error", "401 Unauthorized"],
    troubleshootingSteps: [
      "Check Revolut system status.",
      "Refresh business API tokens.",
    ],
    relatedServices: ["wise", "stripe"],
  },
  {
    slug: "chargebee",
    name: "Chargebee",
    category: "payments-fintech",
    domain: "chargebee.com",
    officialStatusUrl: "https://status.chargebee.com",
    description:
      "Subscription billing and revenue management platform for SaaS enterprises.",
    impactSummary:
      "Subscription renewal cron cycles fail to charge, customer portal errors.",
    keyComponents: [
      "Billing Engine",
      "Hosted Checkout",
      "Revenue Recognition",
      "Webhook Pipeline",
    ],
    commonErrorCodes: ["500 Internal Server Error", "429 Rate Limit"],
    troubleshootingSteps: [
      "Check status.chargebee.com.",
      "Inspect gateway sync logs in Chargebee.",
    ],
    relatedServices: ["stripe", "paddle"],
  },
  {
    slug: "recurly",
    name: "Recurly",
    category: "payments-fintech",
    domain: "recurly.com",
    officialStatusUrl: "https://status.recurly.com",
    description:
      "Enterprise subscription management and recurring billing platform.",
    impactSummary:
      "Dunning retries stop running, invoice PDFs fail to generate.",
    keyComponents: [
      "Core Billing API",
      "Recurly.js",
      "Payment Gateway Routing",
    ],
    commonErrorCodes: ["500 Server Error", "503 Unavailable"],
    troubleshootingSteps: [
      "Check status.recurly.com.",
      "Verify API version in request header.",
    ],
    relatedServices: ["chargebee", "stripe"],
  },
  {
    slug: "github",
    name: "GitHub",
    category: "devtools-git",
    domain: "github.com",
    officialStatusUrl: "https://www.githubstatus.com",
    apiEndpoint: "https://api.github.com/zen",
    description:
      "The world's largest platform for software development, Git repositories, GitHub Actions CI/CD, and Copilot.",
    impactSummary:
      "git push and git pull commands fail, GitHub Actions workflows freeze, PR webhooks drop, Copilot completions stop.",
    keyComponents: [
      "Git Operations (SSH / HTTPS)",
      "GitHub Actions",
      "Pull Requests & Issues",
      "GitHub Copilot",
      "GitHub Packages & Container Registry",
      "GitHub Pages",
    ],
    commonErrorCodes: [
      "500 Internal Server Error",
      "504 Gateway Timeout",
      "502 Bad Gateway",
      "Connection reset by peer (SSH)",
    ],
    troubleshootingSteps: [
      "Check www.githubstatus.com for active incidents across Actions, Git Operations, and API.",
      "Switch git remote URL from HTTPS to SSH or vice versa.",
      "If GitHub Actions is down, run builds locally with act or trigger emergency deploy branch on GitLab/Bitbucket.",
      "Buffer webhook ingestion and verify failed deliveries via GitHub Webhook Settings > Recent Deliveries.",
    ],
    relatedServices: ["gitlab", "bitbucket", "docker-hub", "npm", "vercel"],
    featured: true,
  },
  {
    slug: "gitlab",
    name: "GitLab",
    category: "devtools-git",
    domain: "gitlab.com",
    officialStatusUrl: "https://status.gitlab.com",
    description:
      "DevSecOps platform delivering Git source control, CI/CD runners, and package registries.",
    impactSummary:
      "Pipeline runners stall in queued state, git clones time out over SSH, container registry fails.",
    keyComponents: [
      "GitLab CI/CD",
      "GitLab Container Registry",
      "Web Application & API",
      "Shared Runners",
    ],
    commonErrorCodes: [
      "502 Whoops, GitLab is taking too much time to respond",
      "500 Internal Server Error",
    ],
    troubleshootingSteps: [
      "Check status.gitlab.com.",
      "Run private self-hosted runner to bypass shared runner queue.",
    ],
    relatedServices: ["github", "bitbucket", "docker-hub"],
    featured: true,
  },
  {
    slug: "docker-hub",
    name: "Docker Hub",
    category: "devtools-git",
    domain: "hub.docker.com",
    officialStatusUrl: "https://www.dockerstatus.com",
    description:
      "Container image repository and registry for Docker and Kubernetes workloads.",
    impactSummary:
      "docker pull and docker build commands fail with rate limit (toomanyrequests) or 503 errors in production pipelines.",
    keyComponents: [
      "Registry Image Pull/Push",
      "Authentication API",
      "Docker Hub Web UI",
      "Automated Builds",
    ],
    commonErrorCodes: [
      "toomanyrequests: You have reached your pull rate limit",
      "503 Service Unavailable",
      "500 Internal Error",
    ],
    troubleshootingSteps: [
      "Check www.dockerstatus.com for registry outages.",
      "Mirror critical base images to GitHub Container Registry (ghcr.io) or AWS ECR.",
      "Authenticate with a Docker Hub paid account to bypass anonymous rate limits.",
    ],
    relatedServices: ["github", "aws", "gitlab"],
    featured: true,
  },
  {
    slug: "npm",
    name: "npm (Node Package Manager)",
    category: "devtools-git",
    domain: "npmjs.com",
    officialStatusUrl: "https://status.npmjs.org",
    apiEndpoint: "https://registry.npmjs.org",
    description:
      "Default package manager for Node.js and world's largest software registry.",
    impactSummary:
      "npm install, bun install, and pnpm install fail in local development and CI/CD pipelines.",
    keyComponents: [
      "Registry CouchDB API",
      "Website & Search",
      "Package Publish Pipeline",
      "2FA Login",
    ],
    commonErrorCodes: [
      "503 Service Unavailable",
      "500 Internal Server Error",
      "E404 Not Found",
      "ETIMEDOUT",
    ],
    troubleshootingSteps: [
      "Check status.npmjs.org for registry degradation.",
      "Switch registry temporarily to Cloudflare npm mirror: npm config set registry https://registry.npmjs.cf/",
      "Rely on local cache or Verdaccio private proxy.",
    ],
    relatedServices: ["pypi", "crates-io", "github"],
    featured: true,
  },
  {
    slug: "pypi",
    name: "PyPI (Python Package Index)",
    category: "devtools-git",
    domain: "pypi.org",
    officialStatusUrl: "https://status.python.org",
    description: "Official third-party software repository for Python.",
    impactSummary:
      "pip install and uv pip sync commands fail across Python deployments and Docker builds.",
    keyComponents: [
      "PyPI Simple Index",
      "Upload API (Twine)",
      "PyPI Search Engine",
    ],
    commonErrorCodes: [
      "503 Service Unavailable",
      "502 Bad Gateway",
      "HTTP 500",
    ],
    troubleshootingSteps: [
      "Check status.python.org.",
      "Use pip cache or mirror like pip install --index-url https://mirrors.aliyun.com/pypi/simple/.",
    ],
    relatedServices: ["npm", "crates-io", "docker-hub"],
    featured: true,
  },
  {
    slug: "crates-io",
    name: "Crates.io",
    category: "devtools-git",
    domain: "crates.io",
    officialStatusUrl: "https://status.crates.io",
    description: "Rust community's package registry for cargo dependencies.",
    impactSummary:
      "cargo build and cargo fetch fail to download crate dependencies.",
    keyComponents: ["Cargo Sparse Index", "Crate Download CDN", "Publish API"],
    commonErrorCodes: ["503 Service Unavailable", "failed to fetch crate"],
    troubleshootingSteps: [
      "Check status.crates.io.",
      "Verify cargo vendor cache.",
    ],
    relatedServices: ["npm", "pypi", "github"],
  },
  {
    slug: "datadog",
    name: "Datadog",
    category: "devtools-git",
    domain: "datadoghq.com",
    officialStatusUrl: "https://status.datadoghq.com",
    description:
      "Observability and security platform for cloud applications. APM, logs, metrics, and synthetic monitoring.",
    impactSummary:
      "Real-time alerts delay, APM trace ingest drops data, dashboard graphs go blank during outages.",
    keyComponents: [
      "Metric Ingestion API",
      "APM Tracing",
      "Log Management",
      "Alerting & Monitor Evaluation",
    ],
    commonErrorCodes: [
      "500 Internal Error",
      "504 Gateway Timeout",
      "Agent Forwarder Error",
    ],
    troubleshootingSteps: [
      "Check status.datadoghq.com (check us1, us3, us5, eu1 datacenter).",
      "Verify Datadog Agent buffering.",
    ],
    relatedServices: ["sentry", "new-relic", "grafana-cloud", "better-stack"],
    featured: true,
  },
  {
    slug: "sentry",
    name: "Sentry",
    category: "devtools-git",
    domain: "sentry.io",
    officialStatusUrl: "https://status.sentry.io",
    description:
      "Application performance monitoring and error tracking software for developers.",
    impactSummary:
      "Error reports drop, release health telemetry stops updating, alert notifications pause.",
    keyComponents: [
      "Relay Ingestion Pipeline",
      "Issue Stream UI",
      "Performance Monitoring",
      "Session Replay",
    ],
    commonErrorCodes: [
      "429 Too Many Requests",
      "503 Service Unavailable",
      "500 Server Error",
    ],
    troubleshootingSteps: [
      "Check status.sentry.io.",
      "Configure client-side sampleRate to reduce event volume.",
    ],
    relatedServices: ["datadog", "posthog", "better-stack"],
    featured: true,
  },
  {
    slug: "posthog",
    name: "PostHog",
    category: "devtools-git",
    domain: "posthog.com",
    officialStatusUrl: "https://status.posthog.com",
    description:
      "All-in-one product analytics, session recording, feature flags, and A/B testing suite.",
    impactSummary:
      "Feature flag evaluation falls back to defaults, analytics events queue in client memory.",
    keyComponents: [
      "Event Ingestion API",
      "Feature Flags Engine",
      "Session Recording",
      "Web Analytics",
    ],
    commonErrorCodes: [
      "500 Server Error",
      "504 Gateway Timeout",
      "429 Rate Limit",
    ],
    troubleshootingSteps: [
      "Check status.posthog.com.",
      "Ensure local feature flag defaults are configured in code.",
    ],
    relatedServices: ["mixpanel", "sentry", "segment"],
  },
  {
    slug: "better-stack",
    name: "Better Stack (Better Uptime & Logtail)",
    category: "devtools-git",
    domain: "betterstack.com",
    officialStatusUrl: "https://status.betterstack.com",
    description:
      "Uptime monitoring, incident management, on-call scheduling, and structured log management.",
    impactSummary:
      "Public status pages fail to load, on-call escalation alerts fail to trigger.",
    keyComponents: [
      "Uptime Probes",
      "Logtail Logging",
      "Status Pages",
      "Incident Escalation",
    ],
    commonErrorCodes: ["502 Bad Gateway", "500 Internal Error"],
    troubleshootingSteps: [
      "Check status.betterstack.com.",
      "Have secondary backup monitor on SteadyStack.",
    ],
    relatedServices: ["datadog", "sentry", "checkly"],
  },
  {
    slug: "checkly",
    name: "Checkly",
    category: "devtools-git",
    domain: "checklyhq.com",
    officialStatusUrl: "https://status.checklyhq.com",
    description:
      "Code-first synthetic monitoring and Playwright E2E testing platform.",
    impactSummary:
      "Synthetic checks fail to trigger, automated alert notifications drop.",
    keyComponents: [
      "Playwright Runner Nodes",
      "API Check Runtime",
      "Private Locations",
      "Alerting Pipeline",
    ],
    commonErrorCodes: ["500 Server Error", "503 Unavailable"],
    troubleshootingSteps: [
      "Check status.checklyhq.com.",
      "Run Playwright test suite locally to verify.",
    ],
    relatedServices: ["datadog", "better-stack"],
  },
  {
    slug: "circleci",
    name: "CircleCI",
    category: "devtools-git",
    domain: "circleci.com",
    officialStatusUrl: "https://status.circleci.com",
    description: "Continuous integration and continuous delivery platform.",
    impactSummary:
      "Build pipelines queue indefinitely, Docker executor spin-up hangs.",
    keyComponents: [
      "Docker / Machine Runners",
      "Pipeline API",
      "Orbs Registry",
      "Artifacts Storage",
    ],
    commonErrorCodes: ["500 Internal Server Error", "Runner Connection Failed"],
    troubleshootingSteps: [
      "Check status.circleci.com.",
      "Rerun job with SSH to diagnose.",
    ],
    relatedServices: ["github", "gitlab"],
  },
  {
    slug: "bitbucket",
    name: "Bitbucket",
    category: "devtools-git",
    domain: "bitbucket.org",
    officialStatusUrl: "https://bitbucket.status.atlassian.com",
    description: "Git code management and CI/CD solution by Atlassian.",
    impactSummary:
      "Git SSH access disconnects, Bitbucket Pipelines fail to start.",
    keyComponents: [
      "Git Hosting",
      "Bitbucket Pipelines",
      "Pull Requests",
      "Jira Integration",
    ],
    commonErrorCodes: ["500 Internal Error", "502 Bad Gateway"],
    troubleshootingSteps: [
      "Check status.atlassian.com.",
      "Verify Atlassian account token.",
    ],
    relatedServices: ["github", "gitlab", "jira"],
  },
  {
    slug: "snyk",
    name: "Snyk",
    category: "devtools-git",
    domain: "snyk.io",
    officialStatusUrl: "https://status.snyk.io",
    description:
      "Developer security platform for scanning vulnerabilities in code, dependencies, containers, and IaC.",
    impactSummary:
      "CI security gate jobs fail or block release merges with 500 error.",
    keyComponents: [
      "Snyk Open Source Scanner",
      "Snyk Container",
      "Snyk Code SAST",
      "PR Fix Bot",
    ],
    commonErrorCodes: ["500 Internal Server Error", "504 Gateway Timeout"],
    troubleshootingSteps: [
      "Check status.snyk.io.",
      "Temporarily allow non-blocking security checks in CI.",
    ],
    relatedServices: ["github", "gitlab"],
  },
  {
    slug: "sonarcloud",
    name: "SonarCloud",
    category: "devtools-git",
    domain: "sonarcloud.io",
    officialStatusUrl: "https://status.sonarcloud.io",
    description:
      "Cloud-based code quality and security analysis tool for clean code.",
    impactSummary:
      "Quality Gate checks fail on pull requests, blocking merges.",
    keyComponents: ["Analysis Engine", "Quality Gate API", "Web UI"],
    commonErrorCodes: ["500 Server Error", "Quality Gate Timed Out"],
    troubleshootingSteps: [
      "Check status.sonarcloud.io.",
      "Verify sonar-project.properties.",
    ],
    relatedServices: ["github", "gitlab"],
  },
  {
    slug: "grafana-cloud",
    name: "Grafana Cloud",
    category: "devtools-git",
    domain: "grafana.com",
    officialStatusUrl: "https://status.grafana.com",
    description:
      "Completely managed observability stack with Grafana, Prometheus (Mimir), Loki, and Tempo.",
    impactSummary:
      "Mimir metric push fails with 503, Loki log streaming stops, dashboards fail to render.",
    keyComponents: [
      "Grafana Hosted UI",
      "Prometheus / Mimir Ingest",
      "Loki Logs Ingest",
      "Tempo Traces",
    ],
    commonErrorCodes: [
      "503 Service Unavailable",
      "500 Server Error",
      "429 Rate Limit",
    ],
    troubleshootingSteps: [
      "Check status.grafana.com.",
      "Verify Prometheus remote_write buffer size.",
    ],
    relatedServices: ["datadog", "new-relic"],
  },
  {
    slug: "new-relic",
    name: "New Relic",
    category: "devtools-git",
    domain: "newrelic.com",
    officialStatusUrl: "https://status.newrelic.com",
    description:
      "Full-stack observability platform for engineers to monitor and debug their software stack.",
    impactSummary:
      "NRQL queries fail, agent data ingestion errors, alert channels do not fire.",
    keyComponents: [
      "Telemetry Data Platform",
      "APM Probes",
      "Synthetics Runner",
      "Alerts & AI",
    ],
    commonErrorCodes: ["500 Internal Server Error", "503 Service Unavailable"],
    troubleshootingSteps: [
      "Check status.newrelic.com.",
      "Inspect newrelic-agent logs on host.",
    ],
    relatedServices: ["datadog", "grafana-cloud"],
  },
  {
    slug: "segment",
    name: "Segment (Twilio Segment)",
    category: "devtools-git",
    domain: "segment.com",
    officialStatusUrl: "https://status.segment.com",
    description:
      "Customer data platform (CDP) to collect, clean, and activate customer event data.",
    impactSummary:
      "analytics.track calls drop, downstream data warehouse integrations stall.",
    keyComponents: [
      "Tracking API",
      "Destination Sync Pipelines",
      "Protocols Schema Engine",
      "Personas Identity",
    ],
    commonErrorCodes: [
      "500 Server Error",
      "504 Gateway Timeout",
      "400 Bad Request",
    ],
    troubleshootingSteps: [
      "Check status.segment.com.",
      "Verify client-side analytics.js queue buffer.",
    ],
    relatedServices: ["posthog", "mixpanel", "twilio"],
  },
  {
    slug: "mixpanel",
    name: "Mixpanel",
    category: "devtools-git",
    domain: "mixpanel.com",
    officialStatusUrl: "https://status.mixpanel.com",
    description:
      "Product analytics tool to understand user behavior, funnels, retention, and conversion.",
    impactSummary:
      "Live funnel reports fail to compute, ingestion API returns 503.",
    keyComponents: [
      "Ingestion API",
      "Reports Engine",
      "JQL / Query API",
      "Group Analytics",
    ],
    commonErrorCodes: ["503 Service Unavailable", "500 Internal Error"],
    troubleshootingSteps: [
      "Check status.mixpanel.com.",
      "Verify token and project ID.",
    ],
    relatedServices: ["posthog", "segment", "amplitude"],
  },
  {
    slug: "amplitude",
    name: "Amplitude",
    category: "devtools-git",
    domain: "amplitude.com",
    officialStatusUrl: "https://status.amplitude.com",
    description:
      "Digital analytics platform helping companies build better products through deep behavioral data.",
    impactSummary:
      "Behavioral cohort syncs fail, dashboard charts throw network error.",
    keyComponents: [
      "HTTP API v2",
      "Charts & Dashboards",
      "Experiment Engine",
      "Data Governance",
    ],
    commonErrorCodes: ["500 Server Error", "429 Too Many Requests"],
    troubleshootingSteps: [
      "Check status.amplitude.com.",
      "Inspect SDK batch buffer settings.",
    ],
    relatedServices: ["mixpanel", "posthog"],
  },
  {
    slug: "launchdarkly",
    name: "LaunchDarkly",
    category: "devtools-git",
    domain: "launchdarkly.com",
    officialStatusUrl: "https://status.launchdarkly.com",
    description:
      "Feature management platform empowering software teams to safely deliver software with feature flags.",
    impactSummary:
      "Streaming feature flag SSE connections disconnect, apps fall back to default flags.",
    keyComponents: [
      "Streaming Flag Evaluation",
      "Relay Proxy",
      "Management API",
      "Experimentation",
    ],
    commonErrorCodes: ["503 Service Unavailable", "Connection Closed"],
    troubleshootingSteps: [
      "Check status.launchdarkly.com.",
      "Verify fallback flag values in application code.",
    ],
    relatedServices: ["posthog", "statsig"],
  },
  {
    slug: "statsig",
    name: "Statsig",
    category: "devtools-git",
    domain: "statsig.com",
    officialStatusUrl: "https://status.statsig.com",
    description:
      "Modern product experimentation, feature gating, and analytics platform.",
    impactSummary:
      "Dynamic config evaluation delays, exposure events fail to log.",
    keyComponents: [
      "Feature Gates",
      "Dynamic Configs",
      "Pulse Experimentation Engine",
      "Server SDKs",
    ],
    commonErrorCodes: ["500 Server Error", "504 Gateway Timeout"],
    troubleshootingSteps: [
      "Check status.statsig.com.",
      "Ensure local bootstrap configuration is present.",
    ],
    relatedServices: ["launchdarkly", "posthog"],
  },
  {
    slug: "buildkite",
    name: "Buildkite",
    category: "devtools-git",
    domain: "buildkite.com",
    officialStatusUrl: "https://www.buildkitestatus.com",
    description:
      "Fast, secure, and scalable CI/CD platform with hybrid self-hosted runners.",
    impactSummary:
      "Build steps fail to dispatch to agent clusters, webhooks drop.",
    keyComponents: [
      "Agent Dispatcher",
      "Build Pipelines",
      "Test Analytics",
      "Package Registry",
    ],
    commonErrorCodes: ["500 Server Error", "502 Bad Gateway"],
    troubleshootingSteps: [
      "Check buildkitestatus.com.",
      "Check buildkite-agent status on worker nodes.",
    ],
    relatedServices: ["github", "gitlab"],
  },
  {
    slug: "travis-ci",
    name: "Travis CI",
    category: "devtools-git",
    domain: "travis-ci.com",
    officialStatusUrl: "https://www.traviscistatus.com",
    description:
      "Hosted continuous integration service used to build and test software projects.",
    impactSummary: "Build queues hang, VM spin-ups timeout.",
    keyComponents: ["Build Engine", "Container Runners", "macOS VM Runners"],
    commonErrorCodes: ["500 Internal Error", "Job Cancelled"],
    troubleshootingSteps: [
      "Check traviscistatus.com.",
      "Switch to GitHub Actions.",
    ],
    relatedServices: ["github", "circleci"],
  },
  {
    slug: "homebrew",
    name: "Homebrew",
    category: "devtools-git",
    domain: "brew.sh",
    officialStatusUrl: "https://status.brew.sh",
    description: "The Missing Package Manager for macOS (and Linux).",
    impactSummary:
      "brew install and brew update fail with bottle download 403/500 errors.",
    keyComponents: [
      "Bottle CDN (GHCR)",
      "Core Tap Git Repository",
      "Analytics API",
    ],
    commonErrorCodes: [
      "Error: Failed to download resource",
      "503 Service Unavailable",
    ],
    troubleshootingSteps: ["Check status.brew.sh.", "Run brew update-reset."],
    relatedServices: ["github", "docker-hub"],
  },
  {
    slug: "jsdelivr",
    name: "jsDelivr",
    category: "devtools-git",
    domain: "jsdelivr.com",
    officialStatusUrl: "https://status.jsdelivr.com",
    description:
      "Free public CDN for open-source files, npm packages, and GitHub releases.",
    impactSummary:
      "Frontend scripts loaded via cdn.jsdelivr.net fail to execute in browser.",
    keyComponents: ["NPM Multi-CDN", "GitHub Release Mirror", "Purge API"],
    commonErrorCodes: [
      "503 Service Unavailable",
      "502 Bad Gateway",
      "404 Not Found",
    ],
    troubleshootingSteps: [
      "Check status.jsdelivr.com.",
      "Switch script src to unpkg.com or bundle locally.",
    ],
    relatedServices: ["unpkg", "cloudflare"],
  },
  {
    slug: "unpkg",
    name: "unpkg",
    category: "devtools-git",
    domain: "unpkg.com",
    officialStatusUrl: "https://status.unpkg.com",
    description: "Fast, global content delivery network for everything on npm.",
    impactSummary:
      "Embedded JS libraries loaded from unpkg.com fail to resolve.",
    keyComponents: ["NPM Fetch Proxy", "Cloudflare Cache Edge"],
    commonErrorCodes: ["502 Bad Gateway", "504 Gateway Timeout"],
    troubleshootingSteps: [
      "Check status.unpkg.com.",
      "Switch to cdn.jsdelivr.net.",
    ],
    relatedServices: ["jsdelivr", "npm"],
  },
  {
    slug: "cdnjs",
    name: "cdnjs",
    category: "devtools-git",
    domain: "cdnjs.com",
    officialStatusUrl: "https://status.cdnjs.com",
    description:
      "Free and open-source CDN service trusted by over 12% of all websites.",
    impactSummary: "External stylesheets and JS libraries fail to load.",
    keyComponents: ["CDN Edge", "SRI Hash Registry", "API Catalog"],
    commonErrorCodes: ["503 Unavailable", "502 Bad Gateway"],
    troubleshootingSteps: [
      "Check status.cdnjs.com.",
      "Host dependencies locally.",
    ],
    relatedServices: ["jsdelivr", "cloudflare"],
  },
  {
    slug: "nuget",
    name: "NuGet",
    category: "devtools-git",
    domain: "nuget.org",
    officialStatusUrl: "https://status.nuget.org",
    description:
      "The package manager for .NET and Microsoft software platforms.",
    impactSummary:
      "dotnet restore and NuGet package downloads fail in C# / .NET builds.",
    keyComponents: ["V3 Package Feed", "Gallery Web UI", "Search Service"],
    commonErrorCodes: ["503 Service Unavailable", "500 Internal Server Error"],
    troubleshootingSteps: [
      "Check status.nuget.org.",
      "Verify NuGet local package cache.",
    ],
    relatedServices: ["azure", "github"],
  },
  {
    slug: "packagist",
    name: "Packagist (PHP Composer)",
    category: "devtools-git",
    domain: "packagist.org",
    officialStatusUrl: "https://status.packagist.org",
    description: "Main Composer repository for PHP packages and libraries.",
    impactSummary:
      "composer install and composer update fail across PHP / Laravel deployments.",
    keyComponents: [
      "Composer Metadata API",
      "Package Web UI",
      "GitHub Webhook Sync",
    ],
    commonErrorCodes: ["500 Server Error", "504 Timeout"],
    troubleshootingSteps: [
      "Check status.packagist.org.",
      "Use Composer mirror.",
    ],
    relatedServices: ["github", "npm"],
  },
  {
    slug: "rubygems",
    name: "RubyGems",
    category: "devtools-git",
    domain: "rubygems.org",
    officialStatusUrl: "https://status.rubygems.org",
    description: "Ruby community's gem hosting service.",
    impactSummary:
      "bundle install fails across Ruby on Rails application builds.",
    keyComponents: ["Gem Download Endpoint", "Gemfile Index", "API Push"],
    commonErrorCodes: ["503 Service Unavailable", "500 Server Error"],
    troubleshootingSteps: [
      "Check status.rubygems.org.",
      "Check bundler mirror settings.",
    ],
    relatedServices: ["github", "npm"],
  },
  {
    slug: "maven-central",
    name: "Maven Central",
    category: "devtools-git",
    domain: "central.sonatype.com",
    officialStatusUrl: "https://status.maven.org",
    description: "Repository of Java, Kotlin, and Scala open source artifacts.",
    impactSummary:
      "mvn clean install and gradle build fail to download dependencies.",
    keyComponents: ["Repository CDN", "OSSRH Staging", "Search API"],
    commonErrorCodes: ["503 Service Unavailable", "500 Internal Error"],
    troubleshootingSteps: [
      "Check status.maven.org.",
      "Configure Maven mirror repository in settings.xml.",
    ],
    relatedServices: ["github", "docker-hub"],
  },
  {
    slug: "auth0",
    name: "Auth0 by Okta",
    category: "auth-security",
    domain: "auth0.com",
    officialStatusUrl: "https://status.auth0.com",
    description:
      "Universal authentication and authorization platform for web, mobile, and legacy applications.",
    impactSummary:
      "Users cannot log in or sign up, universal login pages return 500, JWT token verification fails.",
    keyComponents: [
      "Universal Login",
      "OAuth2 / OIDC Token Endpoint",
      "Management API",
      "Auth0 Actions Runtime",
    ],
    commonErrorCodes: [
      "500 Internal Server Error",
      "504 Gateway Timeout",
      "invalid_grant",
      "access_denied",
    ],
    troubleshootingSteps: [
      "Check status.auth0.com for tenant region incidents (US, EU, AU).",
      "Inspect tenant logs in the Auth0 Dashboard under Monitoring > Logs.",
      "Check Auth0 Actions runtime timeout limits (default 20 seconds).",
    ],
    relatedServices: ["clerk", "okta", "supabase", "better-auth"],
    featured: true,
  },
  {
    slug: "clerk",
    name: "Clerk",
    category: "auth-security",
    domain: "clerk.com",
    officialStatusUrl: "https://status.clerk.com",
    description:
      "Complete user management and authentication system designed for Next.js, React, and modern full-stack.",
    impactSummary:
      "Frontend sign-in modals fail, Clerk middleware throws 500 on JWT verification, sessions drop.",
    keyComponents: [
      "Frontend SDK API",
      "Backend Verification API",
      "FAPI (Frontend API)",
      "Webhook Delivery",
    ],
    commonErrorCodes: [
      "500 Internal Server Error",
      "504 Gateway Timeout",
      "401 Unauthorized",
    ],
    troubleshootingSteps: [
      "Check status.clerk.com for API availability.",
      "Verify publishableKey and secretKey matching in environment variables.",
      "Inspect clerkMiddleware() error handling in Next.js.",
    ],
    relatedServices: ["auth0", "supabase", "workos", "better-auth"],
    featured: true,
  },
  {
    slug: "okta",
    name: "Okta",
    category: "auth-security",
    domain: "okta.com",
    officialStatusUrl: "https://status.okta.com",
    description:
      "Enterprise identity and access management (IAM) provider powering Single Sign-On (SSO) and MFA.",
    impactSummary:
      "Enterprise employees locked out of all corporate tools, SAML assertion handshakes fail.",
    keyComponents: [
      "Single Sign-On (SSO)",
      "Multi-Factor Authentication (Verify)",
      "SAML/OIDC Federation",
      "Lifecycle Management",
    ],
    commonErrorCodes: [
      "500 Internal Error",
      "HTTP 503",
      "SAML Error: Response Signature Invalid",
    ],
    troubleshootingSteps: [
      "Check status.okta.com for your specific cell (e.g. US Cell 1, EMEA Cell 1).",
      "Verify SAML certificate expiration.",
    ],
    relatedServices: ["auth0", "workos", "azure"],
    featured: true,
  },
  {
    slug: "workos",
    name: "WorkOS",
    category: "auth-security",
    domain: "workos.com",
    officialStatusUrl: "https://status.workos.com",
    description:
      "Enterprise readiness platform delivering Single Sign-On (SAML), SCIM directory sync, and User Management.",
    impactSummary:
      "Enterprise customer SSO logins fail, automated employee SCIM deprovisioning halts.",
    keyComponents: [
      "Enterprise SSO (SAML/OIDC)",
      "Directory Sync (SCIM)",
      "User Management (AuthKit)",
      "Admin Portal",
    ],
    commonErrorCodes: ["500 Internal Server Error", "504 Gateway Timeout"],
    troubleshootingSteps: [
      "Check status.workos.com.",
      "Inspect SCIM webhook logs in WorkOS Dashboard.",
    ],
    relatedServices: ["auth0", "clerk", "okta"],
  },
  {
    slug: "1password",
    name: "1Password",
    category: "auth-security",
    domain: "1password.com",
    officialStatusUrl: "https://status.1password.com",
    description:
      "Password manager and credentials security platform with CLI and Secrets Automation.",
    impactSummary:
      "1Password CLI secrets injection fails in CI/CD, browser extensions fail to autofill.",
    keyComponents: [
      "Secrets Automation Service",
      "Connect Server API",
      "Browser Extension Sync",
      "Watchtower",
    ],
    commonErrorCodes: [
      "500 Server Error",
      "503 Unavailable",
      "Connect server unreachable",
    ],
    troubleshootingSteps: [
      "Check status.1password.com.",
      "Restart 1Password Connect Docker container.",
    ],
    relatedServices: ["bitwarden", "hashicorp-vault"],
  },
  {
    slug: "bitwarden",
    name: "Bitwarden",
    category: "auth-security",
    domain: "bitwarden.com",
    officialStatusUrl: "https://status.bitwarden.com",
    description:
      "Open source password manager and secrets management platform for individuals and businesses.",
    impactSummary:
      "Vault sync fails, Bitwarden Secrets Manager CLI calls return 500.",
    keyComponents: [
      "Vault Sync API",
      "Bitwarden Secrets Manager",
      "Web Vault",
      "SSO Connector",
    ],
    commonErrorCodes: ["500 Internal Server Error", "502 Bad Gateway"],
    troubleshootingSteps: [
      "Check status.bitwarden.com.",
      "Use offline cached vault locally.",
    ],
    relatedServices: ["1password", "doppler"],
  },
  {
    slug: "hashicorp-vault",
    name: "HashiCorp HCP Vault",
    category: "auth-security",
    domain: "vaultproject.io",
    officialStatusUrl: "https://status.hashicorp.com",
    description:
      "Managed cloud secrets management, encryption as a service, and privileged access control.",
    impactSummary:
      "Microservices fail to fetch database credentials and crash on startup.",
    keyComponents: [
      "HCP Vault Clusters",
      "KV Secrets Engine",
      "Transit Encryption",
      "PKI Secrets",
    ],
    commonErrorCodes: [
      "500 Internal Error",
      "503 Vault is sealed",
      "403 Permission Denied",
    ],
    troubleshootingSteps: [
      "Check status.hashicorp.com.",
      "Verify Vault unseal state.",
    ],
    relatedServices: ["doppler", "infisical", "1password"],
  },
  {
    slug: "doppler",
    name: "Doppler",
    category: "auth-security",
    domain: "doppler.com",
    officialStatusUrl: "https://status.doppler.com",
    description:
      "Universal secrets management platform to sync secrets across environments and CI/CD.",
    impactSummary:
      "doppler run commands fail to inject environment variables, deployments fail.",
    keyComponents: [
      "Secrets API",
      "Kubernetes Operator",
      "Integrations Sync",
      "CLI Download",
    ],
    commonErrorCodes: ["500 Internal Server Error", "504 Gateway Timeout"],
    troubleshootingSteps: [
      "Check status.doppler.com.",
      "Use Doppler fallback token or cached .env.json.",
    ],
    relatedServices: ["infisical", "hashicorp-vault"],
  },
  {
    slug: "infisical",
    name: "Infisical",
    category: "auth-security",
    domain: "infisical.com",
    officialStatusUrl: "https://status.infisical.com",
    description:
      "Open source secret management platform to sync secrets across teams and infrastructure.",
    impactSummary:
      "Secrets injection fails in Docker containers and Kubernetes clusters.",
    keyComponents: [
      "Infisical Cloud API",
      "Infisical Agent",
      "Secret Rotation Engine",
    ],
    commonErrorCodes: ["500 Server Error", "502 Bad Gateway"],
    troubleshootingSteps: [
      "Check status.infisical.com.",
      "Verify Infisical Agent credentials.",
    ],
    relatedServices: ["doppler", "hashicorp-vault"],
  },
  {
    slug: "hcaptcha",
    name: "hCaptcha",
    category: "auth-security",
    domain: "hcaptcha.com",
    officialStatusUrl: "https://status.hcaptcha.com",
    description:
      "Privacy-focused bot protection, fraud prevention, and CAPTCHA service.",
    impactSummary:
      "Login and signup forms fail to submit because captcha challenges cannot load or verify.",
    keyComponents: [
      "Challenge API",
      "Siteverify Verification API",
      "Enterprise Anti-Fraud",
    ],
    commonErrorCodes: [
      "500 Server Error",
      "invalid-input-secret",
      "rate-limited",
    ],
    troubleshootingSteps: [
      "Check status.hcaptcha.com.",
      "Verify siteverify endpoint timeout tolerance.",
    ],
    relatedServices: ["recaptcha", "cloudflare"],
  },
  {
    slug: "recaptcha",
    name: "Google reCAPTCHA",
    category: "auth-security",
    domain: "google.com/recaptcha",
    officialStatusUrl: "https://status.cloud.google.com",
    description:
      "Bot defense and fraud prevention technology protecting web forms and mobile apps.",
    impactSummary:
      "reCAPTCHA v3 scores fail to return, blocking user form submissions.",
    keyComponents: [
      "reCAPTCHA Enterprise API",
      "Client JS Library",
      "Score Assessment",
    ],
    commonErrorCodes: ["500 Internal Error", "Timeout connecting to Google"],
    troubleshootingSteps: [
      "Check Google Cloud status.",
      "Verify threshold score in backend verifier.",
    ],
    relatedServices: ["hcaptcha", "cloudflare"],
  },
  {
    slug: "supabase",
    name: "Supabase",
    category: "databases-storage",
    domain: "supabase.com",
    officialStatusUrl: "https://status.supabase.com",
    description:
      "Open source Firebase alternative providing Postgres database, Auth, Storage, Edge Functions, and Realtime.",
    impactSummary:
      "Database queries timeout, Supabase Auth stops authenticating users, Storage asset uploads fail.",
    keyComponents: [
      "Postgres Database Cluster",
      "Supabase Auth (GoTrue)",
      "Storage API",
      "Edge Functions",
      "Realtime WebSockets",
      "PostgREST API",
    ],
    commonErrorCodes: [
      "500 Internal Server Error",
      "504 Gateway Timeout",
      "PGRST301 JWT expired",
      "57014 query_canceled",
    ],
    troubleshootingSteps: [
      "Check status.supabase.com for compute or storage cluster degradation.",
      "Check database connection pool exhaustion in Supabase Dashboard (PgBouncer/Supavisor).",
      "Restart database instance from the Supabase Project Settings.",
    ],
    relatedServices: ["neon", "planetscale", "firebase", "upstash", "prisma"],
    featured: true,
  },
  {
    slug: "neon",
    name: "Neon Postgres",
    category: "databases-storage",
    domain: "neon.tech",
    officialStatusUrl: "https://neonstatus.com",
    description:
      "Serverless Postgres with autoscaling, branching, and bottomless storage.",
    impactSummary:
      "Database cold starts hang, read replica branching operations fail, connection pools timeout.",
    keyComponents: [
      "Serverless Postgres Compute",
      "Storage Engine (Pageserver)",
      "Neon Connection Pooler",
      "Control Plane API",
    ],
    commonErrorCodes: [
      "500 Internal Server Error",
      "Connection Timeout",
      "Too Many Connections",
    ],
    troubleshootingSteps: [
      "Check neonstatus.com for region health.",
      "Use pooled connection string (with -pooler suffix) to avoid connection saturation.",
      "Inspect query performance and slow query logs in Neon Console.",
    ],
    relatedServices: ["supabase", "planetscale", "turso", "upstash"],
    featured: true,
  },
  {
    slug: "planetscale",
    name: "PlanetScale",
    category: "databases-storage",
    domain: "planetscale.com",
    officialStatusUrl: "https://www.planetscalestatus.com",
    description:
      "Serverless MySQL platform powered by Vitess with non-blocking schema migrations.",
    impactSummary:
      "MySQL queries return 500, deploy requests stall, schema migrations fail.",
    keyComponents: [
      "Vitess Clusters",
      "Database Branching Engine",
      "PlanetScale Connect",
      "Query Insights",
    ],
    commonErrorCodes: [
      "500 Internal Error",
      "ResourceExhausted",
      "Connection Refused",
    ],
    troubleshootingSteps: [
      "Check planetscalestatus.com.",
      "Inspect Vitess tablet health and row limit queries.",
    ],
    relatedServices: ["supabase", "neon", "turso"],
    featured: true,
  },
  {
    slug: "turso",
    name: "Turso (libSQL)",
    category: "databases-storage",
    domain: "turso.tech",
    officialStatusUrl: "https://status.turso.tech",
    description:
      "Edge database built on libSQL (open-source SQLite fork) with instant replication worldwide.",
    impactSummary:
      "Edge read replicas fail to sync, SQLite embedded queries return connection errors.",
    keyComponents: [
      "libSQL Primary Clusters",
      "Edge Read Replicas",
      "HTTP Pipeline Protocol",
      "Turso Cloud CLI",
    ],
    commonErrorCodes: ["500 Internal Server Error", "504 Gateway Timeout"],
    troubleshootingSteps: [
      "Check status.turso.tech.",
      "Verify database sync URL and auth token.",
    ],
    relatedServices: ["supabase", "neon", "upstash"],
  },
  {
    slug: "mongodb-atlas",
    name: "MongoDB Atlas",
    category: "databases-storage",
    domain: "mongodb.com/atlas",
    officialStatusUrl: "https://status.cloud.mongodb.com",
    description:
      "Fully managed multi-cloud database service for modern applications using document models.",
    impactSummary:
      "Document find/insert operations time out, Atlas search indexes freeze.",
    keyComponents: [
      "Atlas Clusters (M10+)",
      "Atlas Vector Search",
      "Atlas App Services",
      "Serverless Instances",
    ],
    commonErrorCodes: [
      "MongoServerSelectionError",
      "MongoNetworkTimeoutError",
      "500 Server Error",
    ],
    troubleshootingSteps: [
      "Check status.cloud.mongodb.com.",
      "Verify Atlas IP access list allowlist.",
    ],
    relatedServices: ["supabase", "redis-cloud", "firebase"],
    featured: true,
  },
  {
    slug: "upstash",
    name: "Upstash (Serverless Redis & QStash)",
    category: "databases-storage",
    domain: "upstash.com",
    officialStatusUrl: "https://status.upstash.com",
    description:
      "Serverless data platform offering Redis, Kafka, Vector, and QStash message queues with HTTP APIs.",
    impactSummary:
      "Rate limiting locks users out, session caching fails, asynchronous QStash job triggers drop.",
    keyComponents: [
      "Serverless Redis (REST API)",
      "QStash Message Queue",
      "Upstash Vector",
      "Upstash Kafka",
    ],
    commonErrorCodes: [
      "500 Internal Server Error",
      "429 Too Many Requests",
      "504 Gateway Timeout",
    ],
    troubleshootingSteps: [
      "Check status.upstash.com for Redis or QStash region outages.",
      "Verify UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in environment variables.",
      "Implement local memory fallback cache when Redis is unreachable.",
    ],
    relatedServices: ["redis-cloud", "supabase", "pinecone"],
    featured: true,
  },
  {
    slug: "redis-cloud",
    name: "Redis Cloud",
    category: "databases-storage",
    domain: "redis.io",
    officialStatusUrl: "https://status.redis.com",
    description:
      "Managed in-memory database service delivering sub-millisecond response times for caching and search.",
    impactSummary:
      "App cache lookups time out, pub/sub messages fail to deliver, session states drop.",
    keyComponents: [
      "In-Memory Database Engine",
      "Active-Active Geo-Distribution",
      "Redis Stack",
      "Auto-Failover",
    ],
    commonErrorCodes: [
      "LOADING Redis is loading the dataset in memory",
      "READONLY You can't write against a read only replica",
      "Connection Refused",
    ],
    troubleshootingSteps: [
      "Check status.redis.com.",
      "Review memory usage and eviction policy.",
    ],
    relatedServices: ["upstash", "mongodb-atlas"],
  },
  {
    slug: "firebase",
    name: "Google Firebase (Firestore / RTDB)",
    category: "databases-storage",
    domain: "firebase.google.com",
    officialStatusUrl: "https://status.firebase.google.com",
    description:
      "Google app development platform featuring Cloud Firestore, Realtime Database, and Cloud Functions.",
    impactSummary:
      "Firestore real-time listeners stop firing, push notifications fail to deliver, mobile logins break.",
    keyComponents: [
      "Cloud Firestore",
      "Firebase Realtime Database",
      "Firebase Cloud Messaging (FCM)",
      "Firebase Auth",
      "Cloud Functions for Firebase",
    ],
    commonErrorCodes: [
      "UNAVAILABLE: The service is currently unavailable",
      "DEADLINE_EXCEEDED",
      "RESOURCE_EXHAUSTED",
    ],
    troubleshootingSteps: [
      "Check status.firebase.google.com.",
      "Verify Firestore security rules and index definitions.",
    ],
    relatedServices: ["supabase", "google-cloud", "auth0"],
    featured: true,
  },
  {
    slug: "convex",
    name: "Convex",
    category: "databases-storage",
    domain: "convex.dev",
    officialStatusUrl: "https://status.convex.dev",
    description:
      "Reactive backend platform for app developers with automatic real-time subscriptions and ACID transactions.",
    impactSummary:
      "Real-time reactive query subscriptions freeze, mutation transactions error.",
    keyComponents: [
      "Reactive Query Engine",
      "ACID Mutation Runtime",
      "File Storage",
      "Cron Scheduler",
    ],
    commonErrorCodes: [
      "500 Internal Error",
      "WebSocket Disconnected",
      "Transaction Conflict",
    ],
    troubleshootingSteps: [
      "Check status.convex.dev.",
      "Inspect Convex dashboard function logs.",
    ],
    relatedServices: ["supabase", "firebase"],
  },
  {
    slug: "cockroachdb",
    name: "CockroachDB Cloud",
    category: "databases-storage",
    domain: "cockroachlabs.com",
    officialStatusUrl: "https://status.cockroachlabs.com",
    description:
      "Distributed SQL database engineered for global consistency and high availability.",
    impactSummary:
      "Distributed transactions time out, multi-region cluster rebalancing slows queries.",
    keyComponents: ["Serverless SQL", "Dedicated Clusters", "CDC Changefeeds"],
    commonErrorCodes: ["500 Server Error", "RetryTransactionError"],
    troubleshootingSteps: [
      "Check status.cockroachlabs.com.",
      "Inspect SQL statement execution plan.",
    ],
    relatedServices: ["supabase", "planetscale", "neon"],
  },
  {
    slug: "tidb-cloud",
    name: "TiDB Cloud",
    category: "databases-storage",
    domain: "pingcap.com",
    officialStatusUrl: "https://status.pingcap.com",
    description:
      "Fully managed Hybrid Transactional and Analytical Processing (HTAP) MySQL-compatible database.",
    impactSummary:
      "Analytical queries stall, distributed storage engine errors.",
    keyComponents: [
      "TiDB Serverless",
      "TiKV Storage Engine",
      "TiFlash Analytics",
    ],
    commonErrorCodes: ["500 Internal Error", "Connection Timeout"],
    troubleshootingSteps: [
      "Check status.pingcap.com.",
      "Review resource usage in TiDB Cloud Console.",
    ],
    relatedServices: ["planetscale", "cockroachdb"],
  },
  {
    slug: "timescale",
    name: "Timescale Cloud",
    category: "databases-storage",
    domain: "timescale.com",
    officialStatusUrl: "https://status.timescale.com",
    description:
      "Postgres cloud platform engineered for time-series, events, and vector workloads.",
    impactSummary:
      "Metric ingestion hypertypes fail to insert, continuous aggregates stall.",
    keyComponents: [
      "TimescaleDB Engine",
      "Continuous Aggregates",
      "Dynamic Compression",
    ],
    commonErrorCodes: ["500 Server Error", "504 Gateway Timeout"],
    troubleshootingSteps: [
      "Check status.timescale.com.",
      "Inspect disk space and compression jobs.",
    ],
    relatedServices: ["neon", "supabase"],
  },
  {
    slug: "aiven",
    name: "Aiven",
    category: "databases-storage",
    domain: "aiven.io",
    officialStatusUrl: "https://status.aiven.io",
    description:
      "Managed open-source data infrastructure for PostgreSQL, Apache Kafka, OpenSearch, and Redis.",
    impactSummary:
      "Kafka broker connections drop, OpenSearch indices become unqueryable.",
    keyComponents: [
      "Aiven for PostgreSQL",
      "Aiven for Apache Kafka",
      "Aiven for OpenSearch",
      "Aiven for Redis",
    ],
    commonErrorCodes: ["503 Service Unavailable", "Broker Not Available"],
    troubleshootingSteps: [
      "Check status.aiven.io.",
      "Check node maintenance schedules in Aiven Console.",
    ],
    relatedServices: ["upstash", "supabase"],
  },
  {
    slug: "uploadthing",
    name: "UploadThing",
    category: "databases-storage",
    domain: "uploadthing.com",
    officialStatusUrl: "https://status.uploadthing.com",
    description:
      "File uploads platform designed for Next.js and full-stack TypeScript developers.",
    impactSummary:
      "File upload components throw 500, asset URLs fail to resolve.",
    keyComponents: [
      "File Ingest Engine",
      "CDN Delivery",
      "Core API",
      "UTSSR SDK",
    ],
    commonErrorCodes: ["500 Internal Error", "UPLOAD_FAILED", "504 Timeout"],
    troubleshootingSteps: [
      "Check status.uploadthing.com.",
      "Verify UPLOADTHING_TOKEN in environment variables.",
    ],
    relatedServices: ["cloudinary", "aws-s3"],
  },
  {
    slug: "cloudinary",
    name: "Cloudinary",
    category: "databases-storage",
    domain: "cloudinary.com",
    officialStatusUrl: "https://status.cloudinary.com",
    description:
      "Media management platform providing automated image and video optimization, transformation, and delivery.",
    impactSummary:
      "Dynamic image transformations fail, media asset URLs return 500.",
    keyComponents: [
      "Transformation Engine",
      "Asset Upload API",
      "Global Media CDN",
      "DAM Portal",
    ],
    commonErrorCodes: [
      "500 Internal Error",
      "420 Rate Limited",
      "Resource Not Found",
    ],
    troubleshootingSteps: [
      "Check status.cloudinary.com.",
      "Verify transformation URL syntax.",
    ],
    relatedServices: ["uploadthing", "mux"],
  },
  {
    slug: "twilio",
    name: "Twilio",
    category: "comms-email",
    domain: "api.twilio.com",
    officialStatusUrl: "https://status.twilio.com",
    apiEndpoint: "https://api.twilio.com/2010-04-01/Accounts",
    description:
      "Customer engagement platform providing SMS, Voice, WhatsApp, Verify, and SendGrid email.",
    impactSummary:
      "SMS 2FA verification codes stop sending, automated voice dispatch drops calls, Webhook callbacks fail.",
    keyComponents: [
      "Programmable SMS API",
      "Programmable Voice (SIP/WebRTC)",
      "Twilio Verify API",
      "WhatsApp Business API",
      "Twilio SendGrid Email",
    ],
    commonErrorCodes: [
      "Error 20003: Authentication Error",
      "Error 30008: Unknown error",
      "HTTP 500 Internal Server Error",
      "HTTP 504 Gateway Timeout",
    ],
    troubleshootingSteps: [
      "Check status.twilio.com for carrier routing or messaging API incidents.",
      "Check Twilio Debugger logs in the Twilio Console for error code explanations.",
      "Configure fallback SMS gateway (e.g. Vonage, Telnyx, Plivo) for critical authentication flows.",
    ],
    relatedServices: ["sendgrid", "resend", "postmark", "vonage", "plivo"],
    featured: true,
  },
  {
    slug: "sendgrid",
    name: "SendGrid (Twilio SendGrid)",
    category: "comms-email",
    domain: "sendgrid.com",
    officialStatusUrl: "https://status.sendgrid.com",
    description:
      "Cloud-based customer communication platform for transactional email and marketing campaigns.",
    impactSummary:
      "Transactional emails (password resets, order receipts) fail to deliver or queue with multi-hour delays.",
    keyComponents: [
      "v3 Mail Send API",
      "Inbound Parse Webhook",
      "Event Webhooks",
      "Marketing Campaigns Engine",
    ],
    commonErrorCodes: [
      "500 Internal Server Error",
      "429 Too Many Requests",
      "401 Unauthorized",
    ],
    troubleshootingSteps: [
      "Check status.sendgrid.com for queue delivery delays.",
      "Inspect SendGrid Activity Feed for bounced or dropped emails.",
      "Have secondary transactional email provider (Resend or Postmark) configured in email fallback chain.",
    ],
    relatedServices: ["twilio", "resend", "postmark", "mailgun"],
    featured: true,
  },
  {
    slug: "resend",
    name: "Resend",
    category: "comms-email",
    domain: "resend.com",
    officialStatusUrl: "https://status.resend.com",
    description:
      "Email API for developers to send transactional emails using React Email and clean REST endpoints.",
    impactSummary:
      "Transactional emails fail to dispatch, webhook delivery notifications stall, React Email rendering errors.",
    keyComponents: [
      "Emails Send API",
      "Webhooks Dispatcher",
      "React Email Pipeline",
      "Domain Verification Engine",
    ],
    commonErrorCodes: [
      "500 Internal Server Error",
      "429 Rate Limit",
      "504 Gateway Timeout",
    ],
    troubleshootingSteps: [
      "Check status.resend.com.",
      "Verify domain DNS records (DKIM, SPF, MX) are marked verified in Resend Dashboard.",
      "Inspect API error responses in Resend Logs.",
    ],
    relatedServices: ["sendgrid", "postmark", "loops", "mailgun"],
    featured: true,
  },
  {
    slug: "postmark",
    name: "Postmark by ActiveCampaign",
    category: "comms-email",
    domain: "postmarkapp.com",
    officialStatusUrl: "https://status.postmarkapp.com",
    description:
      "High-deliverability transactional and broadcast email delivery platform.",
    impactSummary:
      "Transactional emails back up in sending queue, inbound webhook processing pauses.",
    keyComponents: [
      "REST Email API",
      "Inbound Webhook Processor",
      "SMTP Ingress",
      "Message Streams",
    ],
    commonErrorCodes: [
      "500 Internal Error",
      "422 Unprocessable Entity",
      "504 Gateway Timeout",
    ],
    troubleshootingSteps: [
      "Check status.postmarkapp.com.",
      "Verify message stream server token.",
    ],
    relatedServices: ["resend", "sendgrid", "mailgun"],
    featured: true,
  },
  {
    slug: "mailgun",
    name: "Mailgun by Sinch",
    category: "comms-email",
    domain: "mailgun.com",
    officialStatusUrl: "https://status.mailgun.com",
    description:
      "Email delivery service for developers offering REST API, email validation, and routing.",
    impactSummary:
      "Email validation checks fail, outbound messages bounce with 500 errors.",
    keyComponents: [
      "v3 Sending API",
      "Email Verification API",
      "Routes Pipeline",
      "Webhooks",
    ],
    commonErrorCodes: [
      "500 Internal Server Error",
      "429 Rate Limit",
      "401 Forbidden",
    ],
    troubleshootingSteps: [
      "Check status.mailgun.com.",
      "Verify domain region (US vs EU endpoint).",
    ],
    relatedServices: ["sendgrid", "postmark", "resend"],
  },
  {
    slug: "loops",
    name: "Loops",
    category: "comms-email",
    domain: "loops.so",
    officialStatusUrl: "https://status.loops.so",
    description:
      "Email platform built specifically for modern SaaS companies with clean API and automated loops.",
    impactSummary:
      "User onboarding drip sequences freeze, event trigger APIs return 500.",
    keyComponents: [
      "Events API",
      "Transactional API",
      "Campaigns Engine",
      "Audience Sync",
    ],
    commonErrorCodes: ["500 Internal Error", "504 Timeout"],
    troubleshootingSteps: [
      "Check status.loops.so.",
      "Inspect API event payload in Loops.",
    ],
    relatedServices: ["resend", "postmark", "customer-io"],
  },
  {
    slug: "pusher",
    name: "Pusher (Channels & Beams)",
    category: "comms-email",
    domain: "pusher.com",
    officialStatusUrl: "https://status.pusher.com",
    description:
      "Real-time communication layer providing bi-directional WebSockets (Channels) and push notifications (Beams).",
    impactSummary:
      "Live chat feeds freeze, dashboard real-time updates stop, push notifications fail.",
    keyComponents: [
      "Pusher Channels (WebSockets)",
      "Pusher Beams (Push API)",
      "Presence Channels",
    ],
    commonErrorCodes: [
      "4004 Over quota",
      "500 Internal Error",
      "WebSocket Connection Error",
    ],
    troubleshootingSteps: [
      "Check status.pusher.com.",
      "Verify cluster region code (e.g. us2, eu).",
    ],
    relatedServices: ["ably", "supabase", "socket-io"],
  },
  {
    slug: "ably",
    name: "Ably Realtime",
    category: "comms-email",
    domain: "ably.com",
    officialStatusUrl: "https://status.ably.com",
    description:
      "Enterprise real-time infrastructure platform for pub/sub messaging and live synchronization.",
    impactSummary:
      "Realtime messaging channels disconnect, presence tracking drops users.",
    keyComponents: ["Pub/Sub Channels", "Live Sync", "Chat SDK", "Spaces SDK"],
    commonErrorCodes: ["50000 Internal error", "42900 Rate limited"],
    troubleshootingSteps: [
      "Check status.ably.com.",
      "Verify API key capabilities.",
    ],
    relatedServices: ["pusher", "pubnub"],
  },
  {
    slug: "onesignal",
    name: "OneSignal",
    category: "comms-email",
    domain: "onesignal.com",
    officialStatusUrl: "https://status.onesignal.com",
    description:
      "Customer messaging and engagement platform for mobile push notifications, web push, and in-app messages.",
    impactSummary:
      "Mobile notifications fail to broadcast, user segment syncs halt.",
    keyComponents: [
      "Push Notification REST API",
      "Web Push SDK",
      "In-App Messaging Engine",
    ],
    commonErrorCodes: ["500 Internal Server Error", "429 Rate Limit"],
    troubleshootingSteps: [
      "Check status.onesignal.com.",
      "Verify APNs / FCM credentials.",
    ],
    relatedServices: ["firebase", "pusher"],
  },
  {
    slug: "vonage",
    name: "Vonage (formerly Nexmo)",
    category: "comms-email",
    domain: "vonage.com",
    officialStatusUrl: "https://status.vonage.com",
    description:
      "Global communications platform providing SMS, Voice, Video, and Verify APIs.",
    impactSummary:
      "SMS messaging routes fail, Video API WebRTC sessions disconnect.",
    keyComponents: [
      "Messages API",
      "Voice API",
      "Video API (TokBox)",
      "Verify API",
    ],
    commonErrorCodes: ["500 Internal Error", "1002 Throttle limit"],
    troubleshootingSteps: [
      "Check status.vonage.com.",
      "Inspect delivery receipts in Vonage Dashboard.",
    ],
    relatedServices: ["twilio", "telnyx", "plivo"],
  },
  {
    slug: "telnyx",
    name: "Telnyx",
    category: "comms-email",
    domain: "telnyx.com",
    officialStatusUrl: "https://status.telnyx.com",
    description:
      "Next-gen communications platform with private IP network for SMS, Voice, and Wireless IoT.",
    impactSummary: "SIP trunks disconnect, SMS messages fail carrier delivery.",
    keyComponents: [
      "Programmable SMS v2",
      "Call Control API",
      "SIP Trunking",
      "Storage API",
    ],
    commonErrorCodes: ["500 Server Error", "504 Gateway Timeout"],
    troubleshootingSteps: [
      "Check status.telnyx.com.",
      "Verify Telnyx connection profile.",
    ],
    relatedServices: ["twilio", "vonage", "plivo"],
  },
  {
    slug: "plivo",
    name: "Plivo",
    category: "comms-email",
    domain: "plivo.com",
    officialStatusUrl: "https://status.plivo.com",
    description:
      "Enterprise communications platform for SMS messaging and voice calling.",
    impactSummary: "Outbound SMS fails to queue, voice XML callbacks error.",
    keyComponents: [
      "SMS API",
      "Voice API",
      "PHLO Workflow Builder",
      "Zentrunk",
    ],
    commonErrorCodes: ["500 Internal Server Error", "400 Bad Request"],
    troubleshootingSteps: [
      "Check status.plivo.com.",
      "Inspect message UUID in Plivo logs.",
    ],
    relatedServices: ["twilio", "telnyx"],
  },
  {
    slug: "intercom",
    name: "Intercom",
    category: "comms-email",
    domain: "intercom.com",
    officialStatusUrl: "https://www.intercomstatus.com",
    description:
      "AI customer service solution featuring Fin AI Copilot, Help Desk, and proactive messaging.",
    impactSummary:
      "Customer messenger widget fails to load on websites, Fin AI bot stops answering queries.",
    keyComponents: [
      "Messenger Widget",
      "Fin AI Bot",
      "Help Desk Inbox",
      "REST API & Webhooks",
    ],
    commonErrorCodes: [
      "500 Internal Error",
      "504 Gateway Timeout",
      "429 Too Many Requests",
    ],
    troubleshootingSteps: [
      "Check www.intercomstatus.com.",
      "Verify workspace appId and identity verification.",
    ],
    relatedServices: ["zendesk", "crisp"],
    featured: true,
  },
  {
    slug: "zendesk",
    name: "Zendesk",
    category: "comms-email",
    domain: "zendesk.com",
    officialStatusUrl: "https://status.zendesk.com",
    description:
      "Customer service and engagement software with ticketing, live chat, and knowledge base.",
    impactSummary:
      "Support agent ticket views fail to load, webhook integrations fail to update tickets.",
    keyComponents: [
      "Support Ticketing API",
      "Zendesk Chat / Messaging",
      "Guide Knowledge Base",
      "Explore Analytics",
    ],
    commonErrorCodes: [
      "500 Internal Server Error",
      "502 Bad Gateway",
      "429 Too Many Requests",
    ],
    troubleshootingSteps: [
      "Check status.zendesk.com (lookup your subdomain).",
      "Verify OAuth token validity.",
    ],
    relatedServices: ["intercom", "freshdesk"],
  },
  {
    slug: "customer-io",
    name: "Customer.io",
    category: "comms-email",
    domain: "customer.io",
    officialStatusUrl: "https://status.customer.io",
    description:
      "Automated messaging platform for tech companies to trigger data-driven emails, push, and SMS.",
    impactSummary:
      "Workflow campaigns stop triggering on customer events, track API returns 500.",
    keyComponents: [
      "Track API",
      "App API",
      "Journeys Workflow Engine",
      "Data Pipelines",
    ],
    commonErrorCodes: ["500 Internal Error", "504 Gateway Timeout"],
    troubleshootingSteps: [
      "Check status.customer.io.",
      "Verify siteId and apiKey.",
    ],
    relatedServices: ["loops", "resend", "segment"],
  },
  {
    slug: "klaviyo",
    name: "Klaviyo",
    category: "comms-email",
    domain: "klaviyo.com",
    officialStatusUrl: "https://status.klaviyo.com",
    description:
      "Marketing automation platform engineered for e-commerce and retail brands.",
    impactSummary:
      "Abandoned cart flows fail to trigger, e-commerce catalog syncs stall.",
    keyComponents: [
      "Client Events API",
      "Server Events API",
      "Flows Automation Engine",
      "SMS Marketing",
    ],
    commonErrorCodes: ["500 Internal Server Error", "429 Rate Limit"],
    troubleshootingSteps: [
      "Check status.klaviyo.com.",
      "Inspect Shopify integration sync status.",
    ],
    relatedServices: ["shopify", "sendgrid"],
  },
  {
    slug: "slack",
    name: "Slack",
    category: "productivity-collab",
    domain: "slack.com",
    officialStatusUrl: "https://status.slack.com",
    apiEndpoint: "https://slack.com/api/api.test",
    description:
      "Channel-based messaging platform for enterprise collaboration, automated bots, and workflows.",
    impactSummary:
      "Messages fail to send, automated deployment alerts stop, bot webhooks return 500.",
    keyComponents: [
      "Messaging WebSocket",
      "Incoming Webhooks",
      "Slack Bot API",
      "Huddles Audio/Video",
      "Slack Connect",
    ],
    commonErrorCodes: [
      "HTTP 500 Internal Server Error",
      "HTTP 504 Gateway Timeout",
      "fatal_error",
      "ratelimited",
    ],
    troubleshootingSteps: [
      "Check status.slack.com for real-time connection issues.",
      "Check Incoming Webhook URLs for HTTP 404 or 410 (channel deleted or token revoked).",
      "Have backup communication channels (Discord or SMS) for critical P1 incident escalation.",
    ],
    relatedServices: ["discord", "linear", "notion", "jira"],
    featured: true,
  },
  {
    slug: "discord",
    name: "Discord",
    category: "productivity-collab",
    domain: "discord.com",
    officialStatusUrl: "https://discordstatus.com",
    description:
      "Voice, video, and text communication service used by communities and developers worldwide.",
    impactSummary:
      "Gateway bot connections drop, voice channels lag, webhook dispatches fail with 500.",
    keyComponents: [
      "Gateway WebSocket",
      "REST API",
      "Voice Servers (RTC)",
      "Webhooks System",
    ],
    commonErrorCodes: [
      "500 Internal Server Error",
      "502 Bad Gateway",
      "429 Rate Limit (Retry-After)",
    ],
    troubleshootingSteps: [
      "Check discordstatus.com for API and Gateway connection health.",
      "Inspect Discord bot token validity and Gateway intent permissions.",
      "Respect Retry-After headers on HTTP 429 response.",
    ],
    relatedServices: ["slack", "github", "telegram"],
    featured: true,
  },
  {
    slug: "linear",
    name: "Linear",
    category: "productivity-collab",
    domain: "linear.app",
    officialStatusUrl: "https://linearstatus.com",
    description:
      "Issue tracking and project management tool built for high-performance engineering teams.",
    impactSummary:
      "Issue sync pauses, GitHub PR auto-close integrations fail, GraphQL API returns 500.",
    keyComponents: [
      "Sync Engine",
      "GraphQL API",
      "Webhooks Dispatcher",
      "GitHub/GitLab Integrations",
    ],
    commonErrorCodes: [
      "500 Internal Server Error",
      "502 Bad Gateway",
      "504 Gateway Timeout",
    ],
    troubleshootingSteps: [
      "Check linearstatus.com for cloud sync engine state.",
      "Check Linear OAuth token permissions in workspace integrations.",
    ],
    relatedServices: ["github", "jira", "notion", "slack"],
    featured: true,
  },
  {
    slug: "notion",
    name: "Notion",
    category: "productivity-collab",
    domain: "notion.so",
    officialStatusUrl: "https://status.notion.so",
    description:
      "Connected workspace for notes, docs, databases, project management, and Notion AI.",
    impactSummary:
      "Workspace pages fail to load, database query APIs return 500, integrations stall.",
    keyComponents: [
      "Databases Engine",
      "Notion API",
      "Notion AI",
      "Sync Block Service",
    ],
    commonErrorCodes: [
      "500 Internal Server Error",
      "504 Gateway Timeout",
      "429 Rate Limited",
    ],
    troubleshootingSteps: [
      "Check status.notion.so.",
      "Inspect Notion API integration capabilities and database sharing permissions.",
    ],
    relatedServices: ["linear", "figma", "slack"],
    featured: true,
  },
  {
    slug: "figma",
    name: "Figma",
    category: "productivity-collab",
    domain: "figma.com",
    officialStatusUrl: "https://status.figma.com",
    description:
      "Collaborative interface design and prototyping tool with Dev Mode and FigJam.",
    impactSummary:
      "Multiplayer canvas sync disconnects, Dev Mode inspection errors, REST API times out.",
    keyComponents: [
      "Multiplayer Sync Engine",
      "Dev Mode",
      "REST API",
      "FigJam Whiteboard",
    ],
    commonErrorCodes: [
      "500 Internal Server Error",
      "502 Bad Gateway",
      "Connection to server lost",
    ],
    troubleshootingSteps: [
      "Check status.figma.com.",
      "Save local .fig file backup before closing tab.",
    ],
    relatedServices: ["notion", "linear", "github"],
    featured: true,
  },
  {
    slug: "jira",
    name: "Jira (Atlassian)",
    category: "productivity-collab",
    domain: "atlassian.com/software/jira",
    officialStatusUrl: "https://jira-software.status.atlassian.com",
    description:
      "Issue and project tracking software for agile software development teams.",
    impactSummary:
      "Kanban boards fail to render, automation rules fail to execute, REST API times out.",
    keyComponents: [
      "Jira Cloud API",
      "Jira Automation Rules",
      "Agile Boards",
      "Atlassian Access SSO",
    ],
    commonErrorCodes: [
      "500 Internal Server Error",
      "504 Gateway Timeout",
      "429 Rate Limit",
    ],
    troubleshootingSteps: [
      "Check status.atlassian.com.",
      "Verify API token at id.atlassian.com.",
    ],
    relatedServices: ["linear", "confluence", "bitbucket"],
    featured: true,
  },
  {
    slug: "confluence",
    name: "Confluence (Atlassian)",
    category: "productivity-collab",
    domain: "atlassian.com/software/confluence",
    officialStatusUrl: "https://confluence.status.atlassian.com",
    description:
      "Team workspace and documentation knowledge management platform.",
    impactSummary:
      "Document editor crashes, search indexing stops finding team pages.",
    keyComponents: ["Collaborative Editor", "REST Content API", "Search Index"],
    commonErrorCodes: ["500 Server Error", "502 Bad Gateway"],
    troubleshootingSteps: [
      "Check status.atlassian.com.",
      "Clear browser local storage.",
    ],
    relatedServices: ["jira", "notion"],
  },
  {
    slug: "asana",
    name: "Asana",
    category: "productivity-collab",
    domain: "asana.com",
    officialStatusUrl: "https://status.asana.com",
    description:
      "Work management platform to organize, track, and manage team workflows.",
    impactSummary: "Task updates drop, automated rules fail to move cards.",
    keyComponents: [
      "Tasks & Projects API",
      "Rules Automation Engine",
      "Portfolios",
    ],
    commonErrorCodes: ["500 Internal Server Error", "504 Gateway Timeout"],
    troubleshootingSteps: [
      "Check status.asana.com.",
      "Verify Asana personal access token.",
    ],
    relatedServices: ["monday", "trello", "jira"],
  },
  {
    slug: "monday",
    name: "Monday.com",
    category: "productivity-collab",
    domain: "monday.com",
    officialStatusUrl: "https://status.monday.com",
    description:
      "Cloud-based work operating system providing custom workflow automations.",
    impactSummary: "Workspaces fail to load, webhook integrations stop firing.",
    keyComponents: [
      "Work OS Board Engine",
      "GraphQL API",
      "Automations Runtime",
    ],
    commonErrorCodes: ["500 Server Error", "502 Bad Gateway"],
    troubleshootingSteps: [
      "Check status.monday.com.",
      "Inspect GraphQL query complexity.",
    ],
    relatedServices: ["asana", "clickup"],
  },
  {
    slug: "clickup",
    name: "ClickUp",
    category: "productivity-collab",
    domain: "clickup.com",
    officialStatusUrl: "https://status.clickup.com",
    description:
      "All-in-one productivity platform for tasks, docs, chat, and goals.",
    impactSummary:
      "Task views freeze, API integrations return 500 internal server error.",
    keyComponents: ["Tasks Engine", "ClickUp 3.0 API", "Automations"],
    commonErrorCodes: ["500 Internal Server Error", "504 Gateway Timeout"],
    troubleshootingSteps: [
      "Check status.clickup.com.",
      "Refresh workspace cache in ClickUp settings.",
    ],
    relatedServices: ["asana", "monday", "linear"],
  },
  {
    slug: "airtable",
    name: "Airtable",
    category: "productivity-collab",
    domain: "airtable.com",
    officialStatusUrl: "https://status.airtable.com",
    description:
      "Low-code platform for building collaborative database applications and workflows.",
    impactSummary:
      "Airtable API requests fail with 429/500, webhook triggers stop firing.",
    keyComponents: ["Base Engine", "REST API", "Automations", "Interfaces"],
    commonErrorCodes: [
      "429 Too Many Requests (5 req/sec limit)",
      "500 Server Error",
      "503 Unavailable",
    ],
    troubleshootingSteps: [
      "Check status.airtable.com.",
      "Implement request queue rate limiter for Airtable API.",
    ],
    relatedServices: ["notion", "supabase"],
  },
  {
    slug: "loom",
    name: "Loom",
    category: "productivity-collab",
    domain: "loom.com",
    officialStatusUrl: "https://status.loom.com",
    description: "Asynchronous video messaging platform for work.",
    impactSummary:
      "Video recording uploads fail, video processing transcoders freeze.",
    keyComponents: [
      "Recording Uploader",
      "Transcoding Engine",
      "Video Player",
      "AI Summaries",
    ],
    commonErrorCodes: ["500 Server Error", "Video Upload Failed"],
    troubleshootingSteps: [
      "Check status.loom.com.",
      "Export local raw recording file.",
    ],
    relatedServices: ["slack", "notion"],
  },
  {
    slug: "zoom",
    name: "Zoom",
    category: "productivity-collab",
    domain: "zoom.us",
    officialStatusUrl: "https://status.zoom.us",
    description:
      "Video communications platform for meetings, webinars, phone, and team chat.",
    impactSummary:
      "Meetings fail to connect, cloud recordings fail to process, webhook events delay.",
    keyComponents: [
      "Meetings Cloud Infrastructure",
      "Webinars",
      "Zoom Phone",
      "REST API & Webhooks",
    ],
    commonErrorCodes: ["500 Server Error", "Error 5003", "Unable to connect"],
    troubleshootingSteps: [
      "Check status.zoom.us.",
      "Switch to web browser client.",
    ],
    relatedServices: ["slack", "google-workspace", "microsoft-teams"],
  },
  {
    slug: "google-workspace",
    name: "Google Workspace (Gmail / Drive / Docs)",
    category: "productivity-collab",
    domain: "workspace.google.com",
    officialStatusUrl: "https://www.google.com/appsstatus",
    description:
      "Suite of cloud computing, productivity, and collaboration tools by Google.",
    impactSummary:
      "Gmail message sending stops, Google Drive file sync errors, Google Docs editing drops offline.",
    keyComponents: [
      "Gmail",
      "Google Drive",
      "Google Docs / Sheets",
      "Google Meet",
      "Google Calendar",
    ],
    commonErrorCodes: [
      "500 Server Error",
      "Temporary Error (502)",
      "Service Unavailable",
    ],
    troubleshootingSteps: [
      "Check www.google.com/appsstatus for service health across apps.",
      "Use offline editing mode.",
    ],
    relatedServices: ["microsoft-teams", "slack", "google-cloud"],
    featured: true,
  },
  {
    slug: "microsoft-teams",
    name: "Microsoft Teams",
    category: "productivity-collab",
    domain: "teams.microsoft.com",
    officialStatusUrl: "https://status.office365.com",
    description:
      "Business communication platform developed by Microsoft as part of Microsoft 365.",
    impactSummary:
      "Calls disconnect, chat messages fail to deliver, channels show connecting status.",
    keyComponents: [
      "Messaging Core",
      "Calling & Meetings",
      "Microsoft Graph API",
      "SharePoint Integration",
    ],
    commonErrorCodes: ["500 Internal Server Error", "504 Gateway Timeout"],
    troubleshootingSteps: [
      "Check status.office365.com and Microsoft 365 Admin Center Service Health.",
      "Switch to Teams Web.",
    ],
    relatedServices: ["slack", "zoom", "azure"],
  },
  {
    slug: "miro",
    name: "Miro",
    category: "productivity-collab",
    domain: "miro.com",
    officialStatusUrl: "https://status.miro.com",
    description:
      "Visual workspace for innovation enabling distributed teams to collaborate seamlessly.",
    impactSummary: "Whiteboards fail to load, real-time cursor sync drops.",
    keyComponents: ["Board Realtime Engine", "REST API", "Integrations"],
    commonErrorCodes: ["500 Server Error", "Board Connection Lost"],
    troubleshootingSteps: ["Check status.miro.com.", "Reload board."],
    relatedServices: ["figma", "notion"],
  },
  {
    slug: "canva",
    name: "Canva",
    category: "productivity-collab",
    domain: "canva.com",
    officialStatusUrl: "https://www.canvastatus.com",
    description:
      "Online graphic design platform used to create social media graphics and presentations.",
    impactSummary: "Design exports fail, image rendering pipeline freezes.",
    keyComponents: [
      "Design Editor",
      "Export Rendering Engine",
      "Asset Library",
    ],
    commonErrorCodes: ["500 Internal Error", "Export Failed"],
    troubleshootingSteps: ["Check canvastatus.com.", "Save design copy."],
    relatedServices: ["figma"],
  },
  {
    slug: "mux",
    name: "Mux",
    category: "media-streaming",
    domain: "mux.com",
    officialStatusUrl: "https://status.mux.com",
    description:
      "Developer video platform providing on-demand video streaming, live streaming, and video data APIs.",
    impactSummary:
      "Live streams fail to broadcast, video uploads stall in processing, playback manifests error.",
    keyComponents: [
      "Mux Video (VOD)",
      "Mux Live Streaming",
      "Mux Data (QoE Analytics)",
      "Playback Infrastructure",
    ],
    commonErrorCodes: [
      "500 Internal Server Error",
      "504 Gateway Timeout",
      "Live Stream Ingest Error",
    ],
    troubleshootingSteps: [
      "Check status.mux.com for Video or Data API incidents.",
      "Verify RTMP ingest stream key and playback ID.",
      "Inspect webhook events in Mux Dashboard.",
    ],
    relatedServices: ["livepeer", "daily-co", "cloudinary"],
  },
  {
    slug: "livepeer",
    name: "Livepeer Studio",
    category: "media-streaming",
    domain: "livepeer.studio",
    officialStatusUrl: "https://status.livepeer.studio",
    description:
      "Open video infrastructure platform delivering decentralized video transcoding and streaming.",
    impactSummary:
      "Transcoding pipelines halt, playback streams fail to negotiate HLS playlists.",
    keyComponents: [
      "Live Video Ingest",
      "VOD Transcoding",
      "AI Video Processing",
      "Playback CDN",
    ],
    commonErrorCodes: ["500 Server Error", "502 Bad Gateway"],
    troubleshootingSteps: [
      "Check status.livepeer.studio.",
      "Check RTMP connection settings.",
    ],
    relatedServices: ["mux", "agora-io"],
  },
  {
    slug: "daily-co",
    name: "Daily.co",
    category: "media-streaming",
    domain: "daily.co",
    officialStatusUrl: "https://status.daily.co",
    description:
      "Real-time video and audio WebRTC APIs for developers building interactive calling.",
    impactSummary:
      "WebRTC rooms fail to initialize, audio synthesis bots drop out.",
    keyComponents: [
      "WebRTC Mesh",
      "Daily Prebuilt UI",
      "Recording & Streaming",
      "Daily Bots",
    ],
    commonErrorCodes: ["500 Server Error", "Room Join Failed"],
    troubleshootingSteps: [
      "Check status.daily.co.",
      "Inspect room token permissions.",
    ],
    relatedServices: ["agora-io", "mux", "elevenlabs"],
  },
  {
    slug: "agora-io",
    name: "Agora.io",
    category: "media-streaming",
    domain: "agora.io",
    officialStatusUrl: "https://status.agora.io",
    description:
      "Real-time voice, video, interactive live streaming, and chat platform.",
    impactSummary:
      "Live video streams drop packets, voice channels fail authentication.",
    keyComponents: [
      "Software Defined Real-time Network (SD-RTN)",
      "Voice SDK",
      "Video SDK",
      "Cloud Recording",
    ],
    commonErrorCodes: ["ERR_CONNECTION_FAILED", "500 Server Error"],
    troubleshootingSteps: [
      "Check status.agora.io.",
      "Verify Agora App ID and token generation algorithm.",
    ],
    relatedServices: ["daily-co", "twilio"],
  },
  {
    slug: "vimeo",
    name: "Vimeo",
    category: "media-streaming",
    domain: "vimeo.com",
    officialStatusUrl: "https://www.vimeostatus.com",
    description: "Video hosting, sharing, and services platform.",
    impactSummary:
      "Embedded video players fail to play, OTT live streams drop.",
    keyComponents: [
      "Vimeo Player API",
      "Transcoding Pipeline",
      "Vimeo OTT",
      "Upload API",
    ],
    commonErrorCodes: ["500 Internal Error", "503 Service Unavailable"],
    troubleshootingSteps: [
      "Check vimeostatus.com.",
      "Verify video privacy settings.",
    ],
    relatedServices: ["mux", "youtube"],
  },
  {
    slug: "youtube-api",
    name: "YouTube Data API",
    category: "media-streaming",
    domain: "youtube.com",
    officialStatusUrl: "https://status.cloud.google.com",
    description:
      "Google API to search for videos, manage playlists, and upload video content.",
    impactSummary:
      "Video metadata fetching fails with quotaExceeded, video embedding fails.",
    keyComponents: [
      "YouTube Data API v3",
      "YouTube Analytics API",
      "Live Streaming API",
    ],
    commonErrorCodes: ["403 quotaExceeded", "500 Internal Server Error"],
    troubleshootingSteps: [
      "Check Google Cloud Console for YouTube API quota.",
      "Inspect status.cloud.google.com.",
    ],
    relatedServices: ["google-cloud", "vimeo"],
  },
  {
    slug: "infura",
    name: "Infura (ConsenSys)",
    category: "web3-crypto",
    domain: "infura.io",
    officialStatusUrl: "https://status.infura.io",
    description:
      "Web3 infrastructure platform providing Ethereum, Polygon, Linea, and IPFS node endpoints.",
    impactSummary:
      "dApps fail to fetch blockchain state, smart contract transactions fail to broadcast.",
    keyComponents: [
      "Ethereum Mainnet JSON-RPC",
      "Polygon / L2 Endpoints",
      "IPFS Gateway",
      "NFT API",
    ],
    commonErrorCodes: [
      "500 Internal Server Error",
      "429 Rate Limit Exceeded",
      "-32000 Execution reverted",
    ],
    troubleshootingSteps: [
      "Check status.infura.io for network degradation across EVM chains.",
      "Switch RPC URL to backup node provider (Alchemy, QuickNode, Ankr).",
      "Inspect project request limits in Infura Dashboard.",
    ],
    relatedServices: ["alchemy", "quicknode", "etherscan", "coinbase"],
    featured: true,
  },
  {
    slug: "alchemy",
    name: "Alchemy",
    category: "web3-crypto",
    domain: "alchemy.com",
    officialStatusUrl: "https://status.alchemy.com",
    description:
      "Web3 developer platform providing node infrastructure, Account Abstraction, and Enhanced APIs.",
    impactSummary:
      "Wallet balances fail to load, Bundler user operations error out, webhook triggers pause.",
    keyComponents: [
      "Supernode JSON-RPC",
      "Enhanced APIs (NFT / Token)",
      "Account Abstraction Bundler",
      "Custom Webhooks",
    ],
    commonErrorCodes: [
      "500 Server Error",
      "429 Too Many Requests",
      "-32603 Internal error",
    ],
    troubleshootingSteps: [
      "Check status.alchemy.com.",
      "Fallback to secondary RPC provider.",
    ],
    relatedServices: ["infura", "quicknode", "etherscan"],
    featured: true,
  },
  {
    slug: "quicknode",
    name: "QuickNode",
    category: "web3-crypto",
    domain: "quicknode.com",
    officialStatusUrl: "https://status.quicknode.com",
    description:
      "High-performance blockchain infrastructure across 35+ chains including Solana, Ethereum, and Bitcoin.",
    impactSummary: "Solana RPC calls time out, Streams event triggers pause.",
    keyComponents: [
      "Dedicated Endpoints",
      "Streams Data Pipeline",
      "Rollup as a Service",
      "Functions",
    ],
    commonErrorCodes: ["503 Unavailable", "504 Gateway Timeout"],
    troubleshootingSteps: [
      "Check status.quicknode.com.",
      "Switch endpoint region in dashboard.",
    ],
    relatedServices: ["alchemy", "infura"],
  },
  {
    slug: "etherscan",
    name: "Etherscan",
    category: "web3-crypto",
    domain: "etherscan.io",
    officialStatusUrl: "https://status.etherscan.io",
    description:
      "Block explorer and analytics platform for Ethereum and EVM networks.",
    impactSummary:
      "Transaction verification fails, Etherscan API gas tracker returns 500.",
    keyComponents: [
      "Block Explorer Web UI",
      "Developer REST API",
      "Token Tracker",
      "Contract Verification",
    ],
    commonErrorCodes: ["500 Server Error", "429 Rate Limit (5 calls/sec)"],
    troubleshootingSteps: [
      "Check status.etherscan.io.",
      "Implement API rate limiting on free keys.",
    ],
    relatedServices: ["infura", "alchemy"],
  },
  {
    slug: "coingecko",
    name: "CoinGecko API",
    category: "web3-crypto",
    domain: "coingecko.com",
    officialStatusUrl: "https://status.coingecko.com",
    description:
      "Independent crypto data aggregator tracking token prices, volumes, and market caps.",
    impactSummary:
      "Real-time token price charts show stale data or return 429 rate limits.",
    keyComponents: ["Simple Price API", "Market Data API", "Exchange Tickers"],
    commonErrorCodes: ["429 Too Many Requests", "500 Server Error"],
    troubleshootingSteps: [
      "Check status.coingecko.com.",
      "Cache price data locally with a 60-second TTL.",
    ],
    relatedServices: ["coinbase", "binance"],
  },
  {
    slug: "the-graph",
    name: "The Graph (Graph Network)",
    category: "web3-crypto",
    domain: "thegraph.com",
    officialStatusUrl: "https://status.thegraph.com",
    description:
      "Decentralized protocol for indexing and querying blockchain data using GraphQL subgraphs.",
    impactSummary: "Subgraph queries error, dApp UI displays empty tables.",
    keyComponents: ["Network Indexers", "Graph Studio", "Query Gateway API"],
    commonErrorCodes: ["500 Internal Error", "Subgraph sync lag"],
    troubleshootingSteps: [
      "Check status.thegraph.com.",
      "Check subgraph indexing status.",
    ],
    relatedServices: ["alchemy", "infura"],
  },
  {
    slug: "opensea",
    name: "OpenSea API",
    category: "web3-crypto",
    domain: "opensea.io",
    officialStatusUrl: "https://status.opensea.io",
    description:
      "NFT marketplace and developer API for querying collection metadata and listings.",
    impactSummary:
      "NFT listing requests fail, asset metadata queries return 500.",
    keyComponents: [
      "Stream API (WebSockets)",
      "REST Orders API",
      "Marketplace Contract",
    ],
    commonErrorCodes: ["500 Server Error", "429 Rate Limit", "401 Invalid Key"],
    troubleshootingSteps: [
      "Check status.opensea.io.",
      "Verify OpenSea API key header.",
    ],
    relatedServices: ["alchemy", "infura"],
  },
  {
    slug: "chainlink",
    name: "Chainlink (Data Feeds & VRF)",
    category: "web3-crypto",
    domain: "chain.link",
    officialStatusUrl: "https://status.chain.link",
    description:
      "Decentralized oracle network connecting smart contracts to off-chain data and computation.",
    impactSummary:
      "Oracle price feed updates lag, VRF randomness fulfillment delays.",
    keyComponents: [
      "Price Feeds",
      "Chainlink Functions",
      "CCIP Cross-Chain",
      "VRF Randomness",
    ],
    commonErrorCodes: ["Oracle Response Timeout", "Transaction Stalled"],
    troubleshootingSteps: [
      "Check status.chain.link.",
      "Verify gas allowance on upkeep contracts.",
    ],
    relatedServices: ["infura", "alchemy"],
  },
  {
    slug: "deepseek",
    name: "DeepSeek",
    category: "ai-ml",
    domain: "api.deepseek.com",
    officialStatusUrl: "https://status.deepseek.com",
    description:
      "DeepSeek provides developer APIs for DeepSeek-V3 and DeepSeek-R1 reasoning models.",
    impactSummary:
      "API reasoning responses stall, chat.deepseek.com throws server busy 503 errors.",
    keyComponents: ["DeepSeek Chat API", "DeepSeek Coder API", "Web Interface"],
    commonErrorCodes: [
      "503 Server Busy",
      "500 Internal Error",
      "429 Rate Limit",
    ],
    troubleshootingSteps: [
      "Check DeepSeek API status.",
      "Switch to Groq or Fireworks hosted DeepSeek-R1 models.",
    ],
    relatedServices: ["openai", "anthropic", "groq"],
    featured: true,
  },
  {
    slug: "baseten",
    name: "Baseten",
    category: "ai-ml",
    domain: "baseten.co",
    officialStatusUrl: "https://status.baseten.co",
    description:
      "Model deployment platform providing dedicated GPU infrastructure for LLMs and custom ML models.",
    impactSummary:
      "Model cold starts fail, model invocations return 504 gateway timeout.",
    keyComponents: [
      "Model Deployment Engine",
      "Truss Server",
      "Async Inference API",
    ],
    commonErrorCodes: ["504 Gateway Timeout", "500 Server Error"],
    troubleshootingSteps: [
      "Check status.baseten.co.",
      "Inspect model container logs.",
    ],
    relatedServices: ["replicate", "runpod", "together-ai"],
  },
  {
    slug: "anyscale",
    name: "Anyscale (Ray Cloud)",
    category: "ai-ml",
    domain: "anyscale.com",
    officialStatusUrl: "https://status.anyscale.com",
    description:
      "Distributed AI platform powered by Ray for training, fine-tuning, and scalable LLM serving.",
    impactSummary:
      "Ray cluster worker nodes fail to schedule, endpoints return 503.",
    keyComponents: ["Ray Clusters", "Anyscale Endpoints", "Workspace Engine"],
    commonErrorCodes: ["503 Unavailable", "500 Internal Server Error"],
    troubleshootingSteps: [
      "Check status.anyscale.com.",
      "Check Ray actor memory allocation.",
    ],
    relatedServices: ["runpod", "together-ai"],
  },
  {
    slug: "portkey-ai",
    name: "Portkey AI Gateway",
    category: "ai-ml",
    domain: "portkey.ai",
    officialStatusUrl: "https://status.portkey.ai",
    description:
      "AI gateway and control plane to route, monitor, and manage LLM requests with fallback and cache.",
    impactSummary:
      "Routed AI requests fail if gateway proxy encounters connectivity issues.",
    keyComponents: [
      "AI Gateway Proxy",
      "Observability Dashboard",
      "Virtual Keys",
      "Prompt Library",
    ],
    commonErrorCodes: ["502 Bad Gateway", "504 Gateway Timeout"],
    troubleshootingSteps: [
      "Bypass gateway and connect directly to upstream provider.",
      "Check status.portkey.ai.",
    ],
    relatedServices: ["helicone", "langfuse"],
  },
  {
    slug: "arize-ai",
    name: "Arize AI / Phoenix",
    category: "ai-ml",
    domain: "arize.com",
    officialStatusUrl: "https://status.arize.com",
    description:
      "LLM observability, evaluation, and ML model monitoring platform.",
    impactSummary: "Span tracing and evaluation datasets fail to ingest.",
    keyComponents: [
      "OTel Collector Ingest",
      "Evaluation Engine",
      "Model Quality Drift",
    ],
    commonErrorCodes: ["500 Server Error", "504 Timeout"],
    troubleshootingSteps: [
      "Check Arize status.",
      "Verify OTel endpoint exporter config.",
    ],
    relatedServices: ["langfuse", "langsmith"],
  },
  {
    slug: "cartesia",
    name: "Cartesia (Sonic Voice)",
    category: "ai-ml",
    domain: "cartesia.ai",
    officialStatusUrl: "https://status.cartesia.ai",
    description:
      "Ultra-low latency generative voice AI and real-time Sonic TTS API.",
    impactSummary: "Real-time speech synthesis audio streams disconnect.",
    keyComponents: [
      "Sonic TTS WebSocket",
      "Voice Clone API",
      "Streaming Player",
    ],
    commonErrorCodes: ["WebSocket Error 1006", "500 Server Error"],
    troubleshootingSteps: [
      "Check Cartesia status.",
      "Switch to ElevenLabs or Deepgram Aura.",
    ],
    relatedServices: ["elevenlabs", "deepgram"],
  },
  {
    slug: "play-ht",
    name: "PlayHT",
    category: "ai-ml",
    domain: "play.ht",
    officialStatusUrl: "https://status.play.ht",
    description: "AI voice generator and realistic text-to-speech API.",
    impactSummary: "Voice cloning and audio render requests fail.",
    keyComponents: ["TTS REST API", "Streaming API", "Voice Studio"],
    commonErrorCodes: ["500 Internal Error", "504 Timeout"],
    troubleshootingSteps: [
      "Check status.play.ht.",
      "Verify API key and user ID header.",
    ],
    relatedServices: ["elevenlabs", "cartesia"],
  },
  {
    slug: "speechify",
    name: "Speechify API",
    category: "ai-ml",
    domain: "speechify.com",
    officialStatusUrl: "https://status.speechify.com",
    description:
      "Text-to-speech voice API featuring natural-sounding voices for web and apps.",
    impactSummary: "Audio generation API returns 500 or times out.",
    keyComponents: ["Audio Generation API", "Voice Catalog", "Mobile Sync"],
    commonErrorCodes: ["500 Server Error", "403 Forbidden"],
    troubleshootingSteps: [
      "Check Speechify status.",
      "Inspect request character length.",
    ],
    relatedServices: ["elevenlabs", "play-ht"],
  },
  {
    slug: "cohere-embed",
    name: "Cohere Embed",
    category: "ai-ml",
    domain: "cohere.com",
    officialStatusUrl: "https://status.cohere.com",
    description:
      "Multilingual text embeddings model API for semantic search and document retrieval.",
    impactSummary: "Vector generation fails, breaking RAG indexing.",
    keyComponents: [
      "Embed v3 API",
      "Compression Engine",
      "Multilingual Models",
    ],
    commonErrorCodes: ["500 Internal Server Error", "429 Rate Limit"],
    troubleshootingSteps: [
      "Check status.cohere.com.",
      "Fallback to OpenAI embeddings.",
    ],
    relatedServices: ["openai", "voyage-ai"],
  },
  {
    slug: "chroma-cloud",
    name: "Chroma Cloud",
    category: "ai-ml",
    domain: "trychroma.com",
    officialStatusUrl: "https://status.trychroma.com",
    description:
      "AI-native open-source and managed vector database for embeddings.",
    impactSummary:
      "Collection queries fail, vector embeddings fail to persist.",
    keyComponents: ["Chroma Server API", "HNSW Index", "Metadata Filter"],
    commonErrorCodes: ["500 Server Error", "504 Timeout"],
    troubleshootingSteps: [
      "Check status.trychroma.com.",
      "Verify Chroma client connection URL.",
    ],
    relatedServices: ["pinecone", "qdrant", "weaviate"],
  },
  {
    slug: "milvus-cloud",
    name: "Zilliz / Milvus Cloud",
    category: "ai-ml",
    domain: "zilliz.com",
    officialStatusUrl: "https://status.zilliz.com",
    description:
      "Enterprise vector database built for massive scale similarity search.",
    impactSummary:
      "High-dimensional vector search fails, collection loading stalls.",
    keyComponents: ["Milvus Coordinator", "Query Nodes", "Vector Storage"],
    commonErrorCodes: ["gRPC Connection Error", "500 Internal Error"],
    troubleshootingSteps: [
      "Check status.zilliz.com.",
      "Inspect Milvus collection load status.",
    ],
    relatedServices: ["pinecone", "qdrant"],
  },
  {
    slug: "aws-ec2",
    name: "AWS EC2 (Elastic Compute Cloud)",
    category: "cloud-infra",
    domain: "aws.amazon.com/ec2",
    officialStatusUrl: "https://health.aws.amazon.com",
    description: "Secure and resizable virtual compute capacity in the cloud.",
    impactSummary:
      "Instance reachability drops, EBS volume detachment errors, instance metadata service hangs.",
    keyComponents: [
      "EC2 Instances",
      "EBS Storage",
      "Auto Scaling Groups",
      "VPC Networking",
    ],
    commonErrorCodes: [
      "500 Internal Server Error",
      "Instance Unreachable",
      "Connection Timeout",
    ],
    troubleshootingSteps: [
      "Check AWS Service Health Dashboard.",
      "Inspect EC2 System Status Checks in AWS Console.",
    ],
    relatedServices: ["aws", "aws-s3", "aws-rds"],
  },
  {
    slug: "aws-rds",
    name: "Amazon RDS (Relational Database Service)",
    category: "cloud-infra",
    domain: "aws.amazon.com/rds",
    officialStatusUrl: "https://health.aws.amazon.com",
    description:
      "Managed relational database service for PostgreSQL, MySQL, MariaDB, Oracle, and SQL Server.",
    impactSummary:
      "Multi-AZ failovers trigger, database connections max out, read replica lag surges.",
    keyComponents: [
      "RDS Postgres / MySQL Instances",
      "Aurora Clusters",
      "Automated Backups",
      "Read Replicas",
    ],
    commonErrorCodes: [
      "FATAL: remaining connection slots are reserved",
      "Connection Timed Out",
      "500 Internal Server Error",
    ],
    troubleshootingSteps: [
      "Check CloudWatch RDS CPUUtilization and DatabaseConnections metrics.",
      "Check RDS Multi-AZ status.",
    ],
    relatedServices: ["aws", "supabase", "neon"],
  },
  {
    slug: "aws-cloudfront",
    name: "Amazon CloudFront",
    category: "cloud-infra",
    domain: "aws.amazon.com/cloudfront",
    officialStatusUrl: "https://health.aws.amazon.com",
    description:
      "Global content delivery network (CDN) securely delivering data, videos, and APIs.",
    impactSummary:
      "CloudFront edge points return 504 Gateway Timeout or 502 Bad Gateway when origin fails.",
    keyComponents: [
      "Edge Locations",
      "CloudFront Functions",
      "Lambda@Edge",
      "Origin Shield",
    ],
    commonErrorCodes: [
      "504 Gateway Timeout",
      "502 Bad Gateway",
      "403 Forbidden",
    ],
    troubleshootingSteps: [
      "Check CloudFront error rate metrics.",
      "Verify Origin timeout settings.",
    ],
    relatedServices: ["aws", "cloudflare", "fastly"],
  },
  {
    slug: "aws-route53",
    name: "Amazon Route 53",
    category: "cloud-infra",
    domain: "aws.amazon.com/route53",
    officialStatusUrl: "https://health.aws.amazon.com",
    description:
      "Highly available and scalable cloud Domain Name System (DNS) web service.",
    impactSummary:
      "DNS resolution stalls worldwide, failover routing policies fail to flip.",
    keyComponents: [
      "Authoritative DNS Servers",
      "Route 53 Health Checks",
      "Traffic Flow Routing",
    ],
    commonErrorCodes: ["DNS Timeout", "SERVFAIL"],
    troubleshootingSteps: [
      "Check AWS Health Dashboard for Route 53 status.",
      "Verify nameserver delegation with dig.",
    ],
    relatedServices: ["aws", "cloudflare"],
  },
  {
    slug: "aws-dynamodb",
    name: "Amazon DynamoDB",
    category: "cloud-infra",
    domain: "aws.amazon.com/dynamodb",
    officialStatusUrl: "https://health.aws.amazon.com",
    description:
      "Fully managed NoSQL database service delivering single-digit millisecond latency at any scale.",
    impactSummary:
      "ProvisionedThroughputExceededException errors, table query throttles.",
    keyComponents: [
      "Global Tables",
      "DynamoDB Streams",
      "DAX In-Memory Accelerator",
    ],
    commonErrorCodes: [
      "ProvisionedThroughputExceededException",
      "500 InternalServerError",
    ],
    troubleshootingSteps: [
      "Check DynamoDB read/write capacity units.",
      "Enable On-Demand auto-scaling.",
    ],
    relatedServices: ["aws", "upstash", "mongodb-atlas"],
  },
  {
    slug: "aws-sqs",
    name: "Amazon SQS (Simple Queue Service)",
    category: "cloud-infra",
    domain: "aws.amazon.com/sqs",
    officialStatusUrl: "https://health.aws.amazon.com",
    description:
      "Fully managed message queuing service enabling microservices decoupling.",
    impactSummary:
      "Queue message ingestion delays, dead letter queues (DLQ) overflow.",
    keyComponents: ["Standard Queues", "FIFO Queues", "Dead Letter Queues"],
    commonErrorCodes: ["500 InternalServerError", "OverLimit"],
    troubleshootingSteps: [
      "Check CloudWatch ApproximateNumberOfMessagesVisible metric.",
      "Verify IAM queue permissions.",
    ],
    relatedServices: ["aws", "upstash"],
  },
  {
    slug: "aws-ecs",
    name: "Amazon ECS (Elastic Container Service)",
    category: "cloud-infra",
    domain: "aws.amazon.com/ecs",
    officialStatusUrl: "https://health.aws.amazon.com",
    description:
      "Fully managed container orchestration service for Docker containers on Fargate or EC2.",
    impactSummary:
      "Task deployments fail, container tasks crash-loop without restarting.",
    keyComponents: [
      "ECS Fargate",
      "EC2 Launch Type",
      "Service Scheduler",
      "Target Groups",
    ],
    commonErrorCodes: [
      "STOPPED (Essential container in task exited)",
      "CannotPullContainerError",
    ],
    troubleshootingSteps: [
      "Inspect stopped task reasons in ECS Console.",
      "Check CloudWatch container logs.",
    ],
    relatedServices: ["aws", "docker-hub"],
  },
  {
    slug: "aws-eks",
    name: "Amazon EKS (Elastic Kubernetes Service)",
    category: "cloud-infra",
    domain: "aws.amazon.com/eks",
    officialStatusUrl: "https://health.aws.amazon.com",
    description:
      "Managed Kubernetes service to run Kubernetes on AWS without installing or operating control plane.",
    impactSummary:
      "kubectl commands fail, control plane API server is unreachable.",
    keyComponents: ["EKS Control Plane", "Managed Node Groups", "AWS VPC CNI"],
    commonErrorCodes: [
      "Error from server (ServiceUnavailable)",
      "Connection Refused",
    ],
    troubleshootingSteps: [
      "Check status of EKS cluster in AWS Console.",
      "Inspect node group health.",
    ],
    relatedServices: ["aws", "google-cloud", "azure"],
  },
  {
    slug: "aws-ses",
    name: "Amazon SES (Simple Email Service)",
    category: "cloud-infra",
    domain: "aws.amazon.com/ses",
    officialStatusUrl: "https://health.aws.amazon.com",
    description:
      "Cost-effective, flexible, and scalable email service for developers.",
    impactSummary:
      "Outbound emails fail to send, bounce/complaint rates cause account probation.",
    keyComponents: [
      "SMTP Endpoint",
      "SES v2 API",
      "Dedicated IP Pools",
      "Configuration Sets",
    ],
    commonErrorCodes: [
      "MessageRejected",
      "LimitExceededException",
      "500 Server Error",
    ],
    troubleshootingSteps: [
      "Check SES Reputation Dashboard.",
      "Verify DKIM and SPF records in Route 53.",
    ],
    relatedServices: ["sendgrid", "resend", "postmark"],
  },
  {
    slug: "gcp-cloud-run",
    name: "Google Cloud Run",
    category: "cloud-infra",
    domain: "cloud.google.com/run",
    officialStatusUrl: "https://status.cloud.google.com",
    description:
      "Serverless platform to build and deploy scalable containerized apps on Google infrastructure.",
    impactSummary:
      "Container instances fail to scale from zero, requests return 504 deadline exceeded.",
    keyComponents: [
      "Cloud Run Services",
      "Cloud Run Jobs",
      "Container Scale-to-Zero",
      "Custom Domains",
    ],
    commonErrorCodes: [
      "504 Gateway Timeout",
      "503 Service Unavailable",
      "Container failed to start and listen on PORT",
    ],
    troubleshootingSteps: [
      "Inspect Logs Explorer in Google Cloud Console.",
      "Increase container memory/CPU allocation.",
    ],
    relatedServices: ["google-cloud", "vercel", "fly-io"],
  },
  {
    slug: "gcp-gke",
    name: "Google Kubernetes Engine (GKE)",
    category: "cloud-infra",
    domain: "cloud.google.com/kubernetes-engine",
    officialStatusUrl: "https://status.cloud.google.com",
    description:
      "Managed environment for deploying, managing, and scaling containerized applications using Kubernetes.",
    impactSummary: "Master API server unreachable, node pool autoscaler fails.",
    keyComponents: [
      "GKE Autopilot",
      "Standard Clusters",
      "Ingress Controller",
      "Workload Identity",
    ],
    commonErrorCodes: ["503 Service Unavailable", "NodeNotReady"],
    troubleshootingSteps: [
      "Check status.cloud.google.com.",
      "Run kubectl get nodes to verify node states.",
    ],
    relatedServices: ["google-cloud", "aws-eks"],
  },
  {
    slug: "gcp-cloud-storage",
    name: "Google Cloud Storage (GCS)",
    category: "cloud-infra",
    domain: "cloud.google.com/storage",
    officialStatusUrl: "https://status.cloud.google.com",
    description:
      "Worldwide, scalable object storage for developers and enterprises.",
    impactSummary:
      "gsutil and REST API bucket uploads fail with 503 or RateLimitExceeded.",
    keyComponents: [
      "JSON REST API",
      "XML API",
      "Signed URLs",
      "Object Lifecycle Management",
    ],
    commonErrorCodes: [
      "503 Service Unavailable",
      "500 Backend Error",
      "AccessDenied",
    ],
    troubleshootingSteps: [
      "Check Google Cloud Status dashboard.",
      "Verify IAM service account permissions.",
    ],
    relatedServices: ["google-cloud", "aws-s3"],
  },
  {
    slug: "gcp-bigquery",
    name: "Google BigQuery",
    category: "cloud-infra",
    domain: "cloud.google.com/bigquery",
    officialStatusUrl: "https://status.cloud.google.com",
    description:
      "Serverless, highly scalable enterprise data warehouse designed for business agility.",
    impactSummary:
      "Streaming insert API fails, analytical SQL queries time out.",
    keyComponents: [
      "BigQuery SQL Engine",
      "Storage Write API",
      "BI Engine",
      "BigQuery ML",
    ],
    commonErrorCodes: ["quotaExceeded", "500 Internal Error", "backendError"],
    troubleshootingSteps: [
      "Check BigQuery slot capacity usage.",
      "Inspect query execution details in GCP Console.",
    ],
    relatedServices: ["google-cloud", "snowflake"],
  },
  {
    slug: "azure-blob-storage",
    name: "Azure Blob Storage",
    category: "cloud-infra",
    domain: "azure.microsoft.com/services/storage/blobs",
    officialStatusUrl: "https://status.azure.com",
    description:
      "Massively scalable and secure object storage for cloud-native workloads.",
    impactSummary: "Blob read/write operations fail, CDN origin fetch errors.",
    keyComponents: [
      "Block Blobs",
      "Append Blobs",
      "Storage Accounts REST API",
      "AzCopy",
    ],
    commonErrorCodes: [
      "503 ServerBusy",
      "500 InternalError",
      "AuthenticationFailed",
    ],
    troubleshootingSteps: [
      "Check Azure Service Health.",
      "Verify SAS token expiry.",
    ],
    relatedServices: ["azure", "aws-s3"],
  },
  {
    slug: "azure-app-service",
    name: "Azure App Service",
    category: "cloud-infra",
    domain: "azure.microsoft.com/services/app-service",
    officialStatusUrl: "https://status.azure.com",
    description:
      "HTTP-based service for hosting web applications, REST APIs, and mobile backends.",
    impactSummary:
      "App Service instances throw 502/503 errors, deployment slots fail to swap.",
    keyComponents: [
      "App Service Plans",
      "Deployment Slots",
      "Kudu Deployment Engine",
    ],
    commonErrorCodes: [
      "502 Bad Gateway",
      "503 Service Unavailable",
      "500 Server Error",
    ],
    troubleshootingSteps: [
      "Restart App Service in Azure Portal.",
      "Check Diagnose and Solve Problems in portal.",
    ],
    relatedServices: ["azure", "vercel"],
  },
  {
    slug: "azure-cosmos-db",
    name: "Azure Cosmos DB",
    category: "cloud-infra",
    domain: "azure.microsoft.com/services/cosmos-db",
    officialStatusUrl: "https://status.azure.com",
    description:
      "Fully managed distributed NoSQL and relational database for modern app development.",
    impactSummary:
      "Request Unit (RU/s) throttling (429), multi-region replication sync lag.",
    keyComponents: [
      "SQL (Core) API",
      "MongoDB API",
      "Gremlin API",
      "Change Feed",
    ],
    commonErrorCodes: ["429 RequestRateTooLarge", "500 Internal Server Error"],
    troubleshootingSteps: [
      "Increase Provisioned RU/s or enable Autoscale.",
      "Check status.azure.com.",
    ],
    relatedServices: ["azure", "mongodb-atlas", "supabase"],
  },
  {
    slug: "porkbun",
    name: "Porkbun DNS & Registrar",
    category: "cloud-infra",
    domain: "porkbun.com",
    officialStatusUrl: "https://status.porkbun.com",
    description: "Domain registrar and authoritative DNS management provider.",
    impactSummary: "Domain DNS updates delay, registrar control panel errors.",
    keyComponents: [
      "Authoritative DNS",
      "Domain Registrar API",
      "SSL Generator",
    ],
    commonErrorCodes: ["500 Server Error", "DNS Resolution Timeout"],
    troubleshootingSteps: [
      "Check status.porkbun.com.",
      "Use Cloudflare DNS nameservers.",
    ],
    relatedServices: ["namecheap", "godaddy", "cloudflare"],
  },
  {
    slug: "tailscale",
    name: "Tailscale",
    category: "cloud-infra",
    domain: "tailscale.com",
    officialStatusUrl: "https://status.tailscale.com",
    description:
      "Zero config VPN built on WireGuard providing secure mesh networking for teams.",
    impactSummary:
      "Tailnet nodes disconnect, MagicDNS stops resolving private hostnames, DERP relays lag.",
    keyComponents: [
      "Control Plane Coordination",
      "MagicDNS",
      "DERP Relay Servers",
      "Tailscale SSH",
    ],
    commonErrorCodes: [
      "500 Internal Error",
      "DERP connection failed",
      "tailscale status disconnected",
    ],
    troubleshootingSteps: [
      "Check status.tailscale.com for control server or DERP relay incidents.",
      "Run tailscale ping <node-ip> to test direct WireGuard peer connection.",
      "Restart tailscaled service.",
    ],
    relatedServices: ["cloudflare", "aws"],
    featured: true,
  },
  {
    slug: "github-actions",
    name: "GitHub Actions",
    category: "devtools-git",
    domain: "github.com/features/actions",
    officialStatusUrl: "https://www.githubstatus.com",
    description:
      "Automate, customize, and execute software development workflows in GitHub repository.",
    impactSummary:
      "CI/CD pipeline runs get stuck in queued state, secrets injection fails, release workflows stall.",
    keyComponents: [
      "GitHub-Hosted Runners",
      "Self-Hosted Runner Dispatch",
      "Workflow Engine",
      "Artifacts Cache",
    ],
    commonErrorCodes: [
      "Runner connection lost",
      "Workflow run timed out",
      "500 Server Error",
    ],
    troubleshootingSteps: [
      "Check www.githubstatus.com Actions component.",
      "Cancel and re-run failed jobs.",
      "Use self-hosted runners.",
    ],
    relatedServices: ["github", "circleci", "gitlab"],
    featured: true,
  },
  {
    slug: "github-copilot",
    name: "GitHub Copilot",
    category: "devtools-git",
    domain: "github.com/features/copilot",
    officialStatusUrl: "https://www.githubstatus.com",
    description:
      "AI pair programmer providing autocomplete suggestions, chat, and pull request reviews.",
    impactSummary:
      "IDE completions stop rendering, Copilot Chat returns connection error.",
    keyComponents: [
      "Copilot Completion API",
      "Copilot Chat API",
      "Copilot Workspace",
    ],
    commonErrorCodes: ["Copilot: Connection failed", "503 Service Unavailable"],
    troubleshootingSteps: [
      "Check www.githubstatus.com Copilot component.",
      "Sign out and sign back in to GitHub in IDE.",
    ],
    relatedServices: ["github", "cursor", "openai"],
  },
  {
    slug: "bitrise",
    name: "Bitrise",
    category: "devtools-git",
    domain: "bitrise.io",
    officialStatusUrl: "https://status.bitrise.io",
    description: "Mobile DevOps and CI/CD platform for iOS and Android apps.",
    impactSummary: "iOS build machines stall, App Store deployment steps fail.",
    keyComponents: [
      "macOS M-series Build Machines",
      "Workflow Steps",
      "Code Signing Engine",
    ],
    commonErrorCodes: ["500 Internal Error", "Build Failed on Step"],
    troubleshootingSteps: [
      "Check status.bitrise.io.",
      "Test build locally with Bitrise CLI.",
    ],
    relatedServices: ["github-actions", "circleci"],
  },
  {
    slug: "codecov",
    name: "Codecov (Sentry)",
    category: "devtools-git",
    domain: "codecov.io",
    officialStatusUrl: "https://status.codecov.com",
    description:
      "Code coverage analysis and reporting tool integrated into pull request checks.",
    impactSummary:
      "Coverage report upload fails in CI, blocking required PR status checks.",
    keyComponents: [
      "Coverage Ingestion API",
      "PR Comment Bot",
      "Quality Gates",
    ],
    commonErrorCodes: ["500 Server Error", "Upload Failed: Connection Timeout"],
    troubleshootingSteps: [
      "Check status.codecov.com.",
      "Make Codecov check non-blocking in branch protection.",
    ],
    relatedServices: ["github", "sentry"],
  },
  {
    slug: "honeycomb",
    name: "Honeycomb.io",
    category: "devtools-git",
    domain: "honeycomb.io",
    officialStatusUrl: "https://status.honeycomb.io",
    description:
      "Fast observability tool built for high-cardinality distributed tracing and debugging.",
    impactSummary:
      "OTel trace ingest delays, high-cardinality queries timeout.",
    keyComponents: [
      "API Data Ingest",
      "Query Engine",
      "BubbleUp Analysis",
      "SLO Triggers",
    ],
    commonErrorCodes: ["503 Service Unavailable", "429 Rate Limit"],
    troubleshootingSteps: [
      "Check status.honeycomb.io.",
      "Verify OpenTelemetry collector exporter batching.",
    ],
    relatedServices: ["datadog", "grafana-cloud", "axiom"],
  },
  {
    slug: "axiom",
    name: "Axiom",
    category: "devtools-git",
    domain: "axiom.co",
    officialStatusUrl: "https://status.axiom.co",
    description:
      "Cloud-native log management, event analytics, and observability platform.",
    impactSummary: "Vercel log draining stalls, APL queries error.",
    keyComponents: [
      "Ingest API",
      "Axiom Processing Language (APL)",
      "Vercel Drain",
    ],
    commonErrorCodes: ["500 Server Error", "504 Timeout"],
    troubleshootingSteps: [
      "Check status.axiom.co.",
      "Inspect Axiom API token permissions.",
    ],
    relatedServices: ["datadog", "sentry", "vercel"],
  },
  {
    slug: "better-auth",
    name: "Better Auth",
    category: "auth-security",
    domain: "better-auth.com",
    officialStatusUrl: "https://status.better-auth.com",
    description:
      "Modern, framework-agnostic TypeScript authentication framework for full-stack apps.",
    impactSummary:
      "Session verification middleware throws runtime error, OAuth callbacks fail.",
    keyComponents: [
      "Auth Core Engine",
      "Session Plugin",
      "OAuth Handlers",
      "Two-Factor Plugin",
    ],
    commonErrorCodes: ["500 Internal Error", "401 Unauthorized"],
    troubleshootingSteps: [
      "Check database connection for session table.",
      "Verify BETTER_AUTH_SECRET environment variable.",
    ],
    relatedServices: ["clerk", "auth0", "supabase"],
  },
  {
    slug: "snowflake",
    name: "Snowflake Data Cloud",
    category: "databases-storage",
    domain: "snowflake.com",
    officialStatusUrl: "https://status.snowflake.com",
    description:
      "Cloud data warehouse and analytical platform for structured and semi-structured data.",
    impactSummary:
      "Virtual warehouses fail to resume, ETL data pipelines halt, SQL query execution freezes.",
    keyComponents: [
      "Cloud Services Layer",
      "Virtual Warehouses",
      "Snowpipe Ingestion",
      "Storage Layer",
    ],
    commonErrorCodes: [
      "Warehouse failed to start",
      "500 Server Error",
      "Connection Timeout",
    ],
    troubleshootingSteps: [
      "Check status.snowflake.com for your cloud region (AWS, Azure, GCP).",
      "Inspect Snowpipe error logs.",
    ],
    relatedServices: ["gcp-bigquery", "databricks"],
    featured: true,
  },
  {
    slug: "databricks",
    name: "Databricks Cloud",
    category: "databases-storage",
    domain: "databricks.com",
    officialStatusUrl: "https://status.databricks.com",
    description:
      "Data intelligence platform unifying data engineering, data science, and AI on Apache Spark.",
    impactSummary:
      "Spark clusters fail to start, automated job workflows terminate with errors.",
    keyComponents: [
      "Spark Clusters",
      "Unity Catalog",
      "Delta Lake Storage",
      "Model Serving",
    ],
    commonErrorCodes: ["500 Internal Error", "Cluster start timed out"],
    troubleshootingSteps: [
      "Check status.databricks.com.",
      "Check cloud provider VM quota in target region.",
    ],
    relatedServices: ["snowflake", "aws"],
  },
  {
    slug: "clickhouse-cloud",
    name: "ClickHouse Cloud",
    category: "databases-storage",
    domain: "clickhouse.com",
    officialStatusUrl: "https://status.clickhouse.com",
    description:
      "Lightning-fast cloud data warehouse for real-time analytics and telemetry.",
    impactSummary:
      "Real-time telemetry queries hang, HTTP interface returns 503.",
    keyComponents: [
      "ClickHouse Service",
      "Keeper Coordination",
      "Object Storage Tier",
    ],
    commonErrorCodes: [
      "503 Service Unavailable",
      "DB::Exception: Memory limit exceeded",
    ],
    troubleshootingSteps: [
      "Check status.clickhouse.com.",
      "Review query memory limit in ClickHouse Console.",
    ],
    relatedServices: ["snowflake", "timescale"],
  },
  {
    slug: "pinata",
    name: "Pinata (IPFS Cloud)",
    category: "databases-storage",
    domain: "pinata.cloud",
    officialStatusUrl: "https://status.pinata.cloud",
    description:
      "IPFS pinning service and dedicated IPFS gateways for Web3 and media.",
    impactSummary:
      "IPFS content hashes (CID) fail to resolve via dedicated gateway.",
    keyComponents: ["Pinning API", "Dedicated Gateway", "File API"],
    commonErrorCodes: ["504 Gateway Timeout", "502 Bad Gateway"],
    troubleshootingSteps: [
      "Check status.pinata.cloud.",
      "Use public IPFS gateway fallback (e.g. ipfs.io).",
    ],
    relatedServices: ["infura", "alchemy"],
  },
  {
    slug: "mailchimp",
    name: "Mailchimp (Intuit)",
    category: "comms-email",
    domain: "mailchimp.com",
    officialStatusUrl: "https://status.mailchimp.com",
    description:
      "Marketing automation platform and email marketing service for businesses.",
    impactSummary: "Campaign sends stall, Marketing API requests return 500.",
    keyComponents: ["Marketing API", "Automations Engine", "Campaign Delivery"],
    commonErrorCodes: [
      "500 Internal Server Error",
      "429 Rate Limit (10 simultaneous connections)",
    ],
    troubleshootingSteps: [
      "Check status.mailchimp.com.",
      "Inspect API error response details.",
    ],
    relatedServices: ["klaviyo", "sendgrid"],
  },
  {
    slug: "brevo",
    name: "Brevo (formerly Sendinblue)",
    category: "comms-email",
    domain: "brevo.com",
    officialStatusUrl: "https://status.brevo.com",
    description:
      "All-in-one platform for transactional emails, SMS marketing, and WhatsApp campaigns.",
    impactSummary:
      "Transactional emails fail to dispatch, webhook event deliveries freeze.",
    keyComponents: [
      "Transactional Email API",
      "Marketing Automation",
      "SMS API",
    ],
    commonErrorCodes: ["500 Internal Error", "400 Bad Request"],
    troubleshootingSteps: [
      "Check status.brevo.com.",
      "Verify Brevo API v3 key.",
    ],
    relatedServices: ["sendgrid", "resend"],
  },
  {
    slug: "crisp-chat",
    name: "Crisp Live Chat",
    category: "comms-email",
    domain: "crisp.chat",
    officialStatusUrl: "https://status.crisp.chat",
    description:
      "Customer messaging platform providing live chat widgets and CRM inbox.",
    impactSummary:
      "Chat widget fails to connect WebSocket, customer messages drop.",
    keyComponents: ["Chatbox WebSocket", "Inbox REST API", "Bot Engine"],
    commonErrorCodes: ["500 Server Error", "WebSocket Connection Timeout"],
    troubleshootingSteps: ["Check status.crisp.chat.", "Reload chat session."],
    relatedServices: ["intercom", "zendesk"],
  },
  {
    slug: "webflow",
    name: "Webflow",
    category: "productivity-collab",
    domain: "webflow.com",
    officialStatusUrl: "https://status.webflow.com",
    description:
      "Visual web development platform for building production websites without code.",
    impactSummary:
      "Site publishing fails, CMS API requests return 500, Designer canvas locks.",
    keyComponents: [
      "Designer Canvas",
      "Publishing Engine",
      "CMS REST API",
      "Webflow Ecommerce",
    ],
    commonErrorCodes: [
      "500 Internal Server Error",
      "502 Bad Gateway",
      "Publishing Failed",
    ],
    troubleshootingSteps: [
      "Check status.webflow.com.",
      "Republish site to staging domain first.",
    ],
    relatedServices: ["framer", "vercel"],
    featured: true,
  },
  {
    slug: "framer",
    name: "Framer",
    category: "productivity-collab",
    domain: "framer.com",
    officialStatusUrl: "https://status.framer.com",
    description:
      "Design and publishing tool for lightning-fast responsive websites.",
    impactSummary:
      "Site deployment pipeline stalls, Framer canvas multiplayer disconnects.",
    keyComponents: ["Publishing CDN", "Canvas Editor", "CMS Engine"],
    commonErrorCodes: ["500 Server Error", "504 Gateway Timeout"],
    troubleshootingSteps: [
      "Check status.framer.com.",
      "Refresh Framer project.",
    ],
    relatedServices: ["webflow", "figma"],
  },
  {
    slug: "hubspot",
    name: "HubSpot",
    category: "productivity-collab",
    domain: "hubspot.com",
    officialStatusUrl: "https://status.hubspot.com",
    description:
      "CRM platform with marketing, sales, customer service, and CMS software.",
    impactSummary:
      "Contact form submissions fail, CRM API webhooks back up, Deals workflow rules pause.",
    keyComponents: [
      "CRM Contacts API",
      "Forms API",
      "Workflows Automation",
      "HubSpot CMS",
    ],
    commonErrorCodes: [
      "500 Internal Server Error",
      "429 Rate Limit (100 req/10 sec)",
      "502 Bad Gateway",
    ],
    troubleshootingSteps: [
      "Check status.hubspot.com for specific hub health.",
      "Verify OAuth access token expiration.",
    ],
    relatedServices: ["salesforce", "segment", "intercom"],
    featured: true,
  },
  {
    slug: "salesforce",
    name: "Salesforce (Sales Cloud)",
    category: "productivity-collab",
    domain: "salesforce.com",
    officialStatusUrl: "https://status.salesforce.com",
    description:
      "Enterprise customer relationship management (CRM) software suite.",
    impactSummary:
      "REST/SOAP API calls error out, Apex triggers fail, lightning interface disconnects.",
    keyComponents: [
      "Salesforce REST/Bulk API",
      "Apex Runtime",
      "Lightning Platform",
      "Single Sign-On",
    ],
    commonErrorCodes: [
      "500 Internal Error",
      "REQUEST_LIMIT_EXCEEDED",
      "UNABLE_TO_LOCK_ROW",
    ],
    troubleshootingSteps: [
      "Check status.salesforce.com lookup by instance (e.g. NA123, EU45).",
      "Inspect API limits.",
    ],
    relatedServices: ["hubspot", "workos"],
  },
  {
    slug: "zapier",
    name: "Zapier",
    category: "productivity-collab",
    domain: "zapier.com",
    officialStatusUrl: "https://status.zapier.com",
    description:
      "Workflow automation platform connecting thousands of web apps.",
    impactSummary:
      "Zaps fail to trigger, webhook catches drop payloads, app integrations disconnect.",
    keyComponents: [
      "Zaps Execution Engine",
      "Webhooks by Zapier",
      "App Integration Connectors",
    ],
    commonErrorCodes: [
      "500 Server Error",
      "Connection Timeout",
      "Trigger Failed",
    ],
    troubleshootingSteps: [
      "Check status.zapier.com.",
      "Inspect Zap History for detailed step execution errors.",
    ],
    relatedServices: ["make-com", "n8n-cloud"],
    featured: true,
  },
  {
    slug: "make-com",
    name: "Make.com (Integromat)",
    category: "productivity-collab",
    domain: "make.com",
    officialStatusUrl: "https://status.make.com",
    description:
      "Visual platform to build and automate business processes and multi-step workflows.",
    impactSummary:
      "Scenario executions stall, webhook listeners fail to capture data.",
    keyComponents: ["Scenario Runner Engine", "Custom Webhooks", "Data Stores"],
    commonErrorCodes: ["500 Internal Server Error", "Connection Error"],
    troubleshootingSteps: [
      "Check status.make.com.",
      "Check scenario execution history.",
    ],
    relatedServices: ["zapier", "n8n-cloud"],
  },
  {
    slug: "n8n-cloud",
    name: "n8n Cloud",
    category: "productivity-collab",
    domain: "n8n.io",
    officialStatusUrl: "https://status.n8n.io",
    description:
      "Fair-code workflow automation tool and cloud service for technical teams.",
    impactSummary: "Workflow triggers fail, node execution queue stalls.",
    keyComponents: [
      "Workflow Execution Engine",
      "Webhook Nodes",
      "Credential Store",
    ],
    commonErrorCodes: ["500 Internal Error", "Execution Timed Out"],
    troubleshootingSteps: [
      "Check status.n8n.io.",
      "Restart n8n workflow instance.",
    ],
    relatedServices: ["zapier", "make-com"],
  },
  {
    slug: "privy",
    name: "Privy",
    category: "web3-crypto",
    domain: "privy.io",
    officialStatusUrl: "https://status.privy.io",
    description: "Embedded wallet and authentication library for web3 apps.",
    impactSummary:
      "Embedded wallet creation fails, social login for web3 dApps breaks.",
    keyComponents: ["Embedded Wallets API", "Auth Gateway", "Security Enclave"],
    commonErrorCodes: ["500 Internal Server Error", "401 Unauthorized"],
    troubleshootingSteps: ["Check status.privy.io.", "Verify Privy App ID."],
    relatedServices: ["alchemy", "infura", "clerk"],
  },
  {
    slug: "walletconnect",
    name: "WalletConnect (Reown)",
    category: "web3-crypto",
    domain: "reown.com",
    officialStatusUrl: "https://status.reown.com",
    description:
      "Open protocol for connecting blockchain wallets to decentralized applications.",
    impactSummary:
      "QR code modal pairing fails, mobile wallet signature prompts drop.",
    keyComponents: [
      "Relay Server WebSocket",
      "AppKit / Web3Modal",
      "Verify API",
    ],
    commonErrorCodes: [
      "WebSocket Closed",
      "500 Server Error",
      "Session Expired",
    ],
    troubleshootingSteps: [
      "Check status.reown.com.",
      "Inspect WalletConnect project ID in dashboard.",
    ],
    relatedServices: ["alchemy", "infura", "etherscan"],
  },
  {
    slug: "solscan",
    name: "Solscan (Solana Explorer)",
    category: "web3-crypto",
    domain: "solscan.io",
    officialStatusUrl: "https://status.solscan.io",
    description:
      "Real-time blockchain explorer and developer data API for the Solana network.",
    impactSummary: "Solana transaction tracking APIs return 500 or rate limit.",
    keyComponents: ["Public REST API", "Block Explorer UI", "Token API"],
    commonErrorCodes: ["429 Too Many Requests", "500 Server Error"],
    troubleshootingSteps: [
      "Check Solscan status.",
      "Use Solana RPC getTransaction directly.",
    ],
    relatedServices: ["quicknode", "etherscan"],
  },
  {
    slug: "pagerduty",
    name: "PagerDuty",
    category: "devtools-git",
    domain: "pagerduty.com",
    officialStatusUrl: "https://status.pagerduty.com",
    description:
      "Digital operations management platform providing on-call scheduling, automated incident escalation, and alerts.",
    impactSummary:
      "On-call engineers miss critical P1 outage escalations, SMS and phone call alerts fail to dispatch.",
    keyComponents: [
      "Events API v2",
      "On-Call Notification Engine",
      "Service Directory",
      "Webhooks Ingest",
    ],
    commonErrorCodes: [
      "500 Internal Server Error",
      "429 Rate Limit",
      "502 Bad Gateway",
    ],
    troubleshootingSteps: [
      "Check status.pagerduty.com.",
      "Verify PagerDuty Integration Key in monitoring alerts.",
      "Ensure secondary escalation policies are defined for standby engineers.",
    ],
    relatedServices: ["opsgenie", "datadog", "better-stack", "incident-io"],
    featured: true,
  },
  {
    slug: "opsgenie",
    name: "Opsgenie (Atlassian)",
    category: "devtools-git",
    domain: "opsgenie.com",
    officialStatusUrl: "https://opsgenie.status.atlassian.com",
    description:
      "Modern incident management platform ensuring critical incidents are never missed.",
    impactSummary:
      "Alert routing rules fail, push notifications and voice calls fail to wake on-call team.",
    keyComponents: [
      "Alert Creation API",
      "Heartbeat Monitor",
      "Escalation Policies",
      "Schedules",
    ],
    commonErrorCodes: ["500 Internal Error", "504 Gateway Timeout"],
    troubleshootingSteps: [
      "Check opsgenie.status.atlassian.com.",
      "Verify API key permissions.",
    ],
    relatedServices: ["pagerduty", "jira", "datadog"],
  },
  {
    slug: "incident-io",
    name: "incident.io",
    category: "devtools-git",
    domain: "incident.io",
    officialStatusUrl: "https://status.incident.io",
    description:
      "Incident management platform natively integrated into Slack for managing operational response.",
    impactSummary:
      "Slack /inc declare commands fail, incident timeline updates do not sync.",
    keyComponents: [
      "Slack App Bot",
      "Incident API",
      "Public Status Pages",
      "Catalog Sync",
    ],
    commonErrorCodes: ["500 Server Error", "Slack App Timeout"],
    troubleshootingSteps: [
      "Check status.incident.io.",
      "Manage incident manually in a dedicated war room channel.",
    ],
    relatedServices: ["slack", "pagerduty", "linear"],
  },
  {
    slug: "rootly",
    name: "Rootly",
    category: "devtools-git",
    domain: "rootly.com",
    officialStatusUrl: "https://status.rootly.com",
    description:
      "Slack-native incident management platform and automated post-mortem generator.",
    impactSummary:
      "Incident workflows stall, automated Jira ticket creation halts.",
    keyComponents: [
      "Slack Integration",
      "Rootly API",
      "Post-Mortem Engine",
      "Integrations",
    ],
    commonErrorCodes: ["500 Server Error", "502 Bad Gateway"],
    troubleshootingSteps: [
      "Check status.rootly.com.",
      "Inspect bot permissions in Slack.",
    ],
    relatedServices: ["incident-io", "pagerduty", "slack"],
  },
  {
    slug: "firehydrant",
    name: "FireHydrant",
    category: "devtools-git",
    domain: "firehydrant.com",
    officialStatusUrl: "https://status.firehydrant.com",
    description:
      "All-in-one incident management software to automate incident response processes.",
    impactSummary: "Runbooks fail to trigger, automated communications stall.",
    keyComponents: ["Runbook Engine", "Incident API", "Status Pages"],
    commonErrorCodes: ["500 Internal Error", "504 Timeout"],
    troubleshootingSteps: [
      "Check status.firehydrant.com.",
      "Trigger manual incident declaration.",
    ],
    relatedServices: ["pagerduty", "opsgenie"],
  },
  {
    slug: "signoz",
    name: "SigNoz Cloud",
    category: "devtools-git",
    domain: "signoz.io",
    officialStatusUrl: "https://status.signoz.io",
    description:
      "Open-source observability platform natively built on OpenTelemetry and ClickHouse.",
    impactSummary:
      "OTel collector ingestion fails, APM dashboards show missing traces.",
    keyComponents: [
      "OTel Ingest Gateway",
      "ClickHouse Query Engine",
      "Alert Manager",
    ],
    commonErrorCodes: ["503 Service Unavailable", "500 Server Error"],
    troubleshootingSteps: [
      "Check status.signoz.io.",
      "Inspect OTel collector logs on client application.",
    ],
    relatedServices: ["datadog", "grafana-cloud", "honeycomb"],
  },
  {
    slug: "hyperdx",
    name: "HyperDX",
    category: "devtools-git",
    domain: "hyperdx.io",
    officialStatusUrl: "https://status.hyperdx.io",
    description:
      "Developer-first observability platform connecting logs, traces, and session replays.",
    impactSummary:
      "Browser session replays stop recording, log ingestion returns 500.",
    keyComponents: ["Ingest API", "Session Replay Engine", "Search Interface"],
    commonErrorCodes: ["500 Server Error", "504 Gateway Timeout"],
    troubleshootingSteps: [
      "Check status.hyperdx.io.",
      "Verify API key in client SDK initialization.",
    ],
    relatedServices: ["sentry", "posthog", "datadog"],
  },
  {
    slug: "logrocket",
    name: "LogRocket",
    category: "devtools-git",
    domain: "logrocket.com",
    officialStatusUrl: "https://status.logrocket.com",
    description:
      "Frontend monitoring and session replay solution that records user interactions and network errors.",
    impactSummary:
      "Session recording uploads fail in user browsers, increasing client-side CPU overhead.",
    keyComponents: [
      "Ingest Collectors",
      "Replay Engine",
      "Network Monitor",
      "Performance Metrics",
    ],
    commonErrorCodes: ["500 Internal Server Error", "429 Quota Exceeded"],
    troubleshootingSteps: [
      "Check status.logrocket.com.",
      "Reduce client session recording sampleRate.",
    ],
    relatedServices: ["sentry", "posthog", "highlight-io"],
  },
  {
    slug: "highlight-io",
    name: "Highlight.io",
    category: "devtools-git",
    domain: "highlight.io",
    officialStatusUrl: "https://status.highlight.io",
    description:
      "Open source full-stack monitoring platform with session replay, error monitoring, and logging.",
    impactSummary:
      "Error capture telemetry drops, frontend session recording fails to send.",
    keyComponents: [
      "Telemetry Ingestion",
      "Session Recording Player",
      "Error Monitoring",
    ],
    commonErrorCodes: ["500 Internal Error", "504 Gateway Timeout"],
    troubleshootingSteps: [
      "Check status.highlight.io.",
      "Verify project ID in H.init().",
    ],
    relatedServices: ["sentry", "logrocket", "posthog"],
  },
  {
    slug: "algolia",
    name: "Algolia",
    category: "devtools-git",
    domain: "algolia.com",
    officialStatusUrl: "https://status.algolia.com",
    description:
      "AI search and discovery platform providing real-time search API and neural search indices.",
    impactSummary:
      "Website search bars freeze, search queries return 500, record indexing queues stall.",
    keyComponents: [
      "Search REST API",
      "Indexing Pipeline",
      "NeuralSearch Engine",
      "Recommend API",
    ],
    commonErrorCodes: [
      "503 Service Unavailable",
      "429 Rate Limit",
      "500 Internal Server Error",
    ],
    troubleshootingSteps: [
      "Check status.algolia.com (check DSN Distributed Search Network clusters).",
      "Verify Algolia search-only API key permissions.",
      "Implement local cache fallback for top search keywords.",
    ],
    relatedServices: ["meilisearch", "typesense", "pinecone"],
    featured: true,
  },
  {
    slug: "meilisearch",
    name: "Meilisearch Cloud",
    category: "devtools-git",
    domain: "meilisearch.com",
    officialStatusUrl: "https://status.meilisearch.com",
    description: "Ultra-fast, typo-tolerant open-source search engine cloud.",
    impactSummary:
      "Instant search inputs freeze, document updates stall in task queue.",
    keyComponents: ["Search API", "Task Queue", "Index Manager"],
    commonErrorCodes: ["500 Internal Error", "504 Gateway Timeout"],
    troubleshootingSteps: [
      "Check status.meilisearch.com.",
      "Inspect task queue for failed batch tasks.",
    ],
    relatedServices: ["algolia", "typesense"],
  },
  {
    slug: "typesense",
    name: "Typesense Cloud",
    category: "devtools-git",
    domain: "typesense.org",
    officialStatusUrl: "https://status.typesense.org",
    description:
      "Fast, typo-tolerant search engine optimized for developer productivity and instant search-as-you-type.",
    impactSummary:
      "Search requests fail, document curation rules stop working.",
    keyComponents: [
      "Multi-Region Clusters",
      "Search API",
      "Document Ingestion",
    ],
    commonErrorCodes: ["503 Service Unavailable", "500 Server Error"],
    troubleshootingSteps: [
      "Check status.typesense.org.",
      "Verify cluster nodes health.",
    ],
    relatedServices: ["meilisearch", "algolia"],
  },
  {
    slug: "trigger-dev",
    name: "Trigger.dev",
    category: "devtools-git",
    domain: "trigger.dev",
    officialStatusUrl: "https://status.trigger.dev",
    description:
      "Developer-first background jobs framework built for long-running workflows with zero timeouts.",
    impactSummary:
      "Background task triggers freeze, serverless task queues fail to process runs.",
    keyComponents: [
      "Realtime Engine",
      "Task Execution Runtime",
      "Dashboard UI",
      "Webhooks Queue",
    ],
    commonErrorCodes: [
      "500 Internal Server Error",
      "Run Timed Out",
      "504 Gateway Timeout",
    ],
    troubleshootingSteps: [
      "Check status.trigger.dev.",
      "Inspect run logs in Trigger.dev dashboard.",
    ],
    relatedServices: ["inngest", "upstash", "temporal"],
    featured: true,
  },
  {
    slug: "inngest",
    name: "Inngest",
    category: "devtools-git",
    domain: "inngest.com",
    officialStatusUrl: "https://status.inngest.com",
    description:
      "Event-driven durable execution engine to build step functions, background jobs, and workflows.",
    impactSummary:
      "Event ingest drops events, function steps fail to resume after sleep or await.",
    keyComponents: [
      "Event Ingest API",
      "Durable Execution Engine",
      "Step Concurrency Controller",
    ],
    commonErrorCodes: ["500 Internal Server Error", "Event Delivery Failed"],
    troubleshootingSteps: [
      "Check status.inngest.com.",
      "Verify Inngest signing key and app serve handler.",
    ],
    relatedServices: ["trigger-dev", "upstash", "temporal"],
    featured: true,
  },
  {
    slug: "temporal",
    name: "Temporal Cloud",
    category: "devtools-git",
    domain: "temporal.io",
    officialStatusUrl: "https://status.temporal.io",
    description:
      "Open-source and managed durable execution platform to orchestrate mission-critical distributed systems.",
    impactSummary:
      "Workflow executions stall, worker pollers lose connection to Temporal Cloud cluster.",
    keyComponents: [
      "Temporal Frontend Service",
      "History Engine",
      "Matching Service",
      "Temporal Web UI",
    ],
    commonErrorCodes: [
      "RESOURCE_EXHAUSTED",
      "UNAVAILABLE",
      "DEADLINE_EXCEEDED",
    ],
    troubleshootingSteps: [
      "Check status.temporal.io.",
      "Verify client TLS mTLS certificates and namespace health.",
    ],
    relatedServices: ["inngest", "trigger-dev", "aws-sqs"],
  },
  {
    slug: "mintlify",
    name: "Mintlify",
    category: "productivity-collab",
    domain: "mintlify.com",
    officialStatusUrl: "https://status.mintlify.com",
    description:
      "Modern documentation platform built for developers, with interactive API playground and search.",
    impactSummary:
      "Documentation portals fail to load, GitHub sync for docs publishing errors.",
    keyComponents: [
      "Documentation CDN",
      "GitHub Sync Engine",
      "AI Search Assistant",
    ],
    commonErrorCodes: ["500 Server Error", "502 Bad Gateway"],
    troubleshootingSteps: [
      "Check status.mintlify.com.",
      "Trigger manual sync in Mintlify dashboard.",
    ],
    relatedServices: ["gitbook", "github", "readme-io"],
  },
  {
    slug: "gitbook",
    name: "GitBook",
    category: "productivity-collab",
    domain: "gitbook.com",
    officialStatusUrl: "https://status.gitbook.com",
    description:
      "Documentation platform where technical teams document products, APIs, and internal knowledge.",
    impactSummary:
      "Public documentation sites return 500, Git sync operations error.",
    keyComponents: [
      "Published Sites CDN",
      "Git Sync Engine",
      "Visitor Analytics",
    ],
    commonErrorCodes: ["500 Internal Error", "504 Timeout"],
    troubleshootingSteps: [
      "Check status.gitbook.com.",
      "Verify GitBook space permissions.",
    ],
    relatedServices: ["mintlify", "notion"],
  },
  {
    slug: "readme-io",
    name: "ReadMe.io",
    category: "productivity-collab",
    domain: "readme.com",
    officialStatusUrl: "https://status.readme.com",
    description:
      "Interactive API documentation hub with live API metrics and developer onboarding.",
    impactSummary:
      "Interactive API explorer calls fail, OpenAPI spec imports error.",
    keyComponents: [
      "API Reference Engine",
      "Metrics Logging API",
      "Developer Hub",
    ],
    commonErrorCodes: ["500 Internal Error", "503 Service Unavailable"],
    troubleshootingSteps: [
      "Check status.readme.com.",
      "Validate OpenAPI specification syntax.",
    ],
    relatedServices: ["mintlify", "gitbook"],
  },
  {
    slug: "postman",
    name: "Postman",
    category: "devtools-git",
    domain: "postman.com",
    officialStatusUrl: "https://status.postman.com",
    description:
      "API platform for building and using APIs, managing collections, and automated mock servers.",
    impactSummary:
      "Cloud collection sync disconnects, mock servers and automated monitors fail.",
    keyComponents: [
      "Collection Cloud Sync",
      "Postman Mock Servers",
      "Postman Monitors",
      "Public API Network",
    ],
    commonErrorCodes: [
      "500 Internal Error",
      "Sync Failed",
      "504 Gateway Timeout",
    ],
    troubleshootingSteps: [
      "Check status.postman.com.",
      "Switch to offline mode in desktop app.",
    ],
    relatedServices: ["github", "readme-io"],
  },
  {
    slug: "retool",
    name: "Retool",
    category: "productivity-collab",
    domain: "retool.com",
    officialStatusUrl: "https://status.retool.com",
    description:
      "Development platform to build internal tools, admin panels, and workflows on top of databases and APIs.",
    impactSummary:
      "Internal ops dashboards fail to load, SQL query runners timeout, Retool Workflows fail.",
    keyComponents: [
      "App Editor & Runtime",
      "Retool Database",
      "Retool Workflows Engine",
      "Resource Connectors",
    ],
    commonErrorCodes: [
      "500 Internal Server Error",
      "Query Timed Out",
      "504 Gateway Timeout",
    ],
    troubleshootingSteps: [
      "Check status.retool.com.",
      "Check database resource connection credentials in Retool Resources.",
      "Review query timeout limits in Retool query settings.",
    ],
    relatedServices: ["supabase", "postgres", "appsmith"],
    featured: true,
  },
  {
    slug: "appsmith",
    name: "Appsmith Cloud",
    category: "productivity-collab",
    domain: "appsmith.com",
    officialStatusUrl: "https://status.appsmith.com",
    description: "Open-source internal tool development platform.",
    impactSummary:
      "Admin portal queries fail, UI widgets throw JavaScript evaluation errors.",
    keyComponents: [
      "Cloud Workspace",
      "Data Source Connectors",
      "JS Object Engine",
    ],
    commonErrorCodes: ["500 Internal Error", "Datasource Connection Failed"],
    troubleshootingSteps: [
      "Check status.appsmith.com.",
      "Verify IP allowlist for connected databases.",
    ],
    relatedServices: ["retool", "supabase"],
  },
  {
    slug: "liveblocks",
    name: "Liveblocks",
    category: "productivity-collab",
    domain: "liveblocks.io",
    officialStatusUrl: "https://status.liveblocks.io",
    description:
      "Real-time collaborative infrastructure providing presence, comments, and multiplayer storage.",
    impactSummary:
      "Multiplayer room connections fail, comments real-time sync stalls.",
    keyComponents: [
      "Liveblocks WebSocket Mesh",
      "Presence Engine",
      "Storage & Comments API",
    ],
    commonErrorCodes: ["WebSocket Connection Closed", "500 Server Error"],
    troubleshootingSteps: [
      "Check status.liveblocks.io.",
      "Verify room authentication endpoint returns valid JWT.",
    ],
    relatedServices: ["pusher", "ably", "supabase"],
  },
  {
    slug: "partykit",
    name: "PartyKit (Cloudflare)",
    category: "productivity-collab",
    domain: "partykit.io",
    officialStatusUrl: "https://status.partykit.io",
    description:
      "Real-time multiplayer server infrastructure built on Cloudflare Workers and Durable Objects.",
    impactSummary:
      "WebSocket rooms disconnect, collaborative state changes fail to persist.",
    keyComponents: ["PartyKit Edge Runtime", "Room Mesh", "Deploy Engine"],
    commonErrorCodes: ["1006 Connection Closed", "500 Worker Error"],
    troubleshootingSteps: [
      "Check PartyKit status.",
      "Inspect room server logs via partykit tail.",
    ],
    relatedServices: ["cloudflare", "liveblocks"],
  },
  {
    slug: "gitguardian",
    name: "GitGuardian",
    category: "auth-security",
    domain: "gitguardian.com",
    officialStatusUrl: "https://status.gitguardian.com",
    description:
      "Code security and automated secret detection platform protecting Git repositories.",
    impactSummary:
      "Pre-commit and PR scan checks block CI pipelines with timeout errors.",
    keyComponents: [
      "Secret Detection API",
      "GitHub App Webhook Ingest",
      "Internal Monitoring",
    ],
    commonErrorCodes: ["500 Server Error", "504 Timeout"],
    troubleshootingSteps: [
      "Check status.gitguardian.com.",
      "Bypass non-blocking GitGuardian checks during outages.",
    ],
    relatedServices: ["github", "snyk"],
  },
  {
    slug: "semgrep",
    name: "Semgrep Cloud",
    category: "auth-security",
    domain: "semgrep.dev",
    officialStatusUrl: "https://status.semgrep.dev",
    description:
      "Static code analysis (SAST) and software supply chain security platform.",
    impactSummary:
      "CI security scans fail to upload results or download rule packs.",
    keyComponents: ["Rules Registry", "App Ingestion API", "Secrets Scanner"],
    commonErrorCodes: ["500 Internal Error", "Failed to download rules"],
    troubleshootingSteps: [
      "Check status.semgrep.dev.",
      "Run local ruleset semgrep --config=auto.",
    ],
    relatedServices: ["snyk", "github"],
  },
  {
    slug: "cloudflare-turnstile",
    name: "Cloudflare Turnstile",
    category: "auth-security",
    domain: "cloudflare.com/products/turnstile",
    officialStatusUrl: "https://www.cloudflarestatus.com",
    description:
      "Smart CAPTCHA alternative providing seamless bot protection without puzzles.",
    impactSummary:
      "Widget fails to generate challenge response token, siteverify API rejects valid tokens.",
    keyComponents: ["Turnstile Widget Script", "siteverify API Endpoint"],
    commonErrorCodes: [
      "invalid-input-response",
      "timeout-or-duplicate",
      "500 Server Error",
    ],
    troubleshootingSteps: [
      "Check Cloudflare status.",
      "Verify sitekey and secretKey.",
    ],
    relatedServices: ["cloudflare", "hcaptcha", "recaptcha"],
    featured: true,
  },
  {
    slug: "razorpay",
    name: "Razorpay",
    category: "payments-fintech",
    domain: "razorpay.com",
    officialStatusUrl: "https://status.razorpay.com",
    description:
      "Payment gateway and financial solutions platform powering Indian and international businesses.",
    impactSummary:
      "UPI and net banking checkouts fail, webhook notifications stop delivering.",
    keyComponents: [
      "Payment Gateway API",
      "UPI Stack",
      "Payouts API",
      "Subscriptions",
    ],
    commonErrorCodes: [
      "BAD_REQUEST_ERROR",
      "GATEWAY_ERROR",
      "500 Server Error",
    ],
    troubleshootingSteps: [
      "Check status.razorpay.com.",
      "Verify webhook signature validation.",
    ],
    relatedServices: ["stripe", "paypal"],
  },
  {
    slug: "mollie",
    name: "Mollie Payments",
    category: "payments-fintech",
    domain: "mollie.com",
    officialStatusUrl: "https://status.mollie.com",
    description:
      "European payment service provider supporting iDEAL, Bancontact, cards, and Apple Pay.",
    impactSummary:
      "iDEAL bank redirect flows fail, payment status webhooks stall.",
    keyComponents: ["Payments API v2", "Orders API", "Hosted Payment Pages"],
    commonErrorCodes: ["500 Internal Server Error", "422 Unprocessable Entity"],
    troubleshootingSteps: [
      "Check status.mollie.com.",
      "Inspect payment ID status via Mollie Dashboard.",
    ],
    relatedServices: ["stripe", "adyen"],
  },
  {
    slug: "paystack",
    name: "Paystack (Stripe)",
    category: "payments-fintech",
    domain: "paystack.com",
    officialStatusUrl: "https://status.paystack.com",
    description:
      "Modern payment gateway powering transactions across Africa (Nigeria, Ghana, South Africa, Kenya).",
    impactSummary:
      "Card and bank transfer transactions reject, webhook events queue with delays.",
    keyComponents: [
      "Transaction Initialize API",
      "Transfer Payouts",
      "Webhook Dispatcher",
    ],
    commonErrorCodes: ["500 Internal Error", "504 Gateway Timeout"],
    troubleshootingSteps: [
      "Check status.paystack.com.",
      "Verify transaction reference in Paystack Dashboard.",
    ],
    relatedServices: ["stripe", "flutterwave"],
  },
  {
    slug: "flutterwave",
    name: "Flutterwave",
    category: "payments-fintech",
    domain: "flutterwave.com",
    officialStatusUrl: "https://status.flutterwave.com",
    description:
      "African payment technology company connecting businesses with global consumers.",
    impactSummary:
      "Card processing errors, Mobile Money and MPESA payment rails fail.",
    keyComponents: ["Standard Checkout", "Payouts API", "Mobile Money Gateway"],
    commonErrorCodes: ["500 Server Error", "Transaction Failed"],
    troubleshootingSteps: [
      "Check status.flutterwave.com.",
      "Verify secret hash in webhook headers.",
    ],
    relatedServices: ["paystack", "stripe"],
  },
  {
    slug: "motherduck",
    name: "MotherDuck (DuckDB Cloud)",
    category: "databases-storage",
    domain: "motherduck.com",
    officialStatusUrl: "https://status.motherduck.com",
    description:
      "Serverless cloud analytics platform powered by DuckDB for fast data processing.",
    impactSummary:
      "DuckDB hybrid local/cloud queries fail, attached database sync errors.",
    keyComponents: [
      "MotherDuck Cloud Engine",
      "DuckDB Extension API",
      "Web UI",
    ],
    commonErrorCodes: ["500 Server Error", "Query Execution Error"],
    troubleshootingSteps: [
      "Check MotherDuck status.",
      "Run query locally in in-memory DuckDB.",
    ],
    relatedServices: ["clickhouse-cloud", "snowflake"],
  },
  {
    slug: "confluent-cloud",
    name: "Confluent Cloud (Apache Kafka)",
    category: "databases-storage",
    domain: "confluent.cloud",
    officialStatusUrl: "https://status.confluent.cloud",
    description:
      "Fully managed Apache Kafka event streaming service and data streaming platform.",
    impactSummary:
      "Kafka producers throw TimeoutException, consumer groups lag and disconnect.",
    keyComponents: [
      "Kafka Brokers",
      "Schema Registry",
      "Kafka Connect",
      "ksqlDB",
    ],
    commonErrorCodes: [
      "NOT_ENOUGH_REPLICAS",
      "REQUEST_TIMED_OUT",
      "500 Server Error",
    ],
    troubleshootingSteps: [
      "Check status.confluent.cloud.",
      "Inspect Kafka consumer group offsets.",
    ],
    relatedServices: ["upstash", "redpanda"],
  },
  {
    slug: "redpanda",
    name: "Redpanda Cloud",
    category: "databases-storage",
    domain: "redpanda.com",
    officialStatusUrl: "https://status.redpanda.com",
    description:
      "C++ streaming data platform compatible with Apache Kafka APIs with low latency.",
    impactSummary:
      "Topic partition leadership changes cause producer retry loops.",
    keyComponents: ["Redpanda Broker Cluster", "Schema Registry", "HTTP Proxy"],
    commonErrorCodes: ["503 Unavailable", "Produce Request Timeout"],
    troubleshootingSteps: [
      "Check status.redpanda.com.",
      "Verify broker bootstrap URLs.",
    ],
    relatedServices: ["confluent-cloud", "upstash"],
  },
  {
    slug: "cloudamqp",
    name: "CloudAMQP (RabbitMQ Cloud)",
    category: "databases-storage",
    domain: "cloudamqp.com",
    officialStatusUrl: "https://status.cloudamqp.com",
    description:
      "Managed RabbitMQ and LavinMQ message broker clusters in the cloud.",
    impactSummary:
      "AMQP connection channel closes, message queues fill without consumers.",
    keyComponents: [
      "RabbitMQ Clusters",
      "AMQP 0-9-1 Protocol",
      "Management HTTP API",
    ],
    commonErrorCodes: [
      "500 Internal Error",
      "Channel Closed",
      "Connection Blocked",
    ],
    troubleshootingSteps: [
      "Check status.cloudamqp.com.",
      "Inspect queue memory alarm limits in RabbitMQ UI.",
    ],
    relatedServices: ["aws-sqs", "upstash"],
  },
  {
    slug: "dbt-cloud",
    name: "dbt Cloud",
    category: "databases-storage",
    domain: "getdbt.com",
    officialStatusUrl: "https://status.getdbt.com",
    description:
      "Hosted environment for data transformation, CI/CD, and data pipeline scheduling.",
    impactSummary:
      "Automated dbt build jobs fail to trigger, model DAG documentation fails to update.",
    keyComponents: [
      "dbt Scheduler",
      "Cloud IDE",
      "Semantic Layer",
      "Metadata API",
    ],
    commonErrorCodes: [
      "500 Internal Error",
      "Job Run Failed",
      "504 Gateway Timeout",
    ],
    troubleshootingSteps: [
      "Check status.getdbt.com.",
      "Run dbt run locally against warehouse.",
    ],
    relatedServices: ["snowflake", "gcp-bigquery", "databricks"],
  },
  {
    slug: "fivetran",
    name: "Fivetran",
    category: "databases-storage",
    domain: "fivetran.com",
    officialStatusUrl: "https://status.fivetran.com",
    description:
      "Automated data movement and ELT pipeline platform connecting sources to warehouses.",
    impactSummary:
      "Data sync connectors freeze, destination warehouse tables show stale data.",
    keyComponents: [
      "Connector Sync Engine",
      "Transformations",
      "REST API & Webhooks",
    ],
    commonErrorCodes: ["500 Server Error", "Connector Broken"],
    troubleshootingSteps: [
      "Check status.fivetran.com.",
      "Re-authenticate source database connection.",
    ],
    relatedServices: ["dbt-cloud", "snowflake"],
  },
  {
    slug: "airbyte-cloud",
    name: "Airbyte Cloud",
    category: "databases-storage",
    domain: "airbyte.com",
    officialStatusUrl: "https://status.airbyte.com",
    description:
      "Open-source and managed data integration platform for building ELT pipelines.",
    impactSummary:
      "Source-to-destination sync jobs fail, schema drift checks error.",
    keyComponents: [
      "Sync Scheduler",
      "Connector Registry",
      "Normalization Engine",
    ],
    commonErrorCodes: ["500 Internal Error", "Job Failed"],
    troubleshootingSteps: [
      "Check status.airbyte.com.",
      "Inspect connector container logs.",
    ],
    relatedServices: ["fivetran", "snowflake"],
  },
  {
    slug: "rudderstack",
    name: "RudderStack",
    category: "devtools-git",
    domain: "rudderstack.com",
    officialStatusUrl: "https://status.rudderstack.com",
    description:
      "Customer data platform (CDP) and pipeline designed for developer-first data architectures.",
    impactSummary: "Event SDK tracking calls queue, warehouse ETL sync fails.",
    keyComponents: [
      "Event Stream Ingestion",
      "Reverse ETL Engine",
      "Transformations",
    ],
    commonErrorCodes: ["500 Server Error", "504 Timeout"],
    troubleshootingSteps: [
      "Check status.rudderstack.com.",
      "Verify writeKey configuration.",
    ],
    relatedServices: ["segment", "posthog"],
  },
  {
    slug: "plausible-analytics",
    name: "Plausible Analytics",
    category: "devtools-git",
    domain: "plausible.io",
    officialStatusUrl: "https://status.plausible.io",
    description:
      "Simple, lightweight (< 1 KB), open-source, and privacy-friendly web analytics.",
    impactSummary:
      "plausible.js script returns 500, stats dashboard is unreachable.",
    keyComponents: ["Event Ingestion Endpoint", "Stats Dashboard", "Stats API"],
    commonErrorCodes: ["500 Server Error", "502 Bad Gateway"],
    troubleshootingSteps: [
      "Check status.plausible.io.",
      "Verify script data-domain attribute.",
    ],
    relatedServices: ["posthog", "mixpanel"],
  },
  {
    slug: "fathom-analytics",
    name: "Fathom Analytics",
    category: "devtools-git",
    domain: "usefathom.com",
    officialStatusUrl: "https://status.usefathom.com",
    description:
      "Privacy-focused website analytics without cookies or tracking personal data.",
    impactSummary:
      "Analytics beacon hits fail to record, visitor counts do not update.",
    keyComponents: ["Global Edge CDN", "Ingestion API", "Dashboard Portal"],
    commonErrorCodes: ["500 Internal Error", "504 Gateway Timeout"],
    troubleshootingSteps: ["Check status.usefathom.com.", "Verify site ID."],
    relatedServices: ["plausible-analytics", "posthog"],
  },
  {
    slug: "umami-cloud",
    name: "Umami Cloud",
    category: "devtools-git",
    domain: "umami.is",
    officialStatusUrl: "https://status.umami.is",
    description:
      "Privacy-focused, open-source alternative to Google Analytics.",
    impactSummary: "Event tracking API returns 500, dashboard graphs go blank.",
    keyComponents: ["Tracker Script", "Cloud Database API", "Reporting UI"],
    commonErrorCodes: ["500 Server Error", "502 Bad Gateway"],
    troubleshootingSteps: [
      "Check status.umami.is.",
      "Verify website-id parameter.",
    ],
    relatedServices: ["plausible-analytics", "posthog"],
  },
  {
    slug: "uptimerobot",
    name: "UptimeRobot",
    category: "devtools-git",
    domain: "uptimerobot.com",
    officialStatusUrl: "https://status.uptimerobot.com",
    description:
      "Uptime monitoring service offering HTTP, ping, port, and keyword checks.",
    impactSummary:
      "Monitoring checks stop executing, alert notifications fail to send.",
    keyComponents: [
      "Monitor Probe Engine",
      "Public Status Pages",
      "Alert Dispatcher",
    ],
    commonErrorCodes: ["500 Internal Server Error", "502 Bad Gateway"],
    troubleshootingSteps: [
      "Check status.uptimerobot.com.",
      "Switch to SteadyStack edge monitoring.",
    ],
    relatedServices: ["better-stack", "checkly", "pingdom"],
  },
  {
    slug: "pingdom",
    name: "Pingdom (SolarWinds)",
    category: "devtools-git",
    domain: "pingdom.com",
    officialStatusUrl: "https://status.pingdom.com",
    description: "Website performance and availability monitoring provider.",
    impactSummary:
      "Uptime check alerts delay, Real User Monitoring (RUM) beacon script fails.",
    keyComponents: [
      "Synthetics Engine",
      "RUM Analytics",
      "Public Status Pages",
    ],
    commonErrorCodes: ["500 Server Error", "503 Service Unavailable"],
    troubleshootingSteps: [
      "Check status.pingdom.com.",
      "Verify Pingdom probe IP allowlist in firewall.",
    ],
    relatedServices: ["uptimerobot", "better-stack"],
  },
  {
    slug: "site24x7",
    name: "Site24x7 (Zoho)",
    category: "devtools-git",
    domain: "site24x7.com",
    officialStatusUrl: "https://status.site24x7.com",
    description: "All-in-one monitoring solution for DevOps and IT operations.",
    impactSummary:
      "Server agent heartbeat disconnects, synthetic web tests time out.",
    keyComponents: [
      "Server Monitoring Agent",
      "APM Insight",
      "Synthetic Web Probes",
    ],
    commonErrorCodes: ["500 Internal Error", "Agent Communication Error"],
    troubleshootingSteps: [
      "Check status.site24x7.com.",
      "Inspect site24x7-agent service on server.",
    ],
    relatedServices: ["datadog", "new-relic"],
  },
  {
    slug: "inngest-cloud",
    name: "Inngest Cloud",
    category: "devtools-git",
    domain: "inngest.com",
    officialStatusUrl: "https://status.inngest.com",
    description: "Durable workflow and serverless queue orchestrator.",
    impactSummary: "Background step functions stall and fail to resume.",
    keyComponents: ["Step Orchestrator", "SDK Connection", "Event Log"],
    commonErrorCodes: ["500 Server Error", "Step Function Failed"],
    troubleshootingSteps: [
      "Check status.inngest.com.",
      "Verify Inngest serve handler endpoint.",
    ],
    relatedServices: ["trigger-dev", "temporal"],
  },
  {
    slug: "qstash",
    name: "Upstash QStash",
    category: "databases-storage",
    domain: "upstash.com/docs/qstash",
    officialStatusUrl: "https://status.upstash.com",
    description:
      "Serverless message queue and task scheduler designed for serverless runtimes.",
    impactSummary:
      "Scheduled cron messages drop, webhook retry delivery halts.",
    keyComponents: ["Publish Endpoint", "Cron Scheduler", "Signature Verifier"],
    commonErrorCodes: ["500 Internal Error", "401 Unauthorized", "504 Timeout"],
    troubleshootingSteps: [
      "Check status.upstash.com.",
      "Verify QSTASH_TOKEN in environment variables.",
    ],
    relatedServices: ["upstash", "trigger-dev"],
  },
  {
    slug: "neon-db",
    name: "Neon DB",
    category: "databases-storage",
    domain: "neon.tech",
    officialStatusUrl: "https://neonstatus.com",
    description: "Serverless PostgreSQL platform built for cloud applications.",
    impactSummary:
      "Postgres connections drop, auto-suspend wakeups take longer than expected.",
    keyComponents: [
      "Serverless Storage",
      "Compute Instances",
      "Branching Engine",
    ],
    commonErrorCodes: ["500 Server Error", "Connection Refused"],
    troubleshootingSteps: [
      "Check neonstatus.com.",
      "Use pooled connection string.",
    ],
    relatedServices: ["supabase", "planetscale"],
  },
  {
    slug: "turso-db",
    name: "Turso DB",
    category: "databases-storage",
    domain: "turso.tech",
    officialStatusUrl: "https://status.turso.tech",
    description:
      "SQLite-compatible distributed database for low latency edge computing.",
    impactSummary:
      "Edge replicas return connection refused, sync operations freeze.",
    keyComponents: ["libSQL Primary", "Edge Replicas", "HTTP Pipeline"],
    commonErrorCodes: ["500 Internal Error", "Connection Timeout"],
    troubleshootingSteps: [
      "Check status.turso.tech.",
      "Verify Turso database URL.",
    ],
    relatedServices: ["supabase", "neon"],
  },
  {
    slug: "prisma-accelerate",
    name: "Prisma Accelerate",
    category: "databases-storage",
    domain: "prisma.io/accelerate",
    officialStatusUrl: "https://status.prisma.io",
    description:
      "Global database cache and connection pooler for Prisma ORM at the edge.",
    impactSummary:
      "Prisma queries proxied through Accelerate return 500 or timeout.",
    keyComponents: [
      "Connection Pool Gateway",
      "Global Edge Cache",
      "Query Metrics",
    ],
    commonErrorCodes: [
      "500 Internal Server Error",
      "P5000 Accelerate Connection Error",
      "504 Gateway Timeout",
    ],
    troubleshootingSteps: [
      "Check status.prisma.io.",
      "Bypass Accelerate by using direct database connection string temporarily in schema.prisma.",
      "Verify PRISMA_ACCELERATE_URL validity.",
    ],
    relatedServices: ["supabase", "neon", "planetscale"],
    featured: true,
  },
  {
    slug: "prisma-pulse",
    name: "Prisma Pulse",
    category: "databases-storage",
    domain: "prisma.io/pulse",
    officialStatusUrl: "https://status.prisma.io",
    description:
      "Real-time Change Data Capture (CDC) stream for Postgres databases with Prisma.",
    impactSummary:
      "Real-time database change events stop streaming to subscribers.",
    keyComponents: ["Postgres CDC Engine", "Subscription Stream", "Pulse API"],
    commonErrorCodes: ["500 Server Error", "Stream Disconnected"],
    troubleshootingSteps: [
      "Check status.prisma.io.",
      "Verify Postgres replication slot state.",
    ],
    relatedServices: ["supabase", "prisma-accelerate"],
  },
  {
    slug: "clerk-auth",
    name: "Clerk Auth",
    category: "auth-security",
    domain: "clerk.com",
    officialStatusUrl: "https://status.clerk.com",
    description:
      "Authentication and user management for modern full-stack web and mobile applications.",
    impactSummary: "Sign in and sign up flows fail, middleware throws 500.",
    keyComponents: ["Frontend SDK", "Backend API", "User Management"],
    commonErrorCodes: ["500 Server Error", "401 Unauthorized"],
    troubleshootingSteps: [
      "Check status.clerk.com.",
      "Verify CLERK_SECRET_KEY in environment.",
    ],
    relatedServices: ["auth0", "supabase"],
  },
  {
    slug: "auth0-okta",
    name: "Auth0 Identity",
    category: "auth-security",
    domain: "auth0.com",
    officialStatusUrl: "https://status.auth0.com",
    description: "Enterprise authentication, authorization, and SSO service.",
    impactSummary: "Users cannot log in, OAuth2 token validation fails.",
    keyComponents: ["Universal Login", "Management API", "OIDC Handshake"],
    commonErrorCodes: ["500 Server Error", "invalid_grant"],
    troubleshootingSteps: ["Check status.auth0.com.", "Inspect tenant logs."],
    relatedServices: ["clerk", "okta"],
  },
  {
    slug: "openai-api",
    name: "OpenAI API",
    category: "ai-ml",
    domain: "api.openai.com",
    officialStatusUrl: "https://status.openai.com",
    description:
      "Developer API for GPT-4o, o1, o3-mini, and ChatGPT completions.",
    impactSummary:
      "Completions stall, assistants return 500, rate limits trip.",
    keyComponents: ["Chat API", "Embeddings", "Assistants API"],
    commonErrorCodes: [
      "500 Internal Server Error",
      "429 Rate Limit",
      "503 Service Unavailable",
    ],
    troubleshootingSteps: [
      "Check status.openai.com.",
      "Switch to Claude or Groq fallback.",
    ],
    relatedServices: ["anthropic", "groq"],
  },
  {
    slug: "anthropic-claude",
    name: "Claude API (Anthropic)",
    category: "ai-ml",
    domain: "api.anthropic.com",
    officialStatusUrl: "https://status.anthropic.com",
    description:
      "API access to Claude 3.5 Sonnet, Claude 3.7, and Claude Haiku models.",
    impactSummary: "Claude responses return 529 overloaded or 500 error.",
    keyComponents: ["Messages API", "Claude.ai", "Prompt Caching"],
    commonErrorCodes: ["529 Overloaded", "500 Server Error"],
    troubleshootingSteps: [
      "Check status.anthropic.com.",
      "Switch to OpenAI fallback.",
    ],
    relatedServices: ["openai", "mistral-ai"],
  },
  {
    slug: "stripe-api",
    name: "Stripe API",
    category: "payments-fintech",
    domain: "api.stripe.com",
    officialStatusUrl: "https://status.stripe.com",
    description:
      "Online payment processing API and financial infrastructure for software businesses.",
    impactSummary:
      "Card charges fail, checkout sessions error out, webhook delivery stalls.",
    keyComponents: ["Payment Intents", "Checkout Sessions", "Webhooks"],
    commonErrorCodes: ["500 Internal Error", "api_connection_error"],
    troubleshootingSteps: [
      "Check status.stripe.com.",
      "Ensure idempotency keys are used.",
    ],
    relatedServices: ["paypal", "paddle"],
  },
  {
    slug: "github-api",
    name: "GitHub API & Webhooks",
    category: "devtools-git",
    domain: "api.github.com",
    officialStatusUrl: "https://www.githubstatus.com",
    description:
      "REST and GraphQL APIs for GitHub repositories, issues, PRs, and webhooks.",
    impactSummary: "CI triggers drop, developer automations fail with 500.",
    keyComponents: ["REST API v3", "GraphQL API v4", "Webhook Deliveries"],
    commonErrorCodes: [
      "500 Server Error",
      "429 Rate Limited",
      "502 Bad Gateway",
    ],
    troubleshootingSteps: [
      "Check githubstatus.com.",
      "Verify personal access token quota.",
    ],
    relatedServices: ["gitlab", "bitbucket"],
  },
  {
    slug: "twilio-api",
    name: "Twilio SMS & Voice API",
    category: "comms-email",
    domain: "api.twilio.com",
    officialStatusUrl: "https://status.twilio.com",
    description:
      "Programmable messaging, voice calls, and phone verification API.",
    impactSummary: "SMS 2FA verification stops, voice webhooks drop.",
    keyComponents: ["Programmable SMS", "Voice SIP", "Twilio Verify"],
    commonErrorCodes: ["Error 20003", "500 Server Error"],
    troubleshootingSteps: [
      "Check status.twilio.com.",
      "Inspect Twilio Debugger logs.",
    ],
    relatedServices: ["sendgrid", "resend"],
  },
  {
    slug: "vercel-edge",
    name: "Vercel Edge Network",
    category: "cloud-infra",
    domain: "vercel.com",
    officialStatusUrl: "https://www.vercel-status.com",
    description:
      "Global edge network hosting Next.js and frontend applications.",
    impactSummary: "SSR pages throw 500, edge middleware execution hangs.",
    keyComponents: ["Edge Middleware", "Serverless Functions", "CDN Cache"],
    commonErrorCodes: ["504 GATEWAY_TIMEOUT", "FUNCTION_INVOCATION_FAILED"],
    troubleshootingSteps: [
      "Check vercel-status.com.",
      "Review runtime function logs.",
    ],
    relatedServices: ["cloudflare", "aws"],
  },
  {
    slug: "aws-cloud",
    name: "Amazon Web Services Cloud",
    category: "cloud-infra",
    domain: "aws.amazon.com",
    officialStatusUrl: "https://health.aws.amazon.com",
    description: "Cloud computing infrastructure across global regions.",
    impactSummary:
      "us-east-1 regional incidents cause cascading failures across dependencies.",
    keyComponents: ["Compute EC2", "Storage S3", "Database RDS", "Network VPC"],
    commonErrorCodes: ["500 Server Error", "503 Unavailable"],
    troubleshootingSteps: [
      "Check AWS Health Dashboard.",
      "Trigger multi-region failover.",
    ],
    relatedServices: ["google-cloud", "azure"],
  },
  {
    slug: "cloudflare-net",
    name: "Cloudflare Network & DNS",
    category: "cloud-infra",
    domain: "cloudflare.com",
    officialStatusUrl: "https://www.cloudflarestatus.com",
    description:
      "Global edge CDN, authoritative DNS, and DDoS scrubbing network.",
    impactSummary:
      "DNS resolution fails, HTTP 520-524 errors display globally.",
    keyComponents: ["1.1.1.1 DNS", "Edge Proxy", "WAF Engine"],
    commonErrorCodes: ["Error 521", "Error 522", "Error 524"],
    troubleshootingSteps: [
      "Check cloudflarestatus.com.",
      "Verify origin server health.",
    ],
    relatedServices: ["fastly", "aws"],
  },
];

// Helper functions for retrieval and filtering
export function getAllServices(): ServiceDownInfo[] {
  return SERVICES_DATA;
}

export function getServiceBySlug(slug: string): ServiceDownInfo | undefined {
  const normalized = slug.toLowerCase().trim();
  return SERVICES_DATA.find((s) => s.slug.toLowerCase() === normalized);
}

export function getFeaturedServices(): ServiceDownInfo[] {
  return SERVICES_DATA.filter((s) => s.featured);
}

export function getServicesByCategory(
  category: ServiceCategory,
): ServiceDownInfo[] {
  return SERVICES_DATA.filter((s) => s.category === category);
}

export function searchServices(query: string): ServiceDownInfo[] {
  if (!query) return SERVICES_DATA;
  const q = query.toLowerCase().trim();
  return SERVICES_DATA.filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      s.slug.toLowerCase().includes(q) ||
      s.domain.toLowerCase().includes(q) ||
      CATEGORY_LABELS[s.category]?.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q),
  );
}
