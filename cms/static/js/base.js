require(["domReady", "jquery", "underscore", "gettext", "js/views/feedback_notification", "js/views/feedback_prompt",
    "js/utils/get_date", "js/utils/module", "js/utils/handle_iframe_binding", "js/utils/change_on_enter", "jquery.ui",
    "jquery.leanModal", "jquery.form", "jquery.smoothScroll"],
    function(domReady, $, _, gettext, NotificationView, PromptView, DateUtils, ModuleUtils, IframeUtils, TriggerChangeEventOnEnter)
{

var $body;

domReady(function() {
    $body = $('body');

    $body.on('click', '.embeddable-xml-input', function() {
        $(this).select();
    });

    $body.addClass('js');

    $('.unit .item-actions .delete-unit-button').bind('click', deleteUnit);
    $('.new-unit-item').bind('click', createNewUnit);

    // lean/simple modal
    $('a[rel*=modal]').leanModal({
        overlay: 0.80,
        closeButton: '.action-modal-close'
    });
    $('a.action-modal-close').click(function(e) {
        (e).preventDefault();
    });

    // alerts/notifications - manual close
    $('.action-alert-close, .alert.has-actions .nav-actions a').bind('click', hideAlert);
    $('.action-notification-close').bind('click', hideNotification);

    // nav - dropdown related
    $body.click(function(e) {
        $('.nav-dd .nav-item .wrapper-nav-sub').removeClass('is-shown');
        $('.nav-dd .nav-item .title').removeClass('is-selected');
    });

    $('.nav-dd .nav-item').click(function(e) {

        $subnav = $(this).find('.wrapper-nav-sub');
        $title = $(this).find('.title');

        if ($subnav.hasClass('is-shown')) {
            $subnav.removeClass('is-shown');
            $title.removeClass('is-selected');
        } else {
            $('.nav-dd .nav-item .title').removeClass('is-selected');
            $('.nav-dd .nav-item .wrapper-nav-sub').removeClass('is-shown');
            $title.addClass('is-selected');
            $subnav.addClass('is-shown');
            // if propagation is not stopped, the event will bubble up to the
            // body element, which will close the dropdown.
            e.stopPropagation();
        }
    });

    // general link management - new window/tab
    $('a[rel="external"]').attr('title', gettext('This link will open in a new browser window/tab')).attr('target', '_blank');

    // general link management - lean modal window
    $('a[rel="modal"]').attr('title', gettext('This link will open in a modal window')).leanModal({
        overlay: 0.50,
        closeButton: '.action-modal-close'
    });
    $('.action-modal-close').click(function(e) {
        (e).preventDefault();
    });

    // general link management - smooth scrolling page links
    $('a[rel*="view"][href^="#"]').bind('click', smoothScrollLink);

    // tender feedback window scrolling
    $('a.show-tender').bind('click', smoothScrollTop);

    IframeUtils.iframeBinding();
});

function smoothScrollLink(e) {
    (e).preventDefault();

    $.smoothScroll({
        offset: -200,
        easing: 'swing',
        speed: 1000,
        scrollElement: null,
        scrollTarget: $(this).attr('href')
    });
}

function smoothScrollTop(e) {
    (e).preventDefault();

    $.smoothScroll({
        offset: -200,
        easing: 'swing',
        speed: 1000,
        scrollElement: null,
        scrollTarget: $('#view-top')
    });
}

function createNewUnit(e) {
    e.preventDefault();

    var parent = $(this).data('parent');
    var category = $(this).data('category');

    analytics.track('Created a Unit', {
        'course': course_location_analytics,
        'parent_locator': parent
    });


    $.postJSON(ModuleUtils.getUpdateUrl(), {
        'parent_locator': parent,
        'category': category,
        'display_name': 'New Unit'
    },

    function(data) {
        // redirect to the edit page
        window.location = "/container/" + data['locator'];
    });
}

function deleteUnit(e) {
    e.preventDefault();
    _deleteItem($(this).parents('li.courseware-unit'), 'Unit');
}

function _deleteItem($el, type) {
    var confirm = new PromptView.Warning({
        title: gettext('Delete this ' + type + '?'),
        message: gettext('Deleting this ' + type + ' is permanent and cannot be undone.'),
        actions: {
            primary: {
                text: gettext('Yes, delete this ' + type),
                click: function(view) {
                    view.hide();

                    var locator = $el.data('locator');

                    analytics.track('Deleted an Item', {
                        'course': course_location_analytics,
                        'id': locator
                    });

                    var deleting = new NotificationView.Mini({
                        title: gettext('Deleting&hellip;')
                    });
                    deleting.show();

                    $.ajax({
                        type: 'DELETE',
                        url: ModuleUtils.getUpdateUrl(locator),
                        success: function () {
                            $el.remove();
                            deleting.hide();
                        }
                    });
                }
            },
            secondary: {
                text: gettext('Cancel'),
                click: function(view) {
                    view.hide();
                }
            }
        }
    });
    confirm.show();
}

function hideNotification(e) {
    (e).preventDefault();
    $(this).closest('.wrapper-notification').removeClass('is-shown').addClass('is-hiding').attr('aria-hidden', 'true');
}

function hideAlert(e) {
    (e).preventDefault();
    $(this).closest('.wrapper-alert').removeClass('is-shown');
}

}); // end require()
