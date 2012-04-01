
$(function(){

       /*
       window.haveMaps = true;

       try {

       var myOptions = {
            center: new google.maps.LatLng(39.75, -104.87),
            zoom: 2,
            mapTypeId: google.maps.MapTypeId.ROADMAP
      };

       window.mapabout = new google.maps.Map(document.getElementById("mapabout"), myOptions);
       window.mapfrom = new google.maps.Map(document.getElementById("mapfrom"), myOptions);

       } catch (e){

           window.haveMaps = false;

           $("#mapabout").html("<h2>Sorry Could Not Connect to Google Maps.</h2>");
           $("#mapfrom").html("<h2>Sorry Could Not Connect to Google Maps.</h2>");
       }
       */
       //drawChart("topchart1");
       //drawChart("topchart2");
       //drawChart("topchart3");
       //drawChart("topchart4");
       //drawChart("topchart5");
   });

function drawChart(element){
    return new Highcharts.Chart({
    chart: {
        renderTo: element,
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: true
    },
    credits: {
        enabled: false
    },
    exporting: {
        enabled: false
    },
    title: {
        text: ''
    },
    tooltip: {
        formatter: function() {
            return '<b>'+ this.point.name +'</b>: '+ this.percentage +' %';
        }
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: false,
                color: '#000000',
                connectorColor: '#000000',
                formatter: function() {
                    return '<b>'+ this.point.name +'</b>: '+ this.percentage +' %';
                }
            }
        }
    },
    series: [{
        type: 'pie',
        name: 'Browser share',
        data: [
            ['Firefox',   45.0],
            ['IE',       26.8],
            {
                name: 'Chrome',
                y: 12.8,
                sliced: true,
                selected: true
            },
            ['Safari',    8.5],
            ['Opera',     6.2],
            ['Others',   0.7]
        ]
    }]
});
}