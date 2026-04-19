CREATE TABLE IF NOT EXISTS site_content_documents (
  document_key VARCHAR(80) PRIMARY KEY,
  document_json TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
