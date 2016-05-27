# Find in Repo

**Search a Github repository for a keyword**

**Check out the [Find in Repo site](http://tylerbuchea.com/find-in-repo)**

### Add as a Chrome "Custom Search Enginge"

Add the snippet below as a "Custom Search Engine" in Chrome under `Settings > Manage Search Engines`.

Then in your omni-bar you can do this `find-in-repo[TAB] jquery/jquery;// TODO`

```
javascript:
var s='%s';
url='http://tylerbuchea.com/find-in-repo/?repo=%s&keyword=%s';
query='';
urlchunks=url.split('%s');
schunks=s.split(';');
for(i=0;i<schunks.length;i++)query+=urlchunks[i]+schunks[i];
location.replace(query);
```

### Reference

* [3 Ways to Enhance Google Chromes Custom Search](http://www.makeuseof.com/tag/3-ways-to-enhance-google-chromes-custom-search/)
