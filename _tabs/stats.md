---
layout: page
icon: fas fa-chart-line
order: 7
title: ./stats
---

```
$ curl -s https://api.github.com/users/PockedCargo
```

<div id="jkStatsBox" class="jk-stats-box">Fetching live data...</div>

<style>
.jk-stats-box{font-family:monospace;font-size:13.5px;color:var(--text-muted-color);
  background:var(--card-bg);border:1px solid var(--main-border-color);border-radius:8px;
  padding:16px 18px;margin:8px 0 28px;}
.jk-stats-box .val{color:var(--link-color);font-weight:700;}
.jk-stats-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin:8px 0 28px;}
.jk-stat-card{background:var(--card-bg);border:1px solid var(--main-border-color);border-radius:8px;
  padding:14px 16px;text-align:center;}
.jk-stat-card .n{font-family:monospace;font-size:26px;color:var(--link-color);font-weight:700;}
.jk-stat-card .l{font-size:11px;color:var(--text-muted-color);letter-spacing:0.5px;text-transform:uppercase;margin-top:4px;}
</style>

<script>
fetch('https://api.github.com/users/PockedCargo')
  .then(r => r.json())
  .then(d => {
    document.getElementById('jkStatsBox').innerHTML =
      `login: <span class="val">${d.login}</span> &nbsp;|&nbsp; ` +
      `public_repos: <span class="val">${d.public_repos}</span> &nbsp;|&nbsp; ` +
      `followers: <span class="val">${d.followers}</span> &nbsp;|&nbsp; ` +
      `following: <span class="val">${d.following}</span> &nbsp;|&nbsp; ` +
      `account_created: <span class="val">${new Date(d.created_at).toISOString().slice(0,10)}</span>`;
  })
  .catch(() => {
    document.getElementById('jkStatsBox').textContent = 'error: could not reach GitHub API (rate-limited or offline)';
  });
</script>

## Learning progress

> These are self-reported, updated manually as things get completed — no fake numbers, no inflated stats.
{: .prompt-info }

<div class="jk-stats-grid">
  <div class="jk-stat-card"><div class="n">2</div><div class="l">Sherlocks Completed</div></div>
  <div class="jk-stat-card"><div class="n">1</div><div class="l">Machines Completed</div></div>
  <div class="jk-stat-card"><div class="n">1</div><div class="l">Certifications In Progress</div></div>
  <div class="jk-stat-card"><div class="n">2</div><div class="l">Independent Projects</div></div>
</div>

```
$ echo "real numbers only — ask me before you trust a stats page that isn't yours"
```
