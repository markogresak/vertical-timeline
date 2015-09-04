/* eslint-disable */
(function($) {

  $.widget('pi.timeline', {
    options: {
      space: 30,
      data: []
    },
    _create: function () {
      // Store sorted options as local variables (less typing).
      var markerSpacing = this.options.space;
      var data = this.options.data;
      // Empty element wrapper.
      this.element.empty();
      // Check data length.
      if (data.length === 0) {
        return;
      }
      var template = function (space) {
        return $('<div />').css('top', space);
      }
      var labelLineHeight = function (markerSpacing) {
        return (markerSpacing / 2) + 'px'
      }
      /**
       * Generate date label and point on timeline.
       * @param  {number} space Padding between 2 date points.
       * @param  {Date} date    Date to be added.
       * @return {[Element]}    Array of [block, label] jQuery elements.
       */
      var datePoint = function (space, date) {
        // Initialize template.
        // Create timeline block (marker) from template.
        var block = template(space).addClass('tl-block');
        // Create date label from template.
        var label = template(space).addClass('tl-date-label').css('line-height', labelLineHeight(markerSpacing)).text($.datepicker.formatDate("DD, d.", date));
        return [block, label];
      };
      /**
       * Generate separator element.
       * @param  {number} space Padding between 2 date points.
       * @param  {number} month Index of month.
       * @return {Element}      Separator line element.
       */
      var separator = function (space, date) {
        var el = template(space).addClass('tl-separator').css('line-height', labelLineHeight(markerSpacing));
        return el.append($('<span style="" />').text($.datepicker.formatDate("MM yy", date)));
      };

      /**
       * Determine if second date is different month/year than first.
       * @param  {Date}  d1 First date to compare.
       * @param  {Date}  d2 Second date to compare.
       * @return {Boolean}  True if it is different month, false if they are the same.
       */
      var isDifferentMonth = function (d1, d2) {
        return !(d1.getMonth() === d2.getMonth() && d1.getYear() === d2.getYear());
      }

      // Draw date markers.
      var separatorCount = 0;
      for (var i = 0; i < data.length; i++) {
        var d = data[i].date;
        var space = markerSpacing * (i + separatorCount);
        // Check if month separator should be added.
        if (i > 0 && isDifferentMonth(d, data[i - 1].date)) {
          this.element.append(separator(space + (markerSpacing / 4), d));
          // Increase separatorCount and recalculate space for next element.
          separatorCount++;
          space = markerSpacing * (i + separatorCount);
        }
        this.element.append(datePoint(space, d));
      }
      // Calculate total height of timeline and add vertical line.
      this.element.append($('<div />').addClass('tl-line').css('height', ((data.length + separatorCount) - 1) * markerSpacing));
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
        data[i].date = new Date(data[i].departure_date); // departure_date is key from API
      }
      $('.timeline').timeline({ data: data });
    });
  }

  $(function () {
    initSlDatepicker();
    loadTimeline();
  });

})(jQuery);
