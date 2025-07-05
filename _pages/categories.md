---
layout: page
title: Categories
permalink: /categories
---
<h3>Categories</h3>
<ul>
{% for category in site.categories %}
  <li><a href="{{ '/categories/' | append: category[0] | relative_url }}">{{ category[0] }} ({{ category[1].size }})</a></li>
{% endfor %}
</ul>
