export const runtime = "edge";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import PaperList from "@/components/PaperFeed";
import PaperTabs from "@/components/PaperTabs";
import { getPapers, type GetPapersResult } from "@/lib/paperApi";


type TaskPageProps = {
  params: Promise<{ slug: string }>;
};

// ====================== TASK DATA ======================
const tasks = [
  {
    slug: "agents",
    displayName: "Agents",
    title: "AGENTS",
    description:
      "AI agents are autonomous software systems that use artificial intelligence to achieve goals and complete tasks on behalf of users, acting independently to perceive their environment, make decisions, and take actions without constant human intervention. They use advanced capabilities like reasoning, memory, planning, and learning, often leveraging large language models (LLMs) and other AI tools to interpret information and perform complex workflows across various industries.",
    imageUrl:
      "https://paperswithcode.co/api/v1/tasks/agents/image?v=1781525141",
    stats: {
      benchmarks: 8,
    },
    sisterTasks: [
      { name: "Coding Agents", slug: "coding-agents" },
      { name: "Computer Use Agents", slug: "computer-use-agents" },
      { name: "Language Modeling", slug: "language-modeling" },
    ],
    commonMethods: [
      { name: "Large Language Model (LLM)", count: -10 },
      { name: "Mixture-of-Experts(MoE)", count: -5 },
      { name: "Transformer", count: -4 },
      { name: "Qwen3", count: -3 },
      { name: "Post-training", count: -3 },
      { name: "GRPO", count: -3 },
      { name: "DeepSeek Sparse Attention", count: -3 },
      { name: "MCP", count: -3 },
    ],
  },
  {
    slug: "world-models",
    displayName: "World Models",
    title: "WORLD MODELS",
    description:
      "World models are AI systems that learn a function from a (current world state, action) pair to the next world state, letting an agent predict how its environment will evolve and simulate the outcomes of actions before taking them. The term spans two paradigms: internal world models that predict the future at a high, semantic level (cognitive sense, in the spirit of LeCun's JEPA family) and external world models that aim to simulate reality at full visual fidelity (e.g. Genie-2, GAIA-1). Both are foundational for embodied AI: agents can plan and act using internal models while learning inside external simulators.",
    imageUrl:
      "https://paperswithcode.co/api/v1/tasks/world-models/image?v=1781533541",
    stats: {
      benchmarks: 8,
    },
    sisterTasks: [],
    commonMethods: [
      { name: "Diffusion Transformer (DiT)", count: -6 },
      { name: "CLIP", count: -5 },
      { name: "VLA", count: -4 },
      { name: "Transformer", count: -4 },
      { name: "Qwen3", count: -3 },
      { name: "Pre-training", count: -3 },
      { name: "Diffusion", count: -3 },
      { name: "Key-value cache", count: -3 },
      { name: "MODELS", count: -3 },
    ],
  },
  {
    slug: "anomaly-detection",
    displayName: "Anomaly Detection",
    title: "ANOMALY DETECTION",
    description:
      "Anomaly and out-of-distribution (OOD) detection identifies unusual, novel, or defective inputs in images, video, and other sensor data.",
    imageUrl: "",
    stats: {
      benchmarks: 8,
    },
    sisterTasks: [],
    commonMethods: [
      { name: "Convolution", count: -6 },
      { name: "Batch Normalization", count: -5 },
      { name: "Max Pooling", count: -5 },
      { name: "1x1 Convolution", count: -4 },
      { name: "Global Average Pooling", count: -4 },
      { name: "Cosine Annealing", count: -4 },
      { name: "Embedding", count: -3 },
      { name: "CutMix", count: -3 },
    ],
  },
  {
    slug: "autonomous-driving",
    displayName: "Autonomous Driving",
    title: "AUTONOMOUS DRIVING",
    description:
      "Autonomous driving research covers perception, planning, and control for self-driving vehicles, including bird's-eye-view (BEV) perception, occupancy prediction, end-to-end driving, and ADAS.",
    imageUrl: "",
    stats: {
      benchmarks: 8,
    },
    sisterTasks: [
      { name: "Autonomous Driving", slug: "autonomous-driving" },
      { name: "Image Understanding", slug: "image-understanding" },
      { name: "Instruction Following", slug: "instruction-following" },
      { name: "Reasoning", slug: "reasoning" },
      { name: "Robotics", slug: "robotics" },
      { name: "Chain-of-Thought (CoT)", slug: "chain-of-thought" },
    ],
    commonMethods: [
      { name: "PPO", count: -6 },
      { name: "Deformable Attention", count: -4 },
      { name: "LLaVa", count: -3 },
      { name: "Transformer", count: -3 },
      { name: "Gaussian Splatting", count: -3 },
      { name: "Chain-of-Thought (CoT)", count: -2 },
      { name: "Few-shot prompting", count: -2 },
      { name: "GPT-3", count: -2 },
    ],
  },
  
  
  {
    slug: "deepfake-forensics",
    displayName: "Deepfake and Forensics",
    title: "DEEPFAKE AND FORENSICS",
    description:
      "Deepfake detection and media forensics identify synthetic, manipulated, or spoofed visual and audiovisual content, including anti-spoofing and security-oriented authenticity verification.",
    imageUrl: "",
    stats: {
      benchmarks: 8,
    },
    sisterTasks: [],
    commonMethods: [
      { name: "Self-supervised learning (SSL)", count: -10 },
      { name: "wav2vec2", count: -5 },
      { name: "HuBERT", count: -4 },
      { name: "WavLM", count: -2 },
      { name: "RAPTOR", count: -7 },
    ],
  },
  {
    slug: "document-understanding",
    displayName: "Document Understanding",
    title: "DOCUMENT UNDERSTANDING",
    description:
      "Document understanding covers machine learning systems that interpret visually rich documents, including forms, receipts, tables, layout-aware OCR, key information extraction, entity extraction, and entity linking.",
    imageUrl: "",
    stats: {
      benchmarks: 11,
    },
    sisterTasks: [
      { name: "Image Understanding", slug: "image-understanding" },
      { name: "OCR", slug: "ocr" },
    ],
    commonMethods: [
      { name: "Transformer", count: -1 },
      { name: "Pre-training", count: -5 },
      { name: "Vision Transformer", count: -8 },
      { name: "Large Language model (LLM)", count: -10 },
      { name: "GRPO", count: -9 },
      { name: "Qwen3", count: -4 },
      { name: "BPE", count: -2 },
      { name: "Direct Preference Optimization (DPO)", count: -7 },
    ],
  },
  {
    slug: "embedding-models",
    displayName: "Embedding Models",
    title: "EMBEDDING MODELS",
    description:
      "Embedding models are algorithms that transform complex, high-dimensional data—like words, images, or audio—into dense, low-dimensional numerical vectors. These vectors capture the underlying meaning, context, and relationships within the data, allowing machines to understand and process it more efficiently. By representing data as points in a shared mathematical space, embedding models enable tasks such as semantic search, recommendation systems, and image recognition by placing similar items close together.",
    imageUrl:
      "https://media.geeksforgeeks.org/wp-content/uploads/20250602113842201899/Vector-Embedding.webp",
    stats: {
      benchmarks: 9,
    },
    sisterTasks: [],
    commonMethods: [
      { name: "MTEB", count: -19 },
      { name: "MMTEB", count: -5 },
      { name: "Embedding", count: -5 },
      { name: "CLIP", count: -5 },
      { name: "Pre-training", count: -5 },
      { name: "BERT", count: -5 },
      { name: "Large Language model (LLM)", count: -4 },
      { name: "Matryoshka representation learning (MRL)", count: -4 },
      { name: "Qwen3", count: -3 },
      { name: "Reranker (cross-encoder)", count: -2 },
    ],
  },
  {
  slug: "language-models",
  displayName: "Language Models",
  title: "LANGUAGE MODELS",
    description:
      "Language Modeling is the task of predicting the next word or character in a sequence given the previous context. Language models learn the probability distribution of word sequences and are foundational for many NLP applications including text generation, machine translation, and speech recognition.",
    imageUrl:
      "https://lena-voita.github.io/resources/lectures/lang_models/neural/one_step_loss_intuition-min.png",
    stats: {
      benchmarks: 54,
    },
    sisterTasks: [],
    commonMethods: [
      { name: "Large Language Model (LLM)", count: -11 },
      { name: "Qwen3", count: -8 },
      { name: "DeepSeek Sparse Attention", count: -4 },
      { name: "Mixture-of-Experts (MoE)", count: -4 },
      { name: "Transformer", count: -4 },
      { name: "GRPO", count: -4 },
      { name: "On-policy distillation", count: -4 },
      { name: "Post-training", count: -4 },
    ],
  },
  {
  slug: "vision-language-models",
  displayName: "Vision-Language Models",
  title: "VISION-LANGUAGE MODELS",
  description:
    "Vision-Language Models combine visual understanding and natural language processing, enabling AI systems to understand images, answer questions, generate captions, and perform multimodal reasoning.",
  imageUrl: "",
  stats: {
    benchmarks: 0,
  },
  sisterTasks: [],
  commonMethods: [],
},
{
  slug: "multimodal-models",
  displayName: "Multimodal Models",
  title: "MULTIMODAL MODELS",
  description:
    "Multimodal Models process multiple types of data such as text, images, audio, and video together, allowing richer understanding and generation across different modalities.",
  imageUrl: "",
  stats: {
    benchmarks: 0,
  },
  sisterTasks: [],
  commonMethods: [],
},
{
  slug: "automatic-speech-recognition",
  displayName: "Automatic Speech Recognition",
  title: "AUTOMATIC SPEECH RECOGNITION",
  description:
    "Speech AI focuses on speech recognition, speech synthesis, speaker identification, speech translation, and spoken language understanding.",
  imageUrl: "",
  stats: {
    benchmarks: 0,
  },
  sisterTasks: [],
  commonMethods: [],
},
{
  slug: "image-generation",
  displayName: "Image Generation",
  title: "IMAGE GENERATION",
  description:
    "Image Generation focuses on creating realistic or artistic images from text prompts or other inputs using diffusion models and generative AI.",
  imageUrl: "",
  stats: {
    benchmarks: 0,
  },
  sisterTasks: [],
  commonMethods: [],
},
  {
    slug: "ocr",
    displayName: "OCR",
    title: "OCR",
    description:
      "OCR, or Optical Character Recognition, is the task of converting an image containing text into machine-readable, editable, and searchable digital text data. This involves converting scanned documents, photos, or image-only PDFs to text from their static visual format, enabling the document to be edited, searched, or used for data entry and other applications.",
    imageUrl:
      "https://cdn.prod.website-files.com/614c82ed388d53640613982e/6784ce0e5a5a55f2318ce5a1_6442991214b0592c3afebccc_how%2520ocr%2520works.jpeg",
    stats: {
      benchmarks: 7,
    },
    sisterTasks: [
      { name: "Document Understanding", slug: "document-understanding" },
      { name: "Image Understanding", slug: "image-understanding" },
    ],
    commonMethods: [
      { name: "Large Language model (LLM)", count: -7 },
      { name: "Qwen3", count: -7 },
      { name: "GRPO", count: -5 },
      { name: "Vision Transformer", count: -4 },
      { name: "Fine-tuning", count: -4 },
      { name: "CLIP", count: -4 },
      { name: "Post-training", count: -3 },
      { name: "Transformer", count: -3 },
    ],
  },
  {
    slug: "omni-models",
    displayName: "Omni Models",
    title: "OMNI MODELS",
    description:
      "Omni models are AI models that take multiple modalities (language, vision, audio) as input and produce multiple modalities as output. Some examples of the first omni models include Qwen2.5 Omni and BAGEL.",
    imageUrl:
      "https://qianwen-res.oss-cn-beijing.aliyuncs.com/Qwen3-Omni/overview.png#center",
    stats: {
      benchmarks: 2,
    },
    sisterTasks: [],
    commonMethods: [],
  },
  {
    slug: "reasoning",
    displayName: "Reasoning",
    title: "REASONING",
    description:
      "AI reasoning is the process by which artificial intelligence systems logically derive conclusions and make informed decisions from data, rules, and prior knowledge, enabling them to move beyond simple pattern recognition to solve problems and simulate intelligent behavior. It involves systems that can 'think' by connecting information, applying rules, and performing step-by-step analyses, often using methods like deductive and inductive logic to achieve greater accuracy and adapt to complex, uncertain situations.",
    imageUrl:
      "https://substackcdn.com/image/fetch/$s_!zfsl!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ffb865992-1eee-4fdb-b98a-165f4d555e11_1774x608.png",
    stats: {
      benchmarks: 21,
    },
    sisterTasks: [],
    commonMethods: [
      { name: "Large Language model (LLM)", count: -9 },
      { name: "Chain-of-Thought (CoT)", count: -7 },
      { name: "GRPO", count: -6 },
      { name: "Transformer", count: -5 },
      { name: "Reasoning model", count: -5 },
      { name: "Fine-tuning", count: -5 },
      { name: "Qwen3", count: -5 },
      { name: "Mixture-of-Experts (MoE)", count: -4 },
    ],
  },
  {
    slug: "reinforcement-learning",
    displayName: "Reinforcement Learning",
    title: "REINFORCEMENT LEARNING",
    description:
      "Reinforcement learning (RL) is a machine learning technique where an agent learns to make optimal decisions in an environment through trial and error to maximize cumulative rewards. An agent interacts with an environment, taking actions, and receiving rewards or penalties based on those actions. Unlike other ML methods, RL doesn't have an 'answer key'; instead, it learns a strategy, called a policy, to choose actions that lead to the best long-term outcomes.",
    imageUrl:
      "https://www.altexsoft.com/static/blog-post/2023/11/345fadfa-549a-462a-b757-9ab258e747f3.jpg",
    stats: {
      benchmarks: 8,
    },
    sisterTasks: [],
    commonMethods: [
      { name: "GRPO", count: -10 },
      { name: "Fine-tuning", count: -9 },
      { name: "Qwen3", count: -8 },
      { name: "Large language model (LLM)", count: -8 },
      { name: "Post-training", count: -6 },
      { name: "Direct Preference Optimization (DPO)", count: -4 },
      { name: "DeepSeek-R1", count: -4 },
      { name: "On-policy distillation", count: -3 },
    ],
  },
  {
    slug: "remote-sensing",
    displayName: "Remote Sensing",
    title: "REMOTE SENSING",
    description:
      "Remote sensing analyzes satellite, aerial, and drone imagery for land cover, environmental monitoring, geospatial understanding, and earth observation.",
    imageUrl: "",
    stats: {
      benchmarks: null,
    },
    sisterTasks: [{ name: "Earth Observation", slug: "earth-observation" }],
    commonMethods: [
      { name: "Segment Anything (SAR)", count: -5 },
      { name: "LLaVa", count: -6 },
      { name: "Fine-tuning", count: -3 },
      { name: "CLIP", count: -3 },
      { name: "Vision Transformer", count: -3 },
      { name: "Convolution", count: -3 },
      { name: "Batch Normalization", count: -3 },
      { name: "Self-supervised learning", count: -2 },
    ],
  },
  {
    slug: "robotics",
    displayName: "Robotics",
    title: "ROBOTICS",
    description:
      "Robotics is an interdisciplinary field of study involving computer science, engineering, and technology to design, construct, operate, and utilize machines known as robots. These programmable machines are built to replicate, substitute, or assist in human actions, performing a vast array of tasks in industries from manufacturing and healthcare to exploration and entertainment.",
    imageUrl:
      "https://images.ctfassets.net/qx5k8y1u9drj/XDpqBBey1oW5zYszgwfbQ/27b5089928f06047d4d7c5eea47c3b6c/image__69__copy.png",
    stats: {
      benchmarks: 13,
    },
    sisterTasks: [],
    commonMethods: [
      { name: "VLA", count: -5 },
      { name: "Pre-training", count: -4 },
      { name: "LLaVa", count: -8 },
      { name: "Fine-tuning", count: -7 },
      { name: "ACT", count: -5 },
      { name: "Diffusion Policy", count: -6 },
      { name: "PPO", count: -8 },
      { name: "Post-training", count: -1 },
      { name: "LingBot-VA", count: -5 },
    ],
  },
  {
    slug: "scene-text-recognition",
    displayName: "Scene Text Recognition",
    title: "SCENE TEXT RECOGNITION",
    description:
      "Recognize textual content from cropped natural-scene word images. Standard STR benchmarks include regular datasets such as IC13, SVT, and IIIT5K, plus irregular datasets such as IC15, SVTP, and CUTE80.",
    imageUrl: "",
    stats: {
      benchmarks: 6,
    },
    sisterTasks: [],
    commonMethods: [],
  },
];

// ====================== HELPER FUNCTIONS ======================
function formatSlug(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getTaskBySlug(slug: string) {
  return tasks.find((task) => task.slug === slug);
}

function getTaskMetadata(slug: string) {
  const task = getTaskBySlug(slug);

  if (!task) {
    // Fallback for unknown slugs
    const displayName = formatSlug(slug);
    return {
      displayName,
      title: displayName.toUpperCase(),
      description: "Task description coming soon.",
      imageUrl: null,
      stats: {
        benchmarks: 0,
      },
      sisterTasks: [],
      commonMethods: [],
    };
  }

  return task;
}

function getMethodsUsed(commonMethods: Array<any>): string {
  const count = commonMethods.length;
  return count > 8 ? "8+" : count.toString();
}

// ====================== PAGE COMPONENT ======================
export default async function TaskPage({ params }: TaskPageProps) {
  const { slug } = await params;
  const metadata = getTaskMetadata(slug);

  let initialPapers: GetPapersResult | null = null;
  let sisterTaskCounts: Record<string, number> = {};

  try {
    // Fetch papers for the current task
    initialPapers = await getPapers({
      page: 1,
      task: slug,
    });

    // Fetch counts for each sister task in parallel
    const sisterTaskPromises = metadata.sisterTasks.map(async (task) => {
      try {
        const result = await getPapers({
          page: 1,
          task: task.slug,
        });
        return {
          slug: task.slug,
          count: result?.total ?? result?.papers?.length ?? 0,
        };
      } catch (err) {
        console.error(
          `Failed to fetch papers for sister task "${task.slug}":`,
          err,
        );
        return {
          slug: task.slug,
          count: 0,
        };
      }
    });

    const sisterResults = await Promise.all(sisterTaskPromises);
    sisterTaskCounts = sisterResults.reduce(
      (acc, { slug, count }) => {
        acc[slug] = count;
        return acc;
      },
      {} as Record<string, number>,
    );
  } catch (err) {
    console.error(`Failed to fetch papers for task "${slug}":`, err);
  }

  // Get paper count from backend data
  const paperCount = initialPapers?.total ?? initialPapers?.papers?.length ?? 0;

  // Get methods count from commonMethods length
  const methodsUsed = getMethodsUsed(metadata.commonMethods);

  // Enrich sister tasks with counts from backend
  const enrichedSisterTasks = metadata.sisterTasks.map((task) => ({
    ...task,
    count: sisterTaskCounts[task.slug] ?? 0,
  }));

  // Check if there are any valid sister tasks (with non-empty names)
  const hasSisterTasks = enrichedSisterTasks.some(
    (task) => task.name && task.name.trim() !== "",
  );

  // Check if there are any common methods
  const hasCommonMethods = metadata.commonMethods.length > 0;

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#F8F7F2] text-[#111111]">
      <Navbar />

      <div
        id="scroll-container"
        className="flex-1 overflow-y-auto overflow-x-hidden hide-scroll flex flex-col"
      >
        <div className="w-full max-w-[1600px] mx-auto px-6 md:px-10 xl:px-14 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[13px] tracking-wide text-[#7B736A] mb-8">
            <Link href="/" className="hover:text-black transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/tasks" className="hover:text-black transition-colors">
              Tasks
            </Link>
            <span>/</span>
            <span className="text-[#0E4B8E] uppercase font-medium">
              {metadata.title}
            </span>
          </nav>

          {/* Hero Section */}
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_460px] gap-12 items-start">
            {/* Left Content */}
            <div className="max-w-[720px]">
              {/* Task Title */}
              <div className="mt-2">
                <p className="text-[12px] uppercase tracking-[0.18em] text-[#0E4B8E] font-medium mb-3">
                  TASK
                </p>
                <h1 className="text-[72px] leading-none font-black tracking-tighter text-[#1A1A1A]">
                  {metadata.title}
                </h1>
              </div>

              {/* Description */}
              <p className="mt-8 text-[14px] leading-[1.5rem] text-[#222222]">
                {metadata.description}
              </p>

              {/* Stats - Now using dynamic counts */}
              <div className="mt-10">
                <div className="flex flex-wrap items-center gap-x-12 gap-y-8">
                  <Stat label="Papers" value={paperCount} />
                  <Stat label="Benchmarks" value={metadata.stats.benchmarks ?? 0} />
                  <Stat label="Methods Used" value={methodsUsed} />
                </div>
              </div>

              {/* Divider - only show if there are sister tasks */}
              {hasSisterTasks && (
                <div className="border-t border-[#D7D2CA] mt-5" />
              )}

              {/* Sister Tasks - only show if there are any */}
              {hasSisterTasks && (
                <div className="mt-4">
                  <div className="flex items-center flex-wrap gap-x-4 gap-y-3">
                    <p className="text-[12px] uppercase text-[#7B736A] tracking-[0.10em] font-semibold whitespace-nowrap">
                      SISTER TASKS
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {enrichedSisterTasks.map((task, idx) => (
                        <SisterTaskTag
                          key={idx}
                          name={task.name}
                          slug={task.slug}
                          count={task.count}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Visual Card - only show if there's an image */}
            {metadata.imageUrl && (
              <div className="w-full max-w-[480px] xl:mt-4">
                <div className="h-[320px] rounded-2xl border border-[#DDD6CC] bg-white overflow-hidden relative">
                  <Image
                    src={metadata.imageUrl}
                    alt={`${metadata.title} Diagram`}
                    fill
                    className="object-contain p-6"
                    priority
                    unoptimized
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Papers Section */}
        <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 xl:px-12 pt-4 pb-12">
          <div className="flex flex-col xl:flex-row items-start gap-8 xl:gap-10">
            {/* LEFT: Papers Section */}
            <main className="flex-1 min-w-0 w-full">
              <PaperTabs />
              <PaperList
                selectedTag={metadata.displayName}
                initialPapers={initialPapers}
                initialError="Failed to load papers. Please try again later."
              />
            </main>

            {/* RIGHT: Sidebar */}
            <aside className="w-full xl:w-[380px] flex-shrink-0 space-y-12">
              {/* 01 / SISTER TASKS - only show if there are any */}
              {hasSisterTasks && (
                <div>
                  <div className="block items-baseline gap-3 mb-4">
                    <span className="text-[13px] font-mono text-[#7B736A]">
                      01/
                    </span>
                    <h3 className="text-[13px] uppercase py-1 tracking-[0.08em] text-[#000] font-semibold border-b border-1 border-[#D7D2CA]">
                      SISTER TASKS
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {enrichedSisterTasks.map((item, idx) => (
                      <Link
                        key={idx}
                        href={`/tasks/${item.slug}`}
                        className="flex justify-between items-center py-1 group cursor-pointer no-underline"
                      >
                        <span className="text-[14px] text-[#333] group-hover:text-[#F55036] px-3 py-1 rounded-[10px] transition-all font-semibold">
                          {item.name}
                        </span>
                        <span className="font-medium text-[#8D857B] tabular-nums">
                          {item.count}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* 02 / COMMON METHODS - only show if there are any */}
              {hasCommonMethods && (
                <div>
                  <div className="block items-baseline gap-3 mb-4">
                    <span className="text-[13px] font-mono text-[#7B736A]">
                      02/
                    </span>
                    <h3 className="text-[13px] uppercase py-1 tracking-[0.08em] text-[#000] font-semibold border-b border-1 border-[#D7D2CA]">
                      COMMON METHODS
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {metadata.commonMethods.map((method, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center py-1 group"
                      >
                        <span className="cursor-pointer text-[12px] text-[#333] border border-black border-opacity-30 group-hover:border-opacity-100 bg-white px-3 py-1 rounded-[6px] transition-all hover:bg-transparent hover:border-[#F55036]">
                          {method.name}
                        </span>
                        <span className="font-medium text-[#8D857B] tabular-nums">
                          {method.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

// ====================== SUB COMPONENTS ======================

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-end gap-2">
      <span className="text-[13px] font-bold text-[#111] tabular-nums">
        {value}{" "}
        <span className="uppercase tracking-[0.18em] text-[#7B736A] ml-2">
          {label}
        </span>
      </span>
    </div>
  );
}

function SisterTaskTag({
  name,
  slug,
  count,
}: {
  name: string;
  slug: string;
  count: number;
}) {
  return (
    <Link
      href={`/tasks/${slug}`}
      className="cursor-pointer inline-flex items-center rounded-full border border-[#DDD6CC] bg-white px-4 py-1 text-[13px] text-[#333] transition hover:bg-transparent hover:border-[#F55036] no-underline"
    >
      {name}
      <span className="ml-1.5 text-[#8D857B] font-medium tabular-nums">
        ({count})
      </span>
    </Link>
  );
}
