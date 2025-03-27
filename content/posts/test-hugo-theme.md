+++
date = '2025-03-27T23:06:52+05:30'
draft = true
title = 'Test Hugo Theme'
+++

To test a new Hugo theme here are the list of steps
- Find the right theme. For this example we will use the theme `hyde` 
- Use below git command to put theme in local theme directory
    - ` git subtree add --prefix themes/hyde https://github.com/spf13/hyde.git master --squash

This command will put the theme inside themes directory`

- Change hugo.toml and add `theme = "hyde"`

- Run hugo server --buildDrafts
- Open [localhost:1313](localhost:1313)

You should be able to see your site in new theme