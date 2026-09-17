(function () {
  'use strict';

  var rootStyle = getComputedStyle(document.documentElement);
  function token(name, fallback) {
    var value = rootStyle.getPropertyValue(name).trim();
    return value || fallback;
  }

  var chartSeries1 = token('--chart-series-1', '#D61F69');
  var chartSeries2 = token('--chart-series-2', '#E11D48');
  var chartSeries3 = token('--chart-series-3', '#C026D3');
  var chartSeries4 = token('--chart-series-4', '#F97316');
  var chartOther = token('--chart-other', '#E8DAE0');
  var inkColor = token('--ink', '#2A181E');
  var labelColor = token('--chart-label', '#755A63');
  var tooltipBg = token('--chart-tooltip-bg', '#FFFFFF');
  var pageBorder = token('--page-border', '#E8DAE0');

  var CATEGORIES = [
    { name: '餐饮', color: chartSeries1 },
    { name: '交通', color: chartSeries2 },
    { name: '景点门票', color: chartSeries3 },
    { name: '购物杂项', color: chartSeries4 },
    { name: '机动缓冲', color: chartOther }
  ];

  function renderDonut(elId, config) {
    var el = document.getElementById(elId);
    if (!el) return;
    if (typeof echarts === 'undefined') {
      el.innerHTML = '<p class="chart-empty">图表库未加载，请查看下方明细表。</p>';
      return;
    }

    var chart = echarts.init(el, null, { renderer: 'svg' });
    var values = config.values;

    chart.setOption({
      animation: false,
      color: CATEGORIES.map(function (c) { return c.color; }),
      tooltip: {
        trigger: 'item',
        appendToBody: true,
        backgroundColor: tooltipBg,
        borderColor: pageBorder,
        borderWidth: 1,
        padding: [8, 12],
        textStyle: { color: inkColor, fontSize: 12 },
        formatter: function (p) {
          return config.title + '<br/>' + p.marker + ' ' + p.name +
            '：' + config.unit + ' ' + p.value + '（' + p.percent + '%）';
        }
      },
      legend: {
        bottom: 0,
        icon: 'circle',
        itemWidth: 10,
        itemHeight: 10,
        itemGap: 12,
        textStyle: { color: labelColor, fontSize: 12 },
        formatter: function (name) {
          var index = -1;
          for (var i = 0; i < CATEGORIES.length; i++) {
            if (CATEGORIES[i].name === name) { index = i; break; }
          }
          return name + '  ' + config.unit + values[index];
        }
      },
      title: {
        text: config.total,
        subtext: config.title,
        left: 'center',
        top: '33%',
        itemGap: 2,
        textStyle: { color: inkColor, fontSize: 22, fontWeight: 700 },
        subtextStyle: { color: labelColor, fontSize: 12 }
      },
      series: [{
        type: 'pie',
        radius: ['46%', '66%'],
        center: ['50%', '42%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderColor: tooltipBg,
          borderWidth: 2,
          borderRadius: 4
        },
        label: { show: false },
        labelLine: { show: false },
        emphasis: { scale: false },
        data: CATEGORIES.map(function (c, i) {
          return {
            name: c.name,
            value: values[i],
            itemStyle: { color: c.color }
          };
        })
      }]
    });

    window.addEventListener('resize', function () {
      chart.resize();
    });
  }

  renderDonut('chart-sg', {
    title: '新加坡段',
    total: 'S$450',
    unit: 'S$',
    values: [130, 90, 118, 72, 40]
  });

  renderDonut('chart-kl', {
    title: '吉隆坡段',
    total: 'RM545',
    unit: 'RM',
    values: [120, 230, 40, 110, 45]
  });
})();
