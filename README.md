## Create users table
```sql
CREATE TABLE users (  
  id INTEGER NOT NULL PRIMARY KEY, 
  name TEXT NOT NULL, 
  profile TEXT, 
  created_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime')), 
  updated_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime')), 
  date_of_birth TEXT
);
```

## Create sample data
```sql
INSERT INTO users (name, profile) VALUES ("Light", "僕は新世界の神となる！");
INSERT INTO users (name, profile) VALUES ("Misa", "彼女にしてください");
INSERT INTO users (name, profile) VALUES ("L", "いえ自分が話してる時に人の携帯が鳴ったりするのが許せないだけです");
INSERT INTO users (name, profile) VALUES ("Near", "できるできないではなく、やるんです…");
```