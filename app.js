/* eslint-disable */
(function($) {

  $.widget('pi.timeline', {
    options: {
      maxHeight: 1000,
      space: 30,
      data: []
    },
    _create: function () {
      // Store sorted options as local variables (less typing).
      var maxHeight = this.options.maxHeight;
      var space = this.options.space;
      var data = this.options.data;
      // Empty element wrapper.
      this.element.empty();
      // Check data length.
      if (data.length === 0) {
        return;
      }
      // Calculate total height of timeline.
      var height = Math.min((data.length - 1) * space, maxHeight);

      var markerSpacing = Math.min(space, Math.round(maxHeight / (data.length - 1)));

      // Add vertical line.
      this.element.append($('<div />').addClass('tl-line').css('height', height));
      var datePoint = function (space, date) {
        // Initialize template.
        var template = $('<div />').css('top', space);
        // Create timeline block (marker) from template.
        var block = template.clone().addClass('tl-block');
        // Create date label from template.
        var label = template.clone().addClass('tl-date-label').css('line-height', markerSpacing / 2 + 'px').text($.datepicker.formatDate("d. MM y", date));
        return [block, label];
      };

      // Draw date markers.
      for (i = 0; i < data.length; i++) {
        this.element.append(datePoint(markerSpacing * i, data[i].date));
      }
    }
  });

  function initSlDatepicker() {
    $.datepicker.regional['sl'] = {
      closeText: 'Zapri',
      prevText: '&#x3C;Prejšnji',
      nextText: 'Naslednji&#x3E;',
      currentText: 'Trenutni',
      monthNames: ['Januar', 'Februar', 'Marec', 'April', 'Maj', 'Junij', 'Julij', 'Avgust', 'September', 'Oktober', 'November', 'December'],
      monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Avg', 'Sep', 'Okt', 'Nov', 'Dec'],
      dayNames: ['Nedelja', 'Ponedeljek', 'Torek', 'Sreda', 'Četrtek', 'Petek', 'Sobota'],
      dayNamesShort: ['Ned', 'Pon', 'Tor', 'Sre', 'Čet', 'Pet', 'Sob'],
      dayNamesMin: ['Ne', 'Po', 'To', 'Sr', 'Če', 'Pe', 'So'],
      weekHeader: 'Teden',
      dateFormat: 'dd.mm.yy',
      firstDay: 1,
      isRTL: false,
      showMonthAfterYear: false,
      yearSuffix: ''
    };
    $.datepicker.setDefaults($.datepicker.regional['sl']);
  }

  function loadTimeline() {
    $.getJSON('./data.json', function (data) {
      for (var i = 0; i < data.length; i++) {
        data[i].date = new Date(data[i].date);
      }
      $('.timeline').timeline({ data: data });
    });
  }

  $(function () {
    initSlDatepicker();
    loadTimeline();
  });

})(jQuery);

// -----------------------

(function test($) {

  var N = 1;

  function _generateData(n) {
    n = n || 20;
    var d = new Date('8/31/15');
    return Array.apply(null, {
      length: n
    }).map(function (_i, i) {
      return {
        date: new Date(d.getTime() + 604800000 * (i + 1))
      };
    });
  }

  function addNext() {
    $('.timeline').remove();
    $('body').append($('<div />').addClass('timeline'));
    $('.timeline').timeline({
      data: _generateData(N++)
    });
  }

  $(function () {
    $('#next').click(addNext);
    $('#next10').click(function () {
      Array.apply(null, {
        length: 10
      }).forEach(addNext);
    });
  });
})(jQuery);
