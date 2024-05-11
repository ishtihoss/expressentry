-- RUN 1st
CREATE EXTENSION vector;

-- RUN 2nd
CREATE TABLE chunks (
  id BIGSERIAL PRIMARY KEY,
  url TEXT,
  title TEXT,
  content TEXT,
  length BIGINT,
  tokens BIGINT,
  embedding VECTOR(1536)
);

-- RUN 3rd after running the scripts
CREATE OR REPLACE FUNCTION search_chunks (
  query_embedding VECTOR(1536),
  similarity_threshold FLOAT,
  match_count INT
)
RETURNS TABLE (
  id BIGINT,
  url TEXT,
  title TEXT,
  content TEXT,
  length BIGINT,
  tokens BIGINT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    chunks.id,
    chunks.url,
    chunks.title,
    chunks.content,
    chunks.length,
    chunks.tokens,
    1 - (chunks.embedding <=> query_embedding) AS similarity
  FROM chunks
  WHERE 1 - (chunks.embedding <=> query_embedding) > similarity_threshold
  ORDER BY chunks.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- RUN 4th
CREATE INDEX ON chunks
USING IVFFLAT (embedding VECTOR_COSINE_OPS)
WITH (lists = 100);-- Create the necessary tables for the Express Entry Chatbot 
-- You can define your database schema here 
