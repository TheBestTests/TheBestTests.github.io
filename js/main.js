	
	var settingsA = {
		'mixQ' : true,
		'mixA' : true,
		'count' : 20,
		'start' : 0,
		'end' : 20
	}
	
	var settingsB = {
		'mixQ' : true,		
		'count' : 10,
		'start' : 0,
		'end' : 10
	}
	
	var questionsA;
	var questionsB;
    var answer;
	var idActiveQuestion = 0;	
	var startPanel = $("#start-panel");
	var rightAnswers = [];
	var userAnswers = [];
	var rightA = 0;
	var rightB = 0;
	var timeStart;	
	
	function enableFields()
	{
		var input = document.getElementById('name2'); 
		if(this.checked)
		{
			input.disabled = false; input.focus();
		}
		else
	   {
		   input.disabled = true;
		}
	}
	
	function startTest(settingsA, settingsB)
	{ 
		idActiveQuestion = 0;	
		rightA = 0;
		rightB = 0;
		
		questionsA = getQuestions(settingsA, data.A);
		questionsB = getQuestions(settingsB, data.B);
	
		$.each(questionsA, function(idA)
		{
			var k = questionsA[idA].k;
			rightAnswers[idA] = questionsA[idA]["a"+k];
			
			var answers = [];
			for(i=0; i<5; i++)
				answers[i] = questionsA[idA]["a"+(i+1)];
						
			var questionJSON = {
				"question" : questionsA[idA]["q"],
				"answers" : settingsA.mixA ? shuffle(answers) : answers,
				"answer" : questionsA[idA]["a"+k]
				}
				
			$("#questions").append(create_question(questionJSON, idA, 'A' + (idA+1)));
		});
		
		$.each(questionsB, function(idB){				
			rightAnswers[settingsA.count+idB] = questionsB[idB]["a"];
			
			var questionJSON = { 
			"question" : questionsB[idB]["q"],
			"answers" : [questionsB[idB]["a"]],
			"answer" : questionsB[idB]["a"]
			}					
				$("#questions").append(create_question(questionJSON, settingsA.count+idB, 'B' + (idB+1)));
			
			});
		answer = rightAnswers[0];
	}
	
	function create_question(questionJSON, question_id, type)
	{
			var question_div = $('<div/>', {
				class : "question",
				id: "question" + question_id
				});
			question_div.append("<div class='questionHead'>"+" <h3>"+type+". "+questionJSON.question+"</h3></div>");
			var answers_form = $('<form/>', {
				class : "answers",
				id : "answers"+question_id
				}).appendTo(question_div);
			var answers = questionJSON.answers;
			if(answers.length > 1)
			{
				$.each(answers, function(i)
				{
					var input = $('<input/>',{
						id: question_id.toString() + i,
						class:"radio",
						type:"radio",
						name:"question" + question_id,
						value: answers[i]
					}).appendTo(answers_form);
					var label = $('<label/>',{
						for: question_id.toString() + i,
						text: answers[i]
					}).appendTo(answers_form);
					answers_form.append("</br>");
				});
			}else{
				var input = $('<input/>',{
					class: "answer_field",
					id : "field"+question_id,
					type:"textbox",
					name:"question" + question_id,					
				}).appendTo(answers_form);
			}
			
					
		return question_div;
	}
		
	function shuffle(arr)
	{
		return arr.sort(function(){
			return Math.round(Math.random()) - 0.5;
			});
	}
			
	function getQuestions(settings, arr)
	{
		var result = settings.mixQ ? shuffle(arr) : arr;	
		if(settings.mixQ)			
			return result.slice(0, settings.count);
		else 
			return result.slice(settings.start,settings.end);	
	}
		
	function initSettingForm()
	{
		$('#allCountA').text(data.A.length);		
		$('#allCountB').text(data.B.length);
		$('#countA').val(settingsA.count);		
		$('#countB').val(settingsB.count);
		$('#startA').val(settingsA.start);		
		$('#startB').val(settingsB.start);		
		$('#endA').val(settingsA.end);		
		$('#endB').val(settingsB.end);
		$('#mixQB').prop('checked',settingsB.mixQ);
		$('#mixQA').prop('checked', settingsA.mixQ);
		$('#mixA').prop('checked', settingsA.mixA);
		$('#countA').prop({'min': 0, 'max': data.A.length});
		$('#countB').prop({'min': 0, 'max': data.B.length});
		$('#startA').prop({'min': 0, 'max': data.A.length});
	    $('#startB').prop({'min': 0, 'max': data.B.length});
		$('#startA').prop({'min': 0, 'max': data.A.length});
	    $('#startB').prop({'min': 0, 'max': data.B.length});
		$('#endA').prop({'min': 0, 'max': data.A.length});
	    $('#endB').prop({'min': 0, 'max': data.B.length});
	}		
		
	$(document).ready(function() {
				
      if (typeof(Storage) !== "undefined") {
		  
		  if(localStorage.settingsA)
			  settingsA = JSON.parse(localStorage.settingsA);
		  
		  if(localStorage.settingsB)
			  settingsB = JSON.parse(localStorage.settingsB);		  
		  
	  }
		initSettingForm();
	}); 
	$(document).on('click','#start',function() {

	  timeStart = new Date().getTime();
	  settingsA.count = Number($('#countA').val());
	  if(settingsA.count < 0) 
			  settingsA.count = 0;
	  if(settingsA.count > data.A.length)
			  settingsA.count = data.A.length;
	  settingsA.mixQ = $('#mixQA').prop('checked');
	  settingsA.mixA = $('#mixA').prop('checked');
	  
	  settingsB.count = Number($('#countB').val());
	   if(settingsB.count < 0) 
			  settingsB.count = 0;
	  if(settingsB.count > data.B.length)
			  settingsB.count = data.B.length;
	  
	  settingsB.mixQ = $('#mixQB').prop('checked');
	  
	  if(settingsA.mixQ == false)
	  {
		  settingsA.start = Number($('#startA').val());
		  settingsA.end = Number($('#endA').val());
		  if(settingsA.start < 0 )
			  settingsA.start = 0;
		  if(settingsA.start > data.A.length)
			  settingsA.start = data.A.length;
		  
		  if(settingsA.end < 0)
			  settingsA.end = 0;
		  if(settingsA.end > data.A.length)
			  settingsA.end = data.A.length;
		  settingsA.count = settingsA.end - settingsA.start; 
	  }else
	  {
		  settingsA.start = 0;
		  settingsA.end = settingsA.count;
		  
	  }

	  if(settingsB.mixQ == false)
	  {
		  settingsB.start = Number($('#startB').val());
		  settingsB.end = Number($('#endB').val());
		  if(settingsB.start < 0 )
			  settingsB.start = 0;
		  if(settingsB.start > data.B.length)
			  settingsB.start = data.B.length;
		  if(settingsB.end < 0 )
			  settingsB.end = 0;
		  if( settingsB.end > data.B.length)
			  settingsB.end = data.B.length;
		  
		  settingsB.count = settingsB.end - settingsB.start; 
	  }else
	  {
		  settingsB.start = 0;
		  settingsB.end = settingsB.count;
	  }	
	  
	  
	       if (typeof(Storage) !== "undefined") {
		   
				localStorage.settingsA =  JSON.stringify(settingsA);
				localStorage.settingsB =  JSON.stringify(settingsB);		   
		   }
	  
		startTest(settingsA, settingsB);	
		startPanel.detach();
		var divNavigation = $('<div/>', {
			id:"navigation"
		}).appendTo('#centerLayer');
		divNavigation.append("<p id='answerField'>Показать ответ</p><button class='flat-button' id='btnNext'>Следующий вопрос </button>");
		$("#question0").show();		
	});	
	
	$(document).on('click','#btnNext', function() {				
		var form = document.getElementById("answers"+idActiveQuestion);
		var value = form.elements["question"+idActiveQuestion].value;		
		userAnswers[idActiveQuestion] = value;
		if(value != ""){
			if(userAnswers[idActiveQuestion].toLowerCase() == rightAnswers[idActiveQuestion].toLowerCase())
				{		  					
					console.log("'"+userAnswers[idActiveQuestion]+"'"+" - Это верный ответ!");
					if(idActiveQuestion < settingsA.count)
						rightA++;
					else
						rightB++;
				}
				else
				{
					if(idActiveQuestion < settingsA.count)
						$("#answers"+(idActiveQuestion)).find("label:contains('"+value+"')").addClass("tomato");
					else					
						$("#answers"+(idActiveQuestion)).append("<p class='tomato'>Ваш ответ: "+value+"<p>");	
					console.log("Ваш ответ: "+ "'"+userAnswers[idActiveQuestion]+"'");			
					console.log("Верный ответ: "+ "'"+rightAnswers[idActiveQuestion]+"'");
				}
				if(idActiveQuestion < settingsA.count){
					$("#answers"+(idActiveQuestion)).find("label:contains('"+rightAnswers[idActiveQuestion]+"')").addClass("green");
				}
				else{
					$("#field"+(idActiveQuestion)).remove();				
					$("#answers"+(idActiveQuestion)).append("<p class='green'>Верный ответ: "+rightAnswers[idActiveQuestion]+"<p>");
				}	
			$("#answerField").text("Показать ответ");
			$("#question"+idActiveQuestion).hide();
			idActiveQuestion++;
			answer = rightAnswers[idActiveQuestion];
			$("#question"+idActiveQuestion).show();
			if(idActiveQuestion >= settingsA.count + settingsB.count)
			{
				var timeEnd = new Date().getTime();
				var millis = timeEnd - timeStart;
				var result = $('<div/>', { id : 'result'});
				var percent = Math.ceil( (rightA+rightB) / (settingsA.count + settingsB.count) * 100 );
				var phrase = percent < 90 ? "Ты не пройдешь!!" : "Ну, не плохо.";
				result.append("<h3>Правильных ответов на A: "+ rightA+ " из " + settingsA.count +  ";</h3>");
				result.append("<h3>Правильных ответов на B: "+ rightB + " из " + settingsB.count + ";</h3>");
				result.append("<h3>Общий процент выполнения: "+ percent +"%</h3>");
				result.append("<p>Затраченое время: "+ millisToMinutesAndSeconds(millis)+"</p>");
				result.append("<h4>Итог: " + phrase + "</h4>");
				result.append("<button class='flat-button' id='repeat'>Еще раз</button>");
				$( "#questions" ).before(result);
			
				$(".radio").remove();
				$("#navigation").remove();
				$(".question").show();
				$("#result").show();
			}
		}
	});
		
	function millisToMinutesAndSeconds(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + " минут " + (seconds < 10 ? '0' : '') + seconds + " секунд" ;
}	
				
	$(document).on('click','#answerField', function(){			
			$("#answerField").text(answer);
			});
	
	$(document).on('click','#repeat', function(){	
			$("#questions").html("");		
			$("#result").remove();
			$("#questions").before(startPanel);
			initSettingForm();
			});
