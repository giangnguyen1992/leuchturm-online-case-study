export interface HNItem {
  id: number;
  title: string;
  url?: string;
  score: number;
  by: string;
  time: number;
  type: string;
  descendants?: number;
}

export interface HNStoryDisplay {
  id: number;
  title: string;
  url: string;
  hostname: string;
  score: number;
  author: string;
  commentsUrl: string;
}
