SELECT
  [from],
  text,
  score
FROM
  mydataset.mytable
WHERE
  text CONTAINS 'Google'
  OR text CONTAINS 'Android'
  OR text CONTAINS 'GCP'
  OR text CONTAINS 'GoogleCloud'
  OR text CONTAINS 'Windows'
  OR text CONTAINS 'Microsoft'
ORDER BY
  [from] DESC
LIMIT
  1000 IGNORE CASE;