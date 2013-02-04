var split_mode = true;
var edit_mode = true;
var auto_refresh = true;
var font_size = '14px';


function _initialize() {
    load_settings();

    editor.on("change", function () {
        if (split_mode && auto_refresh) {
            refresh();
        }
    });

    $(window).resize(function() {
        $('#ipreview, #editor').css('height', ($(window).height() - 180) +'px');
        editor.resize();
    });
    $('#ipreview, #editor').css('height', ($(window).height() - 180) +'px');

    $('#settings').on('show', function () {
        $('input[name=auto-refresh]').attr('checked', auto_refresh);
        $('select[name=font-size]').val(font_size);
        $('input[name=view-mode][value=split]').attr('checked', split_mode);
        $('input[name=view-mode][value=tabbed]').attr('checked', !split_mode);
    });

    $('#settings').on('hide', function () {
        auto_refresh = $('input[name=auto-refresh]').attr('checked') == 'checked';
        font_size = $('select[name=font-size]').val();
        split_mode = $('input[name=view-mode][value=split]').attr('checked') == 'checked';
        save_settings();
        _update_ui();
    });

    $('#resize-btn').click(toggle_mode);
    $('#mode-btn').click(toggle_preview);
    $('#clear-btn').click(clear);

    _update_ui();
}

function refresh() {
    var content = editor.getValue();
    var iframe = document.getElementById('ipreview');

    var doc = iframe.document;
    if(iframe.contentDocument)
        doc = iframe.contentDocument; // For NS6
    else if(iframe.contentWindow)
        doc = iframe.contentWindow.document; // For IE5.5 and IE6
    // Put the content in the iframe
    doc.open();
    doc.writeln(content);
    doc.close();
    return false;
}

function toggle_auto_refresh() {
    auto_refresh = !auto_refresh;
    _update_ui();
    return false;
}

function toggle_mode() {
    split_mode = !split_mode;
    _update_ui();
    return false;
}

function toggle_preview() {
    edit_mode = !edit_mode;
    _update_ui()
    return false;
}

function _load_setting(key, default_value) {
    var value = localStorage.getItem(key);
    if (value == null) {
        value = default_value;
    } else {
        value = JSON.parse(value);
    }
    return value;
}

function clear() {
    editor.setValue('');
    refresh();
    _update_ui();
    return false;
}

function _save_setting(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function load_settings() {
    split_mode = _load_setting('split_mode', true);
    auto_refresh = _load_setting('auto_refresh', true);
    font_size = _load_setting('font_size', '14px');
}

function save_settings() {
    _save_setting('split_mode', split_mode);
    _save_setting('auto_refresh', auto_refresh);
    _save_setting('font_size', font_size);
}

function _update_ui() {
    var editor_width = split_mode ? '455px' : '940px';
    var container_class = split_mode ? 'span6' : 'span12';
    var resize_icon = split_mode ? 'icon-resize-full' : 'icon-resize-small';
    var mode_icon = edit_mode ? 'icon-eye-open' : 'icon-edit';
    var editor_container = $('#editor').parent();
    var preview_container = $('#ipreview').parent();

    $('#editor').css('width', editor_width);
    $('#editor').css('font-size', font_size);
    editor.resize();

    preview_container.toggle(!edit_mode || split_mode);
    editor_container.toggle(edit_mode || split_mode);
    $('.full-mode-only').toggle(!split_mode);

    editor_container.removeClass();
    preview_container.removeClass();

    editor_container.toggleClass(container_class, split_mode || edit_mode);
    preview_container.toggleClass(container_class, split_mode || !edit_mode);

    $('#resize-btn i').removeClass();
    $('#resize-btn i').addClass(resize_icon);

    $('#mode-btn i').removeClass()
    $('#mode-btn i').addClass(mode_icon);
    $('#refresh-btn').toggle((split_mode || !edit_mode) && !auto_refresh);

    if (split_mode || edit_mode){
        editor.focus();
    } else {
        refresh();
        $('#ipreview').focus();
    }
}