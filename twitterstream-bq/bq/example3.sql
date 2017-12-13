SELECT COUNT(text) AS total, (SELECT COUNT(text)
        FROM `leeboonstra-blogdemos.thinkgoogle.sport`  WHERE text LIKE '%soccer%' OR text like '%voetbal%' OR text LIKE '%football%') AS soccer,
        (SELECT COUNT(text)
        FROM `leeboonstra-blogdemos.thinkgoogle.sport`  WHERE text LIKE '%tennis%' OR text like '%wimbledon%' OR text LIKE '%paris masters%') AS tennis,
        (SELECT COUNT(text)
        FROM `leeboonstra-blogdemos.thinkgoogle.sport`  WHERE text LIKE '%basketball%' OR text like '%nba%') AS basketball,
        (SELECT COUNT(text)
        FROM `leeboonstra-blogdemos.thinkgoogle.sport`  WHERE text LIKE '%formule 1%' OR text like '%auto racing%') AS autoracing,
        (SELECT COUNT(text)
        FROM `leeboonstra-blogdemos.thinkgoogle.sport`  WHERE text LIKE '%ice skating%' OR text like '%schaatsen%') AS iceskating,
        (SELECT COUNT(text)
        FROM `leeboonstra-blogdemos.thinkgoogle.sport`  WHERE text LIKE '%baseball%' OR text like '%mlb%') AS baseball,
        (SELECT COUNT(text)
        FROM `leeboonstra-blogdemos.thinkgoogle.sport`  WHERE text LIKE '%wielrennen%' OR text like '%biking%') AS biking        
FROM `leeboonstra-blogdemos.thinkgoogle.sport` 