+++
date = '2025-04-03T18:44:47+05:30'
title = 'What is HFileLink and Reference in HBase?'
+++


In HBase there are two things that seems similar but are very different.
`Links` and `References`. Names sound similar but they are not.  

Links - HFileLink is the implementation name for FileLink

**HFileLink** describes a link to hfile. It is more like a URL or path to the file. It means a hfile will be served regardless of its location being region directory or archive directory
By default it will always look into the original location(region dir) defined by link name. If it doesn't find the file there it will fall back to archive directory.
So this is helpful for snapshots. As snapshots is nothing but list of hfile links to original hfiles of table for which snapshot it taken.

**Reference**  
Reference is a hfile where the reference hfile refer to some(top or bottom) half of another hfile. This comes handy when we are doing splits or merges. In splits we don't need to copy whole data to new region. Infact new region is created and a reference hfile is created which points to top or bottom of original region hfile. And when it has to be read there is a special hfile reader that reads this type of hfile called HalfStoreFileReader. Eventually when compaction is trigerred data is copied to new region.  

Advantage

- Splits are fast  

Disadvantage  

- Region can't split again until the reference file is deleted(as part of minor compaction).  
