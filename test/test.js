function saveForm(beforeEdit = {})
{
    var inputs = {};
    var j = 0;
    for(var i = 0;i<$('#form').children().length;i++)
    {
        if($('#form').children()[i].tagName == "INPUT")
        {
            if($('#form').children()[i].type == 'radio' && $('#form').children()[i].checked)
            {
                inputs[j] = $('#form').children()[i].value;
                j++;
            }
            else if ($('#form').children()[i].type.split('&&')[0] == 'text')
            {
                inputs[j] = $('#form').children()[i].value;
                j++;
            }
            
        }
    }
    for(var i = 1;i<$('#data').children().length;i++)
    {
        var row = $('#data').children()[i];
        for(var j = 0;j<row.children.length;j++)
        {
            // var td = row.children[j];
            for(var k = 0;k<Object.keys(beforeEdit).length;k++)
            {
                if (row.children[j].children[0].value == beforeEdit[k])
                {
                    // for(var o = 0;o<)
                    // td.children[0].value == beforeEdit[k]
                    row.children[j].children[0].value = inputs[k];
                    console.log('yeah');
                    try{$('#form').remove();$('#buttons').remove()}finally{};
                }
            }
        }
    }
}

function editRow(row)
{
    var json = {};
    var header = $('#data').children()[0];
    try{$('#form').remove();$('#buttons').remove()}finally{}
    for(var i = 1;i<header.childNodes.length;i++)
    {
        if(i!=3)
        {
            json[header.childNodes[i].textContent] = 'text&&';
            json[header.childNodes[i].textContent] += row.childNodes[i].childNodes[0].value;
            json[header.childNodes[i].textContent] += `$$${row.childNodes[i].childNodes[0].value}`;
        }
        else
        {
            json[header.childNodes[i].textContent] = [];
            var array = [];
            for(var j = 1;j<$('#data').children().length - 1;j++)
            {
                if(row.childNodes[i].childNodes[0].value == $('#data').children()[j].childNodes[3].childNodes[0].value)
                {
                    array[j-1] = `${$('#data').children()[j].childNodes[3].childNodes[0].value}$$checked`;
                }
                else
                {
                    array[j-1] = $('#data').children()[j].childNodes[3].childNodes[0].value;
                }
                
            }
            json[header.childNodes[i].textContent] = array;
        }
    }
    
    createForm(json);
    var inputs = {};
    var j = 0;
    for(var i = 0;i<$('#form').children().length;i++)
    {
        if($('#form').children()[i].tagName == "INPUT")
        {
            if($('#form').children()[i].type == 'radio' && $('#form').children()[i].checked)
            {
                inputs[j] = $('#form').children()[i].value;
            }
            else if ($('#form').children()[i].type.split('&&')[0] == 'text')
            {
                inputs[j] = $('#form').children()[i].value;
            }
            j++;
        }
    }
    createButtonGroup({'Save':`saveForm(${JSON.stringify(inputs)})`,'Cancel':"try{$('#form').remove();$('#buttons').remove()}finally{}"},'buttons');
}


$( document ).ready(function() {
    console.log( "ready!" );
    createTable({"data": [{First:"Bob",Last:"Smith",Gender:"M"},{First:"Liz",Last:"Hope",Gender:"F"},{First:"Swag",Last:"Yeah",Gender:"O"}]});
    var rows = $('#data').children();
    for(var i = 1;i<rows.length-1;i++)
    {
        $(rows[i]).attr('onclick','editRow(this);');
    }
    
});