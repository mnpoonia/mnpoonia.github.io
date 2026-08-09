---
title: How the Buffer Pool Manager Works
published: 2026-08-09
description: ""
draft: true
categories: ["Databases"]
tags: ["buffer pool", "cache eviction"]
---

This is a follow-up to [What Is a Buffer Pool?](/posts/2026-08-09-buffer-pool/).

**How do we serve a database that has more data to serve than it has memory?**  
What i referred as file above is called a page in database systems. A physical file might have multiple pages which helps database in read performance tremendously. And upper layer asks for the page and not whole database file. This is in itself a different topic that how upper layer knows which page it needs.

Now we know that buffer pool manager is the layer which upper layer asks for pages and the below diagram explains what heppens within buffer pool manager at high level.
```
[ Upper Layer (Query Engine) ]
             |
             v  (Requests Page X)
   [ Buffer Pool Manager ]
             |
             +---> Is Page X in RAM? 

             |         |
             |         +---> YES (Buffer Pool Hit) ---> Return data instantly (~50ns)

             |         |
             |         +---> NO  (Buffer Pool Miss)

             |                     |
             |                     v
             |               [ Evict Old Page if Full ] 
             |               [ Issue I/O Request to Storage Tier ]

             |                     |
             |                     v
             |               [ Load Page X into RAM Buffer ]

             |                     |
             |                     v
             +---------------------+---> Pin Page & Return data to Upper Layer
```
Now we know what all buffer pool manager does. 
