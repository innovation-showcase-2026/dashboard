export interface ParticipantTest {
  boothId?: number | string;
  boothNumber: number;
  boothTitle: string;
  topicTitle?: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  timeTakenSeconds: number;
  completedAt: string;
}

export interface Participant {
  id?: string;
  entId: string;
  name: string;
  lob: string;
  registeredAt?: string;
  totalTestsAppeared: number;
  totalScore: number;
  totalQuestions: number;
  overallAccuracy: number;
  isPrizeEligible: boolean;
  lastUpdated?: string;
  tests?: ParticipantTest[];
  rank?: number;
}

export interface BoothDefinition {
  id: number;
  number: number;
  title: string;
  shortTitle: string;
  iconName: string;
  color: string;
  description: string;
}

export interface BoothStats {
  boothNumber: number;
  boothTitle: string;
  totalAttempts: number;
  averageScore: number;
  averageAccuracy: number;
  averageTimeSeconds: number;
  topPerformer?: {
    name: string;
    entId: string;
    score: number;
    timeTakenSeconds: number;
  };
}

export interface LobStats {
  lob: string;
  participantCount: number;
  totalScore: number;
  averageScore: number;
  averageAccuracy: number;
  boothsCompleted: number;
  prizeEligibleCount: number;
}

export interface SummitKPIs {
  totalRegistered: number;
  totalSubmissions: number;
  prizeEligibleCount: number;
  averageAccuracy: number;
  averageScore: number;
  totalScoreSum: number;
}

export const SUMMIT_BOOTHS: BoothDefinition[] = [
  {
    id: 1,
    number: 1,
    title: "Generative AI & LLMs",
    shortTitle: "Gen AI & LLM",
    iconName: "Cpu",
    color: "#6366F1",
    description: "Foundational models, RAG architectures, prompt engineering & agentic workflows"
  },
  {
    id: 2,
    number: 2,
    title: "Cloud Native & Kubernetes",
    shortTitle: "Cloud & K8s",
    iconName: "Cloud",
    color: "#0EA5E9",
    description: "Microservices orchestration, service mesh, container security & multi-cloud"
  },
  {
    id: 3,
    number: 3,
    title: "Cybersecurity & Zero Trust",
    shortTitle: "Zero Trust",
    iconName: "ShieldCheck",
    color: "#EF4444",
    description: "Identity governance, cryptography, threat intel & zero-trust network architectures"
  },
  {
    id: 4,
    number: 4,
    title: "Data Engineering & Lakehouse",
    shortTitle: "Data Lakehouse",
    iconName: "Database",
    color: "#10B981",
    description: "Delta lake, streaming pipelines, modern data stack & analytics at scale"
  },
  {
    id: 5,
    number: 5,
    title: "DevOps, SRE & CI/CD",
    shortTitle: "DevOps & SRE",
    iconName: "GitMerge",
    color: "#F59E0B",
    description: "GitOps, automated pipelines, observability, chaos engineering & resilient systems"
  },
  {
    id: 6,
    number: 6,
    title: "Software Architecture & APIs",
    shortTitle: "Arch & APIs",
    iconName: "Layers",
    color: "#8B5CF6",
    description: "Event-driven design, GraphQL/gRPC APIs, domain-driven design & scalability"
  },
  {
    id: 7,
    number: 7,
    title: "IoT & Edge Computing",
    shortTitle: "IoT & Edge",
    iconName: "Radio",
    color: "#EC4899",
    description: "Connected devices, edge telemetry, industrial protocols & distributed sensor nets"
  },
  {
    id: 8,
    number: 8,
    title: "Web3 & Distributed Ledgers",
    shortTitle: "Web3 & DLT",
    iconName: "Link",
    color: "#14B8A6",
    description: "Decentralized protocols, smart contracts, asset tokenization & zero-knowledge proofs"
  },
  {
    id: 9,
    number: 9,
    title: "Quantum & Emerging Horizons",
    shortTitle: "Quantum & Future",
    iconName: "Sparkles",
    color: "#F43F5E",
    description: "Quantum computing algorithms, post-quantum crypto & next-generation frontier tech"
  }
];
