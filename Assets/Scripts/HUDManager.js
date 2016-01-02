#pragma strict

var armorSlider :UnityEngine.UI.Slider;
var healthSlider :UnityEngine.UI.Slider;
var stealthSlider :UnityEngine.UI.Slider;
var pointsCounter :UnityEngine.UI.Text;
var weaponIcon :UnityEngine.UI.Image;
var ammoCounter :UnityEngine.UI.Text;

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

function UpdateWeapon (image: Sprite) {
	weaponIcon.sprite = image;
}

function UpdateAmmo(value :int) {
	var ammo = value.ToString();

	while (ammo.length < 3) {
		ammo = "0" + ammo;
	}
	ammoCounter.text = ammo;
}