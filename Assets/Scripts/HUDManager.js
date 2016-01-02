#pragma strict

var armorSlider :UnityEngine.UI.Slider;
var healthSlider :UnityEngine.UI.Slider;
var stealthSlider :UnityEngine.UI.Slider;

function UpdateArmor(value :int) {
	armorSlider.value = value;
}

function UpdateHealth(value :int) {
	healthSlider.value = value;
}

function UpdateStealth(value :int) {
	stealthSlider.value = value;
}