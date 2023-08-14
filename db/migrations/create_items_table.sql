-- Create a simple to do items table.
CREATE TABLE items (
  id TEXT PRIMARY KEY NOT NULL,
  title TEXT NOT NULL,
  done INTEGER NOT NULL DEFAULT 0, -- Electric doesn't support booleans yet
  added INTEGER NOT NULL
);

-- ⚡
-- Electrify the table
CALL electric.electrify('items');
