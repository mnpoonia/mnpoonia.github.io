---
title: What Is a Buffer Pool?
published: 2026-08-10
description: ""
draft: true
categories: ["Databases"]
tags: ["buffer pool", "caching"]
---

Imagine a player is trending, and multiple users query the avg(score) for that player, over and over. Every single one of these queries fetches the same file from disk, processes it, and returns the result.

Every single time — even though the last query needed the exact same file, moments ago.

That doesnot sound very good. And it isn't.

Why fetch the same file again, when we already had it a moment back?

To answer that, look at just how slow disk actually is compared to memory.

**Performance Comparison Matrix**

| Drive Type | Storage Technology | Typical Latency | Max Throughput | Max IOPS | Best Use Case |
| :--- | :---: | ---: | :--- | :---: | ---: |
| Local NVMe | Solid State (PCIe) | ~10 – 100 µs | Up to 10+ GB/s | 1,000,000+ | High-performance caches, NoSQL scratch space |
| Local SATA | Solid State (SATA) | ~0.1 – 0.5 ms | ~550 MB/s | 50,000 – 90,000 | Budget boot drives, legacy server storage |
| AWS gp3 | Cloud SSD (Network) | ~1 – 2 ms | 1,000 MB/s | 16,000 | Boot volumes, transactional databases |
| AWS st1 | Cloud HDD (Network) | ~10 – 50 ms | 500 MB/s | 500 | Log processing, data lakes, big data streams |

The fix seems obvious: save the fetched file in memory once, and serve every later request from there instead of going back to disk.

**That memory, where we hold onto these files, is what we call the buffer pool — or buffer cache.**

*It acts as an abstraction layer that makes the database appear to run entirely on RAM, to the layer above it.*

**The Impact of Total Dataset Footprint (RAM vs. Disk)**

*Dataset < Available RAM:* If your total active data size is smaller than your server's RAM, disk performance matters very little. The operating system caches the data in memory, executing reads at blazing ~50ns RAM speeds.

*Dataset > Available RAM:* The moment your data size exceeds RAM capacity, the system experiences "cache thrashing" and must fetch data from the storage layer. Performance instantly plummets to disk-level latencies.

- Falling from RAM to Local NVMe drops performance by roughly **1,000x**.
- Falling from RAM to AWS gp3 drops performance by roughly **20,000x**.
- Falling from RAM to AWS st1 drops performance by roughly **200,000x+**.

**But what happens when your data doesn't fit in RAM at all?** That's where the buffer pool manager comes in — covered in the next post.
