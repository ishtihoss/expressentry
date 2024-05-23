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
    id: number; // Assuming the ID is a number. Adjust the type as necessary.
    title: string;
    url: string;
    article_date: string;
    content: string;
    length: number;
    tokens: number;
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