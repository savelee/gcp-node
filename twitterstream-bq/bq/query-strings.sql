SELECT * FROM mydataset.mytable
WHERE text LIKE '%term1%'
  AND text LIKE '%term2%'

/*
SELECT mytable.from, text, score FROM mydataset.mytable
WHERE text like "%Trump%" and score > 0
*/