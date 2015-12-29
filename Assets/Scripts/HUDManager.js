#pragma strict

var armorSlider :UnityEngine.UI.Slider;
var healthSlider :UnityEngine.UI.Slider;

function UpdateArmor(value :int) {
	armorSlider.value = value;
}

function UpdateHealth(value :int) {
	healthSlider.value = value;
}