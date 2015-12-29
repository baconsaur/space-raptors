#pragma strict

var song1 :AudioSource;
var song2 :AudioSource;
var dropDown :UnityEngine.UI.Dropdown;

function Start () {
	song2.Play();
}

function Update () {

}

function Play(num :int) {
	num = dropDown.value;
	StopAll();
	if(num == 1) {
		song1.Play();
	} else if (num ==2) {
		song2.Play();
	}
}

function StopAll() {
	song1.Stop();
	song2.Stop();
}