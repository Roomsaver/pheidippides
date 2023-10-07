function exportToHTML(button)
{
    
    var table = button.previousElementSibling.previousElementSibling.previousElementSibling;
    var divTable = document.createElement('div');
    divTable.append(table);
    

    var blob = new Blob([divTable.innerHTML], {type: "text/html;charset=utf-8"});
    saveAs(blob, `${new Date().toLocaleDateString()}_table_export.html`);
}

function exportToPDF(button)
{
    var table = button.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling;
    // var divTable = document.createElement('div');
    // divTable.append(table);

    var save = html2pdf().from(table).save();
}

function exportToCSV(button, separator = ',')
{
    var table = button.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling;
    // Select rows from table_id
    // console.log(table.childNodes);
    var rows = table.childNodes;
    var csv = '';

    for(var i = 0;i < rows.length - 1;i++)
    {
        for(var j = 1;j<rows[i].childNodes.length;j++)
        {
            if(i == 0)
            {
                if(j == 1)
                {
                    csv += `${rows[i].childNodes[j].innerHTML}`;
                }
                else
                {
                    csv += `,${rows[i].childNodes[j].innerHTML}`;
                }
            }
            else
            {
                if(j == 1)
                {
                    csv += `${rows[i].childNodes[j].childNodes[0].value}`;
                }
                else
                {
                    csv += `,${rows[i].childNodes[j].childNodes[0].value}`;
                }
            }
            
        }
        csv += `\n`;
    }
    // console.log(csv);
    var blob = new Blob([csv], {type: "text/csv;charset=utf-8"});
    saveAs(blob, `${new Date().toLocaleDateString()}_table_export.csv`);
}

function getRow(cell)
{
    return cell.parentElement.parentElement
}



function addRow()
{
    var table = $('#data')[0];
    var rows = table.childNodes;
    var newRow = $('<tr>');
    for(var i = 0;i < rows[rows.length - 1].childNodes.length;i++)
    {
        var td = $('<td>');
        if(i == 0)
        {
            var deleteButton = $('<button>');
            deleteButton.text('Del');
            deleteButton.attr('onclick','delRow(this)')
            td.append(deleteButton);
            var editButton = $('<button>');
            editButton.text('Edit');
            editButton.attr('onclick','editRow(this)')
            td.append(editButton);
        }
        else
        {
            var input = $('<input>');
            input.attr('value',rows[rows.length - 1].childNodes[i].childNodes[0].value);
            input.attr('disabled','disabled');
            (document.getElementById('data').childNodes[document.getElementById('data').childNodes.length - 1].childNodes[i].childNodes[0]).setAttribute('innerHTML','');
            td.append(input);
        }
        newRow.append(td);
    }
    newRow.insertBefore(rows[rows.length - 1]);
}

function editRow(cell)
{
    for(var i = 0;i < getRow(cell).childNodes.length; i++)
    {
        getRow(cell).childNodes[i].childNodes[0].removeAttribute('disabled');
    }
}

function saveTable()
{
    var table = $('table')[0].childNodes;
    for(var i = 1;i<table.length;i++)
    {
        if(i != table.length-1)
        {
            for(var j = 1;j<table[i].childNodes.length;j++)
            {
                table[i].childNodes[j].childNodes[0].setAttribute('disabled','true');
            }
        }
    }
}

function delRow(cell)
{
    getRow(cell).setAttribute('style', 'display:none');
}

function cancel()
{
    var table = $('table')[0].childNodes;
    for(var i = 0;i<table.length;i++)
    {
        if(table[i].style.display == 'none')
        {
            table[i].style.display = 'table-row';
        }
    }
    
}



//Create table function to generate table from JSON data

function createTable(jsondata = {}, report = false, appendEl = $('body')) 
{

    var table = $('<table>');
    table.attr('id', 'data');
    var maxCharCount = 256;
    if(jsondata.data != undefined && jsondata.data != null && jsondata.data.length > 0 )
    {
        for(var i = 0;i<jsondata.data.length;i++)
        {
            
            //Generate table header
            if(i == 0)
            {
                var row = $('<tr>').addClass(i);
                if(!report)
                {
                    var columnShim = $('<th>');
                    row.append(columnShim);
                }                
                for(var j = 0;j<Object.keys(jsondata.data[i]).length;j++)
                {
                    if(Object.keys(jsondata.data[i])[j].length<maxCharCount)
                    {
                        var column = $('<th>').text(Object.keys(jsondata.data[i])[j]);
                    }
                    else
                    {
                        var column = $('<th>').text((Object.keys(jsondata.data[i])[j]).slice(0,256));
                    }
                    
                    row.append(column);
                }
                table.append(row);
            }
            //Generate table rows with data
            var row = $('<tr>').addClass(i);
            if(!report)
            {
                var columnShim = $('<td>');
                var delButton = $('<button>').text('Del').attr('onclick',`delRow(this)`);
                var editButton = $('<button>').text('Edit').attr('onclick',`editRow(this)`);
                columnShim.append(delButton);
                columnShim.append(editButton);
                row.append(columnShim);
            }
            for(var j = 0;j<Object.values(jsondata.data[i]).length;j++)
            {
                if(Object.values(jsondata.data[i])[j]<maxCharCount)
                {
                    var column = $('<td>');
                    var input = $('<input>').attr('value',Object.values(jsondata.data[i])[j]);
                    input.attr('disabled','true');
                    column.append(input);
                }
                else
                {
                    var column = $('<td>');
                    var input = $('<input>').attr('value',(Object.values(jsondata.data[i])[j]).slice(0,256));
                    input.attr('disabled','true');
                    column.append(input);
                }
                row.append(column);
            }
            table.append(row);
        }
        if(!report)
        {
            var row = $('<tr>')
            
                var columnShim = $('<td>');
                var addButton = $('<button>').text('Add').attr('onclick','addRow()');
                columnShim.append(addButton);
                row.append(columnShim);
            
            for(var i = 0;i<Object.keys(jsondata.data[0]).length;i++)
            {
                var column = $('<td>');
                var input = $('<input>');
                column.append(input);
                row.append(column);
            }
            table.append(row);
        }

        appendEl.append(table);
        if(!report)
        {
            appendEl.append($('<button>').text('Save').attr('onclick','saveTable()'));
            appendEl.append($('<button>').text('Cancel').attr('onclick','cancel()'));
            appendEl.append($('<button>').text('Export to HTML').attr('onclick','exportToHTML(this)'));
            appendEl.append($('<button>').text('Export to PDF').attr('onclick','exportToPDF(this)'));
            appendEl.append($('<button>').text('Export to CSV').attr('onclick','exportToCSV(this)'));
        }
    }
    else 
    {
        var errorBlock = $('<div>');
        var errorMessage = $('<p>').text('Table is empty');
        errorBlock.append(errorMessage);
        appendEl.append(errorBlock);
    }
    
}