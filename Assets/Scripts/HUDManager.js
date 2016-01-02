#pragma strict

var armorSlider :UnityEngine.UI.Slider;
var healthSlider :UnityEngine.UI.Slider;
var stealthSlider :UnityEngine.UI.Slider;
var pointsCounter :UnityEngine.UI.Text;

function UpdateArmor(value :int) {
	armorSlider.value = value;
}

function UpdateHealth(value :int) {
	healthSlider.value = value;
}

function UpdateStealth(value :int) {
	stealthSlider.value = value;
}

function UpdatePoints(value :int) {
	var points = value.ToString();

	while (points.length < 5) {
		points = "0" + points;
	}
	pointsCounter.text = points;
}