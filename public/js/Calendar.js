function Calendar(container) {
  this.container = document.getElementById(container);
  this.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  this.days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
};


Calendar.prototype.render = function(date) {
  clearContentsOfContainer(this.container);

  this.container.className = "calendar";
  this.date = new Date(date.getFullYear(), date.getMonth());

  var table = this.container.appendChild(document.createElement("table"));
  this.createMainHeader(table);
  this.createSubHeader(table);
  this.createCalendar(table);

  addThisMonthListeners();
  addNavigatorListeners();
  colorCalendar();
};


function clearContentsOfContainer(elem) {
  while (elem.hasChildNodes()) {
    elem.removeChild(elem.lastChild);
  }
};


Calendar.prototype.createMainHeader = function(table) {
  var row = table.appendChild(document.createElement("tr"));
  row.className = "mainHeader";
  var obj = this;

  var left = row.appendChild(document.createElement("td"));
  var middle = row.appendChild(document.createElement("td"));
  var right = row.appendChild(document.createElement("td"));

  var leftArrow = document.createElement("a");
  leftArrow.setAttribute("href", "javascript: void(0);");
  leftArrow.appendChild(document.createTextNode("<"));
  leftArrow.onclick = function() {
    obj.render(new Date(obj.date.getFullYear(), obj.date.getMonth()-1));
  };
  left.appendChild(leftArrow);
  left.className = "navigator";

  middle.setAttribute("colspan", 5);
  middle.setAttribute("id", "monthyear");
  var title = this.months[this.date.getMonth()] + " " + this.date.getFullYear();
  middle.appendChild(document.createTextNode(title));

  var rightArrow = document.createElement("a");
  rightArrow.setAttribute("href", "javascript: void(0);");
  rightArrow.appendChild(document.createTextNode(">"));
  rightArrow.onclick = function() {
    obj.render(new Date(obj.date.getFullYear(), obj.date.getMonth()+1));
  };
  right.appendChild(rightArrow);
  right.className = "navigator";
};


Calendar.prototype.createSubHeader = function(table) {
  var row = table.appendChild(document.createElement("tr"));
  row.className = "subHeader";

  for (var i = 0; i < this.days.length; i++) {
    var td = row.appendChild(document.createElement("td"));
    td.appendChild(document.createTextNode(this.days[i]));
  }
};


Calendar.prototype.createCalendar = function(table) {
  var month = this.date.getMonth();
  var date = new Date(this.date);
  date.setDate(date.getDate() - date.getDay());

  do {
    var tr = table.appendChild(document.createElement("tr"));
    for (var i = 0; i < 7; i++) {
      var td = tr.appendChild(document.createElement("td"));
      td.appendChild(document.createTextNode(date.getDate()));
      if (date.getMonth() === month) {
        td.className = "thisMonth";
      } else {
        td.className = "otherMonth";
      }
      date.setDate(date.getDate() + 1);
    }
  } while (date.getMonth() === month)
};

var selected;
function addThisMonthListeners() {
  $('.calendar td.thisMonth').click(function(e) {
    if (selected !== undefined) {
      //selected.style.backgroundColor = "";
      selected.style.border = "";
      selected.style.fontWeight = "";
    }
    selected = this;
    //this.style.backgroundColor = "#EEE";
    this.style.border = "2px solid black";
    this.style.fontWeight = "bold";

    var day = this.innerText;
    var monthyear = $("#monthyear")[0].innerText;
    var datearr = monthyear.split(' ');
    datearr.splice(1,0,day);
    createListOfEventsForDay(datearr.join(' '));
    $('#dayview').show();
  });
}

function addNavigatorListeners() {
  $('.calendar td.navigator a').click(function(e) {
    $('#dayview').hide();
  });
}

function createListOfEventsForDay(datestr) {
  var table = $('.listview table')[0];
  clearContentsOfContainer(table);
  $.get("/events?date="+datestr, handleResults);
  function handleResults(result) {
    //console.log('Events for ' + result.date + ':\n' + JSON.stringify(result.events));
    if (result.events.length === 0) {
      var cell = table.appendChild(document.createElement("tr")).appendChild(document.createElement("td"));
      cell.className = "listview-elem";
      cell.appendChild(document.createTextNode("No events listed for " + datestr));
    } else {
      for (var i = 0; i < result.events.length; i++) {
        addEventToTable(result.events[i]);
      }
    }
  };
  function addEventToTable(event) {
    var cell = table.appendChild(document.createElement("tr")).appendChild(document.createElement("td")).appendChild(document.createElement("a"));
    cell.href = "/editevent?id="+event._id;
    cell.className = "btn btn-default btn-lg btn-block active";
    cell.id = "event";
    var text = document.createTextNode(event.description);
    cell.appendChild(text);
    // var element = document.createElement("td");
    // element.className = "listview-elem";
    // var cell = document.createElement("a");
    // cell.href = "/editevent";
    // var text = document.createTextNode(event.description);
    // cell.appendChild(text);
    // element.appendChild(cell);
    // row.appendChild(element);
  };
}

function colorCalendar() {
  var monthyear = $("#monthyear")[0].innerText;
  var monoParam = monochromatic ? 'monochromatic='+monochromatic : '';
  $.get('/colors/?monthyear='+monthyear+'&'+monoParam, function(result) {
    //apply colors to calendar
    var boxes = $('td.thisMonth');
    for (var i = 0; i < boxes.length; i++) {
      var box = boxes[i];
      box.style.backgroundColor = result.data[parseInt(box.innerText)-1].color;
    }
  });
}
