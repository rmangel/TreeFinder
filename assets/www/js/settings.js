$(document).ready(function()
{
	var alertRadius = window.localStorage.getItem("alertRadius");
	var pollInt = window.localStorage.getItem("pollInt");
	var measurement = window.localStorage.getItem("measurement");
	$("#slider1").val(alertRadius);
	$("#slider2").val(pollInt);
	$('#slider1, #slider2').slider('refresh');
});

function saveSettings() 
{
    window.localStorage.setItem("alertRadius", $('#slider1').val());
    window.localStorage.setItem("pollInt", $('#slider2').val());
} 