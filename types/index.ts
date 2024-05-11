export enum OpenAIModel {
    DAVINCI_TURBO = "gpt-3.5-turbo"
  }
  
  export type ExpressEntryArticle = {
    title: string;
    url: string;
    date: string;
    content: string;
    length: number;
    tokens: number;
    chunks: ExpressEntryChunk[];
  };
  
  export type ExpressEntryChunk = {
    title: string;
    url: string;
    article_date: string;
    content: string;
    content_length: number;
    content_tokens: number;
    embedding: number[];
  };
  
  export type ExpressEntryJSON = {
    current_date: string;
    source: string;
    url: string;
    length: number;
    tokens: number;
    articles: ExpressEntryArticle[];
  };