function makeListItems(listOfItems)
{
    
    for(item in listOfItems)
    {
        var listItem = $('<li>');
        listItem.text(listOfItems[item]);
        list.append(listItem);
    }
}
var list;
function createList(listArray, ordered = false, appendElement = $('body'))
{
    //Check if listArray passed is empty or not
    if(jQuery.isEmptyObject(listArray))
    {
        var error = $('<p>');
        error.text('List is blank');
        $('body').append(error);
    }
    //listArray is not empty
    else
    {
        if(Array.isArray(listArray))
        {
            var title = $('<h1>');
            title.text(listArray[0]);
            //if this should be an ordered list
            if(ordered)
            {
                list = $('<ol>');
            }
            // if this should be an unordered list
            else
            {
                list = $('<ul>');
            }
            listArray.splice(0,1);
            makeListItems(listArray);
            appendElement.append(title);
            appendElement.append(list);
        }

    }
}