function getURLParameter(name) {
    return decodeURI(
        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
    );
}

var param = getURLParameter("genre")
var whatcolor = getURLParameter("color")

if(param == "rock")
    songs = rock;
else if (param == "rap")
    songs = rap;
else if (param == "country")
    songs = country;
else if (param == "blues")
    songs = blues;
else
    songs = all;

var po = org.polymaps;


ranges = []
for (var key in songs) {
    ranges.push(songs[key].count)
}

// Compute noniles.
var quantile = pv.Scale.quantile()
    .quantiles(9)
    //.domain(pv.values(unemployment))
    .domain([0,1,10,100, 500,1000, 3000, 10000, 20000])
    .range(0, 8);

var map = po.map()
    .container(document.getElementById("map").appendChild(po.svg("svg")))
    .center({lat: 39, lon: -96})
    .zoom(4)
    .zoomRange([3, 7])
    .add(po.interact());

map.add(po.image()
    .url(po.url("http://{S}tile.cloudmade.com"
    + "/1a1b06b230af4efdbb989ea99e9841af" // http://cloudmade.com/register
    + "/20760/256/{Z}/{X}/{Y}.png")
    .hosts(["a.", "b.", "c.", ""])));

map.add(po.geoJson()
    .url("http://polymaps.appspot.com/county/{Z}/{X}/{Y}.json")
    .on("load", load)
    .id("county"));

map.add(po.geoJson()
    .url("http://polymaps.appspot.com/state/{Z}/{X}/{Y}.json")
    .id("state"));

map.add(po.compass()
    .pan("none"));

function load(e) {
  for (var i = 0; i < e.features.length; i++) {
    var feature = e.features[i];
    if (feature.data.id.substring(9) == "000") continue; // skip bogus counties
    var d = songs[feature.data.id.substring(7)];
    if(!d) continue;
    var artists = songs[feature.data.id.substring(7)];
    feature.element.setAttribute("class", "q" + quantile(d.count) + "-" + 9);
    var list = feature.data.properties.name + ": " + d.count + "\n";
    for(var j = 0; j < Math.min(30,d.artists.length); j++) {
        list += d.artists[j] + '\n';
    }
    feature.element.appendChild(po.svg("title").appendChild(
        document.createTextNode(list))
        .parentNode);
  }
}

if(whatcolor == "blue")
{
    map.container().setAttribute("class", "Blues");
}
else if(whatcolor == "red")
{
    map.container().setAttribute("class", "Reds");
}
else if(whatcolor == "orange")
{
    map.container().setAttribute("class", "Oranges");

}
else{
    map.container().setAttribute("class", "Greens");
}
