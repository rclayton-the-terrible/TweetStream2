function listCountries() {
    countriesReq = new XMLHttpRequest();
    countriesReq.open("GET", "/x/geo?action=list_countries", false);
    countriesReq.send(null);

    countriesString = countriesReq.responseText;
    countriesArray = countriesString.split(' ', -1);

    return countriesArray;
}

// courtesy of http://snipplr.com/view/19601/
function interpolateColor(minColor, maxColor, frac) {
    function d2h(d) {
        return d.toString(16);
    }

    function h2d(h) {
        return parseInt(h, 16);
    }
    if (frac == 0) {
        return minColor;
    }
    if (frac == 1) {
        return maxColor;
    }

    var color = "#";

    for (var i = 1; i <= 6; i += 2) {
        var minVal = new Number(h2d(minColor.substr(i, 2)));
        var maxVal = new Number(h2d(maxColor.substr(i, 2)));
        var nVal = minVal + (maxVal - minVal) * (frac);
        var val = d2h(Math.floor(nVal));

        while (val.length < 2) {
            val = "0" + val;
        }
        color += val;
    }
    return color;
}

function updateColors(map, valsByCountry, minColor, maxColor){

    var nodataColor = '#000000';
    var unpopulatedColor = '#FFFFFF';

    rc = window.reportingCountries;

    for (var i = 0; i < window.L; i++) {

        var style = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);

        country = window.countries[i];

        if (country in valsByCountry) {
            var value = valsByCountry[country];
            var vu = interpolateColor(minColor, maxColor, value);
            style.fillColor = vu;
        }
        else if (country in rc) {
            style.fillColor = nodataColor;
            style.fillOpacity = 0.1;
            style.strokeColor = 'white';
            style.strokeWidth = 1.1;
        }
        else {
            style.fillColor = unpopulatedColor;
            style.strokeColor = unpopulatedColor;
            style.fillOpacity = 1.0;
        }

        var layer = map.layers[i + 1]; // offset the first GS layer
        layer.features[0].style = style;
        layer.redraw();
    }
}

function drawMap(mapElement){
    var map = new OpenLayers.Map(mapElement);

    // add Google Streets
    var gmap = new OpenLayers.Layer.Google(
        "Google Streets",
        {'sphericalMercator':true,
            'maxExtent':new OpenLayers.Bounds(-20037508.34, -20037508.34, 20037508.34, 20037508.34)
        }
    );

    map.addLayer(gmap);

    var cindsByCountry = [];

    for (var i = 0; i < L; i++) {
        country = countries[i];
        cindsByCountry[country] = i;

        polygon = new OpenLayers.Layer.Vector("KML",
            {
                strategies:[new OpenLayers.Strategy.Fixed()],
                protocol:new OpenLayers.Protocol.HTTP(
                    {
                        url:encodeURI("/x/geo?action=get_kml&country=" + country, true),
                        format:new OpenLayers.Format.KML(
                            {
                                extractStyles:true,
                                extractAttributes:true,
                                maxDepth:2
                            })
                    })
            });

        map.addLayer(polygon);
    }

    var lat = 47.040182;
    var lon = 61.171875;

    var lonlat = new OpenLayers.LonLat(lon, lat);

    var proj = new OpenLayers.Projection("EPSG:4326"); // WGS 1984
    var mapProj = map.getProjectionObject() // Spherical Mercator Projection

    lonlat.transform(proj, mapProj);

    var zoom = 2;

    map.setCenter(lonlat, zoom);

    return map;
}

$(function(){

    window.reportingCountries = [
        "AD", "AE", "AF", "AG", "AL", "AM", "AO", "AR", "AT", "AU",
        "AZ", "BA", "BB", "BD", "BE", "BF", "BG", "BH", "BI", "BJ",
        "BN", "BO", "BR", "BS", "BT", "BW", "BY", "BZ", "CA", "CD",
        "CF", "CG", "CH", "CI", "CL", "CM", "CN", "CO", "CR", "CU",
        "CV", "CY", "CZ", "DE", "DJ", "DK", "DM", "DO", "DZ", "EC",
        "EE", "EG", "ER", "ES", "ET", "FI", "FJ", "FM", "FR", "GA",
        "GB", "GD", "GE", "GH", "GM", "GN", "GQ", "GR", "GT", "GW",
        "GY", "HN", "HR", "HT", "HU", "ID", "IE", "IL", "IN", "IQ",
        "IR", "IS", "IT", "JM", "JO", "JP", "KE", "KG", "KH", "KI",
        "KM", "KN", "KP", "KR", "KW", "KZ", "LA", "LB", "LC", "LI",
        "LK", "LR", "LS", "LT", "LU", "LV", "LY", "MA", "MC", "MD",
        "ME", "MG", "MH", "MK", "ML", "MM", "MN", "MR", "MT", "MU",
        "MV", "MW", "MX", "MY", "MZ", "NA", "NE", "NG", "NI", "NL",
        "NO", "NP", "NR", "NZ", "OM", "PA", "PE", "PG", "PH", "PK",
        "PL", "PT", "PW", "PY", "QA", "RO", "RS", "RU", "RW", "SA",
        "SB", "SC", "SD", "SE", "SG", "SI", "SK", "SL", "SM", "SN",
        "SO", "SR", "ST", "SV", "SY", "SZ", "TD", "TG", "TH", "TJ",
        "TL", "TM", "TN", "TO", "TR", "TT", "TV", "TW", "TZ", "UA",
        "UG", "US", "UY", "UZ", "VC", "VE", "VN", "VU", "WS", "YE",
        "ZA", "ZM", "ZW"
    ];

    window.countries = listCountries();
    window.L = countries.length;

    window.mapabout = drawMap("mapabout");
    window.mapfrom = drawMap("mapfrom");
});