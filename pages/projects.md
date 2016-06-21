---
layout: raw
title: Projects
group: navigation
permalink: /projects/
---

<div class="page-header text-center">

  <h1><span class="glyphicon glyphicon-wrench"></span> Projects</h1>

</div>

<div class="container">

  <div class="cards">

  {% for project in site.data.projects %}

    {% assign loopindex = forloop.index | modulo: 3 %}

    {% if forloop.first %}
    <div class="row">
    {% endif %}

        <div class="col-sm-6 col-md-4">
           <div class="card">
               <p><a class="url" href="{{ project.url }}" target="_blank">{{ project.name }}</a></p>
               <p>{{ project.desc }}</p>
               <p class="text-muted">{{ project.tech }}</p>
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
