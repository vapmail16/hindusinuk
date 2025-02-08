export interface QuizQuestion {
  question: string;
  options: {
    text: string;
    isCorrect: boolean;
  }[];
  level: number;
}

export interface MythologyStory {
  title: string;
  content: string;
  moral: string;
}

export interface YoutubeVideo {
  title: string;
  url: string;
  videoId: string;
} 