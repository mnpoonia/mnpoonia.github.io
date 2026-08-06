---
title: What is HFileLink and Reference in HBase?
published: 2025-04-03T18:44:47+05:30
description: The distinction between HBase HFileLink and Reference files.
---

In HBase there are two things that seem similar but are very different: links and references.

`HFileLink` is the implementation name for `FileLink`. It describes a link to an HFile, much like a URL or path. It means an HFile can be served regardless of whether it is in the region directory or archive directory. By default it looks in the original region directory defined by the link name; if it does not find the file there, it falls back to the archive directory.

This is helpful for snapshots. A snapshot is a list of HFile links to the original HFiles for the table being snapshotted.

## Reference

A Reference is an HFile that refers to the top or bottom half of another HFile. It is useful during splits and merges. During a split, HBase does not need to copy all data to the new region. Instead, a new region is created and a reference HFile points to the top or bottom of the original region HFile. A special HFile reader, `HalfStoreFileReader`, reads it. Eventually compaction copies the data into the new region.

### Advantage

- Splits are fast.

### Disadvantage

- A region cannot split again until the reference file is deleted during minor compaction.
