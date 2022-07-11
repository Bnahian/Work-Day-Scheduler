//Global array variale to store localstorage data
var schedule=[];

//Audit all schedules
var auditSchedule = function(rowEl) {
    // get time from schedule element
    var scheduletime = $(rowEl).attr("id");
    var past = moment(scheduletime ,"hha");
    var t = past.format('LTS');
    
    // get current time
    var prtime = moment().format('LTS');
    var textEl = $(rowEl).find("textarea");

    var a = moment(t,'hh:mm:ss a');
    var b = moment(prtime, 'hh:mm:ss a');
    if(a.isAfter(b,'hours'))
    {
        $(textEl).addClass("future"); 
    }
    else if(a.isBefore(b,'hours')){
        $(textEl).addClass("past");
    }
    else if(a.isSame(b,'hours')){
        $(textEl).addClass("present");  
    }    
  };

//Load all schedules from localstorage
var loadSchedule = function(){
    var getSchedule = localStorage.getItem("schedule");
    
    if (getSchedule!== null)
    {
        getSchedule = JSON.parse(getSchedule);
        for(var i=0;i<getSchedule.length;i++)
        {
            schedule[i]=getSchedule[i];
            var splitstr=schedule[i].split("-");
            $('#'+splitstr[0]).find("textarea").text(splitstr[1]);
        }
        
    }
    $(".row").each(function(index, el) {
        auditSchedule(el);
    });
};

//Get the text and parent id on click of Save button
$(".row").on("click", "button", function() {
    var flag = false;
    var scheduleNew = [];
    var activityText = $(this).prev().val().trim();
   
    var parentrowId = $(this).closest(".row").attr("id");
    //Edit schedule logic
    var getSchedule = localStorage.getItem("schedule");
    
    if (getSchedule!== null)
    {
        getSchedule = JSON.parse(getSchedule);
        for(var i=0;i<getSchedule.length;i++)
        {
            scheduleNew[i]=getSchedule[i];
            var splitstr=scheduleNew[i].split("-");
            if(splitstr[0] === parentrowId)
            {
                schedule.splice(i,1);
                flag = true;
                break;
            }
        }  
        if(flag===true)
        {
            localStorage.clear();
            localStorage.setItem("schedule",JSON.stringify(schedule));
        }      
          
    }

    var localstr = parentrowId+"-"+activityText;
    schedule.push(localstr);
    localStorage.setItem("schedule",JSON.stringify(schedule));   
     
 });

//Set current date using momentjs
var todayDate = moment().format("dddd,  MMMM Do");
$("#currentDay").text(todayDate);

//load schedule on page load
loadSchedule();

//Audit schedule in every 15 mins
setInterval(function () {
    $(".row").each(function(index, el) {
      auditSchedule(el);
      window.location.reload();
    });
  }, 900000);