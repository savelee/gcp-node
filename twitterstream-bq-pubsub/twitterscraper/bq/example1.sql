SELECT SUM(score) as totalscore,
  organizations,
  COUNT(organizations) as totaltweets
FROM mydataset.mytable
GROUP BY organizations
ORDER BY totalscore DESC