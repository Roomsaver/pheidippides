/**
 * 
 * @param {String} id 
 * @param {String} _class 
 * @param {Element} appendElement 
 */
function createPopup(id, _class, appendElement = $('body'))
{
    var popup = $('<div>');
    popup.attr('id', id);
    popup.attr('class', _class);
    popup.attr('style','display:none;');
    popup.attr('onclick','this.style="display:none;"')
    appendElement.append(popup);
}