---
layout: page
title: "All Posts"
permalink: /all-posts/
---

<div class="row listrecent">
{% assign posts = site.posts | sort: 'date' | reverse %}
{% for post in posts %}
  {% if post.title %}
    {% include postbox.html %}
  {% endif %}
{% endfor %}
</div>
