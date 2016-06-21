---
layout: raw
title : Posts
group: navigation
permalink: /posts/
---

<div class="page-header text-center">

  <h1><span class="glyphicon glyphicon-pencil"></span> Posts</h1>

</div>

<div class="container">

  <div class="cards">

  {% for post in site.posts %}

    {% assign loopindex = forloop.index | modulo: 3 %}

    {% if forloop.first %}
    <div class="row">
    {% endif %}

        <div class="col-sm-6 col-md-4">
           <div class="card">
               <p><a class="url" href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a></p>
               <p>{{ post.content | strip_html | truncatewords: 25 }}</p>
               <p class="text-muted">{{ post.date | date_to_string }}</p>
           </div>
        </div>

    {% if forloop.last %}
      </div>
    {% elsif loopindex == 0 %}
      </div>
      <div class="row">
    {% endif %}

  {% endfor %}

  </div>


</div>
