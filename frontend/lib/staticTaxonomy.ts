export const staticTaxonomy = [
  {
    id: "core-ai",
    name: "Core AI",
    iconName: "Brain",
    methods: [
      { id: "general", name: "General", slug: "general", description: "Foundational AI techniques and general-purpose machine learning methods.", paperCount: 0 },
      { id: "language", name: "Language", slug: "language", description: "Methods for understanding, generating, and processing natural language.", paperCount: 0 },
      { id: "computer-vision", name: "Computer Vision", slug: "computer-vision", description: "Techniques for analyzing images, videos, and other visual data.", paperCount: 0 },
      { id: "audio-speech", name: "Audio & Speech", slug: "audio-speech", description: "AI methods for speech recognition, synthesis, and audio understanding.", paperCount: 0 },
      { id: "video", name: "Video", slug: "video", description: "Methods for video understanding, generation, and temporal reasoning.", paperCount: 0 },
      { id: "multimodal", name: "Multimodal", slug: "multimodal", description: "Approaches that combine text, images, audio, and other data modalities.", paperCount: 0 },
      { id: "robotics", name: "Robotics", slug: "robotics", description: "AI techniques enabling robots to perceive, plan, and interact with environments.", paperCount: 0 },
      { id: "embodied-ai", name: "Embodied AI", slug: "embodied-ai", description: "Methods for intelligent agents that learn through physical interaction.", paperCount: 0 },
      { id: "3d-spatial", name: "3D & Spatial", slug: "3d-spatial", description: "Techniques for 3D scene understanding, reconstruction, and spatial reasoning.", paperCount: 0 },
      { id: "graph-learning", name: "Graph Learning", slug: "graph-learning", description: "Methods for learning from graph-structured and relational data.", paperCount: 0 },
      { id: "time-series", name: "Time Series", slug: "time-series", description: "Approaches for forecasting and modeling sequential temporal data.", paperCount: 0 },
      { id: "scientific-ai", name: "Scientific AI", slug: "scientific-ai", description: "AI methods designed to accelerate scientific discovery and research.", paperCount: 0 },
    ]
  },
  {
    id: "neural-architectures",
    name: "Neural Architectures",
    iconName: "Layers",
    methods: [
      { id: "transformer", name: "Transformer", slug: "transformer", description: "Attention-based neural architecture for sequence modeling and generation.", paperCount: 0 },
      { id: "mamba", name: "Mamba", slug: "mamba", description: "State space architecture designed for efficient long-context sequence modeling.", paperCount: 0 },
      { id: "state-space-models", name: "State Space Models", slug: "state-space-models", description: "Sequence models using state-space representations for long-range dependencies.", paperCount: 0 },
      { id: "convolutional-networks", name: "Convolutional Networks", slug: "convolutional-networks", description: "Neural networks specialized for extracting spatial features from data.", paperCount: 0 },
      { id: "recurrent-networks", name: "Recurrent Networks", slug: "recurrent-networks", description: "Neural architectures designed for sequential and time-dependent data.", paperCount: 0 },
      { id: "graph-neural-networks", name: "Graph Neural Networks", slug: "graph-neural-networks", description: "Models that learn representations from graph-structured data.", paperCount: 0 },
      { id: "mixture-of-experts-moe", name: "Mixture of Experts", slug: "mixture-of-experts-moe", description: "Architecture that routes inputs to specialized expert networks.", paperCount: 0 },
      { id: "autoencoders", name: "Autoencoders", slug: "autoencoders", description: "Neural models that learn compact representations by reconstructing inputs.", paperCount: 0 },
      { id: "generative-adversarial-networks", name: "Generative Adversarial Networks", slug: "generative-adversarial-networks", description: "Generative models trained through competition between generator and discriminator.", paperCount: 0 },
      { id: "diffusion-architectures", name: "Diffusion Architectures", slug: "diffusion-architectures", description: "Generative architectures that create data through iterative denoising.", paperCount: 0 },
    ]
  },
  {
    id: "neural-components",
    name: "Neural Components",
    iconName: "Puzzle",
    methods: [
      { id: "attention", name: "Attention", slug: "attention", description: "Focuses on relevant input information.", paperCount: 0 },
      { id: "embeddings", name: "Embeddings", slug: "embeddings", description: "Dense vector representations of data.", paperCount: 0 },
      { id: "positional-encoding", name: "Positional Encoding", slug: "positional-encoding", description: "Adds sequence order information.", paperCount: 0 },
      { id: "feedforward-networks", name: "Feedforward Networks", slug: "feedforward-networks", description: "Basic fully connected neural layers.", paperCount: 0 },
      {  id: "activation-functions", name: "Activation Functions", slug: "activation-functions", description: "Introduce non-linearity into models.", paperCount: 0 },
      { id: "normalization", name: "Normalization", slug: "normalization", description: "Stabilizes and speeds up training.", paperCount: 0 },
      { id: "residual-connections", name: "Residual Connections", slug: "residual-connections", description: "Improves gradient flow in networks.", paperCount: 0 },
      { id: "pooling", name: "Pooling", slug: "pooling", description: "Reduces feature map dimensions.", paperCount: 0 },
      { id: "convolution", name: "Convolution", slug: "convolution", description: "Extracts local spatial features.", paperCount: 0 },
      { id: "tokenization", name: "Tokenization", slug: "tokenization", description: "Splits text into processable tokens.", paperCount: 0 },
    ]
  },
  {
  id: "training",
  name: "Training",
  iconName: "Dumbbell",
  methods: [
    { id: "pre-training", name: "Pre-training", slug: "pre-training", description: "Learns from large unlabeled datasets.", paperCount: 0 },
    { id: "fine-tuning", name: "Fine-tuning", slug: "fine-tuning", description: "Adapts models to specific tasks.", paperCount: 0 },
    { id: "instruction-tuning", name: "Instruction Tuning", slug: "instruction-tuning", description: "Trains models to follow instructions.", paperCount: 0 },
    { id: "continued-pretraining", name: "Continued Pretraining", slug: "continued-pretraining", description: "Extends pre-training with new data.", paperCount: 0 },
    { id: "self-supervised-learning", name: "Self-Supervised Learning", slug: "self-supervised-learning", description: "Learns without manual labels.", paperCount: 0 },
    { id: "semi-supervised-learning", name: "Semi-Supervised Learning", slug: "semi-supervised-learning", description: "Combines labeled and unlabeled data.", paperCount: 0 },
    { id: "transfer-learning", name: "Transfer Learning", slug: "transfer-learning", description: "Transfers knowledge between tasks.", paperCount: 0 },
    { id: "curriculum-learning", name: "Curriculum Learning", slug: "curriculum-learning", description: "Trains from easy to hard.", paperCount: 0 },
    { id: "multi-task-learning", name: "Multi-task Learning", slug: "multi-task-learning", description: "Learns multiple tasks together.", paperCount: 0 },
    { id: "continual-learning", name: "Continual Learning", slug: "continual-learning", description: "Learns continuously over time.", paperCount: 0 },
    { id: "distillation", name: "Distillation", slug: "distillation", description: "Transfers knowledge to smaller models.", paperCount: 0 },
    { id: "teacher-forcing", name: "Teacher Forcing", slug: "teacher-forcing", description: "Uses target outputs during training.", paperCount: 0 }
  ]
},
{
  id: "alignment",
  name: "Alignment",
  iconName: "Shield",
  methods: [
    { id: "rlhf", name: "RLHF", slug: "rlhf", description: "Human feedback-based model alignment.", paperCount: 0 },
    { id: "dpo", name: "DPO", slug: "dpo", description: "Direct preference optimization method.", paperCount: 0 },
    { id: "preference-optimization", name: "Preference Optimization", slug: "preference-optimization", description: "Optimizes models using preferences.", paperCount: 0 },
    { id: "reward-modeling", name: "Reward Modeling", slug: "reward-modeling", description: "Learns reward functions from data.", paperCount: 0 },
    { id: "constitutional-ai", name: "Constitutional AI", slug: "constitutional-ai", description: "Rule-guided AI behavior alignment.", paperCount: 0 },
    { id: "ai-feedback", name: "AI Feedback", slug: "ai-feedback", description: "Uses AI-generated feedback signals.", paperCount: 0 }
  ]
},
{
  id: "prompting-reasoning",
  name: "Prompting & Reasoning",
  iconName: "MessageSquare",
  methods: [
    { id: "prompting", name: "Prompting", slug: "prompting", description: "Guides model behavior with prompts.", paperCount: 0 },
    { id: "chain-of-thought", name: "Chain of Thought", slug: "chain-of-thought", description: "Step-by-step reasoning technique.", paperCount: 0 },
    { id: "reasoning", name: "Reasoning", slug: "reasoning", description: "Logical problem-solving methods.", paperCount: 0 },
    { id: "planning", name: "Planning", slug: "planning", description: "Breaks tasks into actionable steps.", paperCount: 0 },
    { id: "search", name: "Search", slug: "search", description: "Finds relevant information efficiently.", paperCount: 0 },
    { id: "reflection", name: "Reflection", slug: "reflection", description: "Improves outputs through self-review.", paperCount: 0 }
  ]
},
{
  id: "agents",
  name: "Agents",
  iconName: "Bot",
  methods: [
    { id: "tool-use", name: "Tool Use", slug: "tool-use", description: "Uses external tools to solve tasks.", paperCount: 0 },
    { id: "react", name: "ReAct", slug: "react", description: "Combines reasoning with actions.", paperCount: 0 },
    { id: "function-calling", name: "Function Calling", slug: "function-calling", description: "Invokes external APIs and functions.", paperCount: 0 },
    { id: "agent-memory", name: "Agent Memory", slug: "agent-memory", description: "Stores and recalls past context.", paperCount: 0 },
    { id: "multi-agent-systems", name: "Multi-Agent Systems", slug: "multi-agent-systems", description: "Coordinates multiple intelligent agents.", paperCount: 0 },
    { id: "workflow-orchestration", name: "Workflow Orchestration", slug: "workflow-orchestration", description: "Manages multi-step AI workflows.", paperCount: 0 },
    { id: "mcp", name: "Model Context Protocol (MCP)", slug: "mcp", description: "Standard for model-tool communication.", paperCount: 0 }
  ]
},
{
  id: "retrieval",
  name: "Retrieval",
  iconName: "DatabaseZap",
  methods: [
    { id: "rag", name: "Retrieval-Augmented Generation", slug: "retrieval-augmented-generation", description: "Combines retrieval with generation.", paperCount: 0 },
    { id: "dense-retrieval", name: "Dense Retrieval", slug: "dense-retrieval", description: "Embedding-based document retrieval.", paperCount: 0 },
    { id: "sparse-retrieval", name: "Sparse Retrieval", slug: "sparse-retrieval", description: "Keyword-based information retrieval.", paperCount: 0 },
    { id: "hybrid-retrieval", name: "Hybrid Retrieval", slug: "hybrid-retrieval", description: "Combines dense and sparse retrieval.", paperCount: 0 },
    { id: "reranking", name: "Reranking", slug: "reranking", description: "Reorders search results by relevance.", paperCount: 0 },
    { id: "vector-search", name: "Vector Search", slug: "vector-search", description: "Searches using vector embeddings.", paperCount: 0 },
    { id: "knowledge-graphs", name: "Knowledge Graphs", slug: "knowledge-graphs", description: "Represents connected knowledge structures.", paperCount: 0 }
  ]
},
{
  id: "adaptation",
  name: "Adaptation",
  iconName: "Sliders",
  methods: [
    { id: "lora", name: "LoRA", slug: "lora", description: "Efficient low-rank model tuning.", paperCount: 0 },
    { id: "qlora", name: "QLoRA", slug: "qlora", description: "Quantized low-rank fine-tuning.", paperCount: 0 },
    { id: "peft", name: "PEFT", slug: "peft", description: "Parameter-efficient fine-tuning methods.", paperCount: 0 },
    { id: "prompt-tuning", name: "Prompt Tuning", slug: "prompt-tuning", description: "Learns task-specific prompt embeddings.", paperCount: 0 },
    { id: "prefix-tuning", name: "Prefix Tuning", slug: "prefix-tuning", description: "Adds trainable prefix representations.", paperCount: 0 },
    { id: "adapter-tuning", name: "Adapter Tuning", slug: "adapter-tuning", description: "Fine-tunes lightweight adapter layers.", paperCount: 0 }
  ]
},
 {
  id: "optimization",
  name: "Optimization",
  iconName: "TrendingUp",
  methods: [
    { id: "optimizers", name: "Optimizers", slug: "optimizers", description: "Algorithms for updating model weights.", paperCount: 0 },
    { id: "learning-rate-scheduling", name: "Learning Rate Scheduling", slug: "learning-rate-scheduling", description: "Adjusts learning rates during training.", paperCount: 0 },
    { id: "initialization", name: "Initialization", slug: "initialization", description: "Sets initial model parameters.", paperCount: 0 },
    { id: "gradient-methods", name: "Gradient Methods", slug: "gradient-methods", description: "Gradient-based optimization techniques.", paperCount: 0 }
  ]
},
{
  id: "regularization",
  name: "Regularization",
  iconName: "CircleDot",
  methods: [
    { id: "dropout", name: "Dropout", slug: "dropout", description: "Randomly disables neurons during training.", paperCount: 0 },
    { id: "weight-regularization", name: "Weight Regularization", slug: "weight-regularization", description: "Penalizes large model weights.", paperCount: 0 },
    { id: "label-smoothing", name: "Label Smoothing", slug: "label-smoothing", description: "Softens target label distributions.", paperCount: 0 },
    { id: "data-augmentation", name: "Data Augmentation", slug: "data-augmentation", description: "Expands training data diversity.", paperCount: 0 }
  ]
},
{
  id: "efficiency",
  name: "Efficiency",
  iconName: "Zap",
  methods: [
    { id: "quantization", name: "Quantization", slug: "quantization", description: "Reduces model precision for speed.", paperCount: 0 },
    { id: "pruning", name: "Pruning", slug: "pruning", description: "Removes unnecessary model parameters.", paperCount: 0 },
    { id: "sparsity", name: "Sparsity", slug: "sparsity", description: "Uses sparse model representations.", paperCount: 0 },
    { id: "speculative-decoding", name: "Speculative Decoding", slug: "speculative-decoding", description: "Accelerates autoregressive generation.", paperCount: 0 },
    { id: "kv-cache", name: "KV Cache", slug: "kv-cache", description: "Caches attention key-value states.", paperCount: 0 },
    { id: "pagedattention", name: "PagedAttention", slug: "pagedattention", description: "Memory-efficient attention mechanism.", paperCount: 0 },
    { id: "flashattention-2", name: "FlashAttention-2", slug: "flashattention-2", description: "Fast optimized attention algorithm.", paperCount: 0 },
    { id: "model-compression", name: "Model Compression", slug: "model-compression", description: "Reduces model size efficiently.", paperCount: 0 },
    { id: "inference-optimization", name: "Inference Optimization", slug: "inference-optimization", description: "Speeds up model inference.", paperCount: 0 }
  ]
},
{
  id: "reinforcement-learning",
  name: "Reinforcement Learning",
  iconName: "GitBranch",
  methods: [
    { id: "value-based-rl", name: "Value-based RL", slug: "value-based-rl", description: "Learns action-value functions.", paperCount: 0 },
    { id: "policy-optimization", name: "Policy Optimization", slug: "policy-optimization", description: "Optimizes decision-making policies.", paperCount: 0 },
    { id: "model-based-rl", name: "Model-based RL", slug: "model-based-rl", description: "Uses environment dynamics models.", paperCount: 0 },
    { id: "offline-rl", name: "Offline RL", slug: "offline-rl", description: "Learns from fixed datasets.", paperCount: 0 },
    { id: "online-rl", name: "Online RL", slug: "online-rl", description: "Learns through live interactions.", paperCount: 0 }
  ]
},
{
  id: "representation-learning",
  name: "Representation Learning",
  iconName: "Share2",
  methods: [
    { id: "contrastive-learning", name: "Contrastive Learning", slug: "contrastive-learning", description: "Learns by comparing samples.", paperCount: 0 },
    { id: "metric-learning", name: "Metric Learning", slug: "metric-learning", description: "Learns meaningful distance metrics.", paperCount: 0 },
    { id: "embedding-learning", name: "Embedding Learning", slug: "embedding-learning", description: "Creates dense feature embeddings.", paperCount: 0 },
    { id: "feature-learning", name: "Feature Learning", slug: "feature-learning", description: "Automatically extracts useful features.", paperCount: 0 }
  ]
},
{
  id: "diffusion",
  name: "Diffusion",
  iconName: "Repeat2",
  methods: [
    { id: "diffusion-models", name: "Diffusion Models", slug: "diffusion-models", description: "Generates data through denoising.", paperCount: 0 },
    { id: "flow-matching", name: "Flow Matching", slug: "flow-matching", description: "Continuous generative learning method.", paperCount: 0 },
    { id: "score-based-models", name: "Score-based Models", slug: "score-based-models", description: "Learns data score functions.", paperCount: 0 },
    { id: "consistency-models", name: "Consistency Models", slug: "consistency-models", description: "Fast one-step generative models.", paperCount: 0 }
  ]
},
  {
  id: "vision",
  name: "Vision",
  iconName: "Eye",
  methods: [
    { id: "object-detection", name: "Object Detection", slug: "object-detection", description: "Detects objects in images.", paperCount: 0 },
    { id: "segmentation", name: "Segmentation", slug: "segmentation", description: "Partitions images into regions.", paperCount: 0 },
    { id: "image-generation", name: "Image Generation", slug: "image-generation", description: "Creates realistic synthetic images.", paperCount: 0 },
    { id: "image-classification", name: "Image Classification", slug: "image-classification", description: "Classifies images into categories.", paperCount: 0 },
    { id: "pose-estimation", name: "Pose Estimation", slug: "pose-estimation", description: "Estimates human or object poses.", paperCount: 0 },
    { id: "tracking", name: "Tracking", slug: "tracking", description: "Tracks objects across frames.", paperCount: 0 },
    { id: "3d-vision", name: "3D Vision", slug: "3d-vision", description: "Understands three-dimensional scenes.", paperCount: 0 }
  ]
},
{
  id: "language",
  name: "Language",
  iconName: "BookOpen",
  methods: [
    { id: "lang-tokenization", name: "Tokenization", slug: "tokenization", description: "Splits text into tokens.", paperCount: 0 },
    { id: "language-modeling", name: "Language Modeling", slug: "language-modeling", description: "Predicts and generates text.", paperCount: 0 },
    { id: "machine-translation", name: "Machine Translation", slug: "machine-translation", description: "Translates between languages.", paperCount: 0 },
    { id: "text-generation", name: "Text Generation", slug: "text-generation", description: "Generates coherent natural text.", paperCount: 0 },
    { id: "summarization", name: "Summarization", slug: "summarization", description: "Produces concise text summaries.", paperCount: 0 },
    { id: "question-answering", name: "Question Answering", slug: "question-answering", description: "Answers questions from context.", paperCount: 0 },
    { id: "information-extraction", name: "Information Extraction", slug: "information-extraction", description: "Extracts structured information.", paperCount: 0 }
  ]
},
{
  id: "audio",
  name: "Audio",
  iconName: "Mic",
  methods: [
    { id: "speech-recognition", name: "Speech Recognition", slug: "speech-recognition", description: "Converts speech to text.", paperCount: 0 },
    { id: "speech-synthesis", name: "Speech Synthesis", slug: "speech-synthesis", description: "Generates natural speech.", paperCount: 0 },
    { id: "speaker-recognition", name: "Speaker Recognition", slug: "speaker-recognition", description: "Identifies individual speakers.", paperCount: 0 },
    { id: "audio-generation", name: "Audio Generation", slug: "audio-generation", description: "Creates synthetic audio.", paperCount: 0 },
    { id: "music-generation", name: "Music Generation", slug: "music-generation", description: "Generates original music.", paperCount: 0 }
  ]
},
{
  id: "video",
  name: "Video",
  iconName: "Video",
  methods: [
    { id: "video-understanding", name: "Video Understanding", slug: "video-understanding", description: "Analyzes video content.", paperCount: 0 },
    { id: "video-generation", name: "Video Generation", slug: "video-generation", description: "Creates realistic videos.", paperCount: 0 },
    { id: "video-segmentation", name: "Video Segmentation", slug: "video-segmentation", description: "Segments objects in videos.", paperCount: 0 },
    { id: "video-retrieval", name: "Video Retrieval", slug: "video-retrieval", description: "Finds relevant video content.", paperCount: 0 }
  ]
},
{
  id: "robotics",
  name: "Robotics",
  iconName: "Cpu",
  methods: [
    { id: "motion-planning", name: "Motion Planning", slug: "motion-planning", description: "Plans robot movements.", paperCount: 0 },
    { id: "manipulation", name: "Manipulation", slug: "manipulation", description: "Controls robotic interactions.", paperCount: 0 },
    { id: "navigation", name: "Navigation", slug: "navigation", description: "Guides robot movement safely.", paperCount: 0 },
    { id: "policy-learning", name: "Policy Learning", slug: "policy-learning", description: "Learns robot control policies.", paperCount: 0 }
  ]
},
{
  id: "3d",
  name: "3D",
  iconName: "Layers",
  methods: [
    { id: "nerf", name: "NeRF", slug: "nerf", description: "Neural scene reconstruction method.", paperCount: 0 },
    { id: "gaussian-splatting", name: "Gaussian Splatting", slug: "gaussian-splatting", description: "Fast 3D scene rendering.", paperCount: 0 },
    { id: "slam", name: "SLAM", slug: "slam", description: "Simultaneous mapping and localization.", paperCount: 0 },
    { id: "point-clouds", name: "Point Clouds", slug: "point-clouds", description: "Represents 3D spatial data.", paperCount: 0 }
  ]
},
{
  id: "mathematics",
  name: "Mathematics",
  iconName: "BarChart2",
  methods: [
    { id: "optimization-theory", name: "Optimization Theory", slug: "optimization-theory", description: "Mathematical optimization principles.", paperCount: 0 },
    { id: "probability", name: "Probability", slug: "probability", description: "Models uncertainty mathematically.", paperCount: 0 },
    { id: "statistics", name: "Statistics", slug: "statistics", description: "Analyzes and interprets data.", paperCount: 0 },
    { id: "loss-functions", name: "Loss Functions", slug: "loss-functions", description: "Measures prediction errors.", paperCount: 0 },
    { id: "linear-algebra", name: "Linear Algebra", slug: "linear-algebra", description: "Foundation of machine learning.", paperCount: 0 }
  ]
},
{
  id: "evaluation",
  name: "Evaluation",
  iconName: "Microscope",
  methods: [
    { id: "metrics", name: "Metrics", slug: "metrics", description: "Measures model performance.", paperCount: 0 },
    { id: "human-evaluation", name: "Human Evaluation", slug: "human-evaluation", description: "Uses human judgment for quality.", paperCount: 0 },
    { id: "llm-as-a-judge", name: "LLM-as-a-Judge", slug: "llm-as-a-judge", description: "LLMs evaluate model outputs.", paperCount: 0 },
    { id: "preference-evaluation", name: "Preference Evaluation", slug: "preference-evaluation", description: "Compares outputs by preference.", paperCount: 0 },
    { id: "benchmarking", name: "Benchmarking", slug: "benchmarking", description: "Evaluates against standard datasets.", paperCount: 0 }
  ]
},
  {
  id: "interpretability",
  name: "Interpretability",
  iconName: "Telescope",
  methods: [
    { id: "mechanistic-interpretability", name: "Mechanistic Interpretability", slug: "mechanistic-interpretability", description: "Explains internal model behavior.", paperCount: 0 },
    { id: "attribution", name: "Attribution", slug: "attribution", description: "Identifies influential input features.", paperCount: 0 },
    { id: "probing", name: "Probing", slug: "probing", description: "Analyzes learned model representations.", paperCount: 0 },
    { id: "explainability", name: "Explainability", slug: "explainability", description: "Makes model decisions understandable.", paperCount: 0 }
  ]
},
{
  id: "safety",
  name: "Safety",
  iconName: "Lock",
  methods: [
    { id: "hallucination", name: "Hallucination", slug: "hallucination", description: "Reduces incorrect generated content.", paperCount: 0 },
    { id: "watermarking", name: "Watermarking", slug: "watermarking", description: "Embeds identifiable output markers.", paperCount: 0 },
    { id: "alignment-safety", name: "Alignment Safety", slug: "alignment-safety", description: "Ensures safe model behavior.", paperCount: 0 },
    { id: "jailbreak-defense", name: "Jailbreak Defense", slug: "jailbreak-defense", description: "Prevents prompt-based attacks.", paperCount: 0 },
    { id: "robustness", name: "Robustness", slug: "robustness", description: "Improves reliability under changes.", paperCount: 0 },
    { id: "privacy", name: "Privacy", slug: "privacy", description: "Protects sensitive user data.", paperCount: 0 }
  ]
},
{
  id: "systems",
  name: "Systems",
  iconName: "Server",
  methods: [
    { id: "distributed-training", name: "Distributed Training", slug: "distributed-training", description: "Scales training across machines.", paperCount: 0 },
    { id: "parallelism", name: "Parallelism", slug: "parallelism", description: "Executes computations simultaneously.", paperCount: 0 },
    { id: "serving", name: "Serving", slug: "serving", description: "Deploys models for inference.", paperCount: 0 },
    { id: "inference-systems", name: "Inference Systems", slug: "inference-systems", description: "Optimizes large-scale model inference.", paperCount: 0 },
    { id: "memory-optimization", name: "Memory Optimization", slug: "memory-optimization", description: "Reduces memory consumption efficiently.", paperCount: 0 }
  ]
},
{
  id: "hardware",
  name: "Hardware",
  iconName: "HardDrive",
  methods: [
    { id: "gpus", name: "GPUs", slug: "gpus", description: "Graphics processors for AI.", paperCount: 0 },
    { id: "tpus", name: "TPUs", slug: "tpus", description: "Google AI accelerator chips.", paperCount: 0 },
    { id: "npus", name: "NPUs", slug: "npus", description: "Dedicated neural processing units.", paperCount: 0 },
    { id: "accelerators", name: "Accelerators", slug: "accelerators", description: "Specialized AI computing hardware.", paperCount: 0 }
  ]
},
{
  id: "research-concepts",
  name: "Research Concepts",
  iconName: "FlaskConical",
  methods: [
    { id: "scaling-laws", name: "Scaling Laws", slug: "scaling-laws", description: "Performance improves with scale.", paperCount: 0 },
    { id: "emergence", name: "Emergence", slug: "emergence", description: "Unexpected abilities from scaling.", paperCount: 0 },
    { id: "in-context-learning", name: "In-Context Learning", slug: "in-context-learning", description: "Learns from provided examples.", paperCount: 0 },
    { id: "test-time-compute", name: "Test-Time Compute", slug: "test-time-compute", description: "Uses extra inference computation.", paperCount: 0 },
    { id: "context-engineering", name: "Context Engineering", slug: "context-engineering", description: "Optimizes context for models.", paperCount: 0 },
    { id: "world-models", name: "World Models", slug: "world-models", description: "Learns internal environment representations.", paperCount: 0 },
    { id: "foundation-models", name: "Foundation Models", slug: "foundation-models", description: "Large models for many tasks.", paperCount: 0 }
  ]
}
];