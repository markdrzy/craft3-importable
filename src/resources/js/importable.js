(function (window) {

  if (!window.Craft || !window.jQuery) {
    return false;
  }

  Craft.importablePlugin = {
    settings: {
      importButtonSelector: 'importable-hudbutton',
    },
    init: function(data) {
      var self = this;
      this.data = data;

      // Event Handlers
      Garnish.$doc
        .on('click', '.' + this.settings.importButtonSelector, this.onImportButtonClick.bind(this))
        .on('click', '.importable-hud .option-title', this.onOptionTitleClick.bind(this));

      this.render();
    },
    onImportButtonClick: function(e) {
      e.preventDefault();
      var table = $(e.target).siblings('table.editable');
      var hud = new Garnish.HUD(e.target, this.templates.importHud, {
        closeBtn: '.cancel',
        hudClass: 'hud importable-hud',
        onShow: function(hud) { $('textarea#importable-data', hud.target.$main).focus(); },
        onSubmit: this.parseInput.bind(this)
      });
    },
    onOptionTitleClick: function(e) {
      e.preventDefault();
      var optionWrap = $(e.target).closest('.option-wrap');
      var toggleIcon = $('a.toggle', optionWrap);
      var state = optionWrap.attr('data-state');
      optionWrap.attr('data-state', (state == 'collapsed')? 'expanded': 'collapsed');
      (state == 'collapsed')? toggleIcon.addClass('expanded'): toggleIcon.removeClass('expanded');
    },
    parseInput: function(hud) {
      var self = this;
      var table = hud.target.$trigger.siblings('table.editable');
      var columnCount = $('thead tr:first-child th', table).length - 1;
      var data = $('#importable-data', hud.target.$hud).val();
      var options = {
        delimiter: $('[name="importable[options][delimiter]"]', hud.target.$hud).val(),
        quoteChar: $('[name="importable[options][quote]"]', hud.target.$hud).val()
      }
      var parsedData = Papa.parse(data, options);
      var checkData = self.checkData(parsedData, columnCount);

      if ( checkData.valid || confirm(checkData.message) ) {
        self.populateTable(table, parsedData.data);
        hud.target.$hud.hide();
      }
    },
    checkData: function(data, columnCount) {
      var over = 0;
      var under = 0;
      var errors = [];
      for (var i = 0; i < data.data.length; i++) {
        if (data.data[i].length < columnCount) under++;
        if (data.data[i].length > columnCount) over++;
      }
      var valid = over == 0 && under == 0;

      if (over > 0) {
        errors.push(over + ' row' + (over > 1? 's have': ' has') + ' more columns than this table contains');
      }
      if (under > 0) {
        errors.push(under + ' row' + (under > 1? 's have': ' has') + ' fewer columns than this table contains');
      }

      var message = (valid)?
        'The data appears to be valid.':
        'The provided data contains the following error' + (errors.length > 1? 's': '') + ':' +
          '\n\n\t- ' + errors.join('\n\n\t- ') + '\n\n' +
          ((over > 0)? 'If the import proceeds, data may be truncated. ': '') +
          'Click OK to proceed with the import.';

      return {
        valid: valid,
        invalid: ! valid,
        message: message
      };
    },
    populateTable: function(table, data) {
      var self = this;
      var addRowButton = table.siblings('.btn.add');
      for (var i = 0; i < data.length; i++) {
        addRowButton.click();
        $.each(data[i],function(c, val){
          var cell = $('tbody tr:last-child td:eq('+c+')', table);

          if ( cell.is('.textual') ) {
            $('textarea', cell).val(val);
          } else {
            // Placeholder for non-text fields (v2)
          }


        });
      }
    },
    addImportButtons: function() {
      var self = this;
      var main = $('#main');
      var tableFields = main.find('.field[data-type="craft\\\\fields\\\\Table"]:not([data-importable]), .field[data-type="supercool\\\\tablemaker\\\\fields\\\\TableMakerField"] #fields-tiers-rows-field:not([data-importable])');

      tableFields.each(function() {
        $('.input', this).append('<div class="btn icon ' + self.settings.importButtonSelector + ' right" data-icon="list">Import</div>');
        $(this).attr('data-importable','active');
      });
    },
    render: function() {
      this.addImportButtons();
    },
    templates: {
      importHud: function() {
        return '' +
          '<div class="field" data-type="craft\\fields\\PlainText">' +
            '<div class="heading">' +
              '<label for="importable-data" class="required">CSV Data</label>' +
              '<p class="instructions">Paste the data you\'d like to import into the field below.</p>' +
            '</div>' +
            '<textarea class="text nicetext fullwidth" rows="4" cols="50" id="importable-data" name="importable[data]" data-show-chars-left="" placeholder="" style="min-height: 90px;" autofocus></textarea>' +
          '</div>' +
          '<div class="option-wrap" data-state="collapsed">' +
            '<div class="option-title light">Options <a href="#" class="toggle light"></a></div>' +
            '<div class="options">' +
              '<div class="flex">' +
                '<div class="flex-grow">' +
                  '<div class="field" data-type="craft\\fields\\PlainText">' +
                    '<div class="heading">' +
                      '<label for="importable-options-delimiter" class="required">Delimiter</label>' +
                    '</div>' +
                    '<input id="importable-options-delimiter" name="importable[options][delimiter]" value="," data-show-chars-left="" autocomplete="off" placeholder="" class="text nicetext fullwidth" type="text">' +
                  '</div>' +
                '</div>' +
                '<div class="flex-grow">' +
                  '<div class="field" data-type="craft\\fields\\PlainText">' +
                    '<div class="heading">' +
                      '<label for="importable-options-quote" class="required">Quote Character</label>' +
                    '</div>' +
                    '<input id="importable-options-quote" name="importable[options][quote]" value=\'"\' data-show-chars-left="" autocomplete="off" placeholder="" class="text nicetext fullwidth" type="text">' +
                  '</div>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="hud-footer">' +
            '<div class="buttons right">' +
              '<div class="btn cancel" tabindex="0">Cancel</div>' +
              '<input type="submit" value="Import" class="btn submit">' +
            '</div>' +
          '</div>';
      }
    }
  };

} (window));
