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
      selected.style.backgroundColor = "";
      selected.style.border = "";
    }
    selected = this;
    this.style.backgroundColor = "#EEE";
    this.style.border = "1px solid black";

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
  $.get("/events?date="+datestr, handleResults);
  function handleResults(result) {
    console.log('Events for ' + result.date + ':\n' + JSON.stringify(result.events));

  };
}
