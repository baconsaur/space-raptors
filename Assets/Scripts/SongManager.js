#pragma strict

var song1 :AudioSource;
var song2 :AudioSource;
var song3 :AudioSource;
var dropDown :UnityEngine.UI.Dropdown;

function Start () {
	if (Application.loadedLevelName == 'MiniBossFight') Play(3);
	else Play(2);
}

function Update () {

}

function Play(num :int) {
//	num = dropDown.value;
	StopAll();
	if(num == 1) {
		song1.Play();
	} else if (num == 2) {
		song2.Play();
	} else if (num == 3) {
		song3.Play();
	}
}

function StopAll() {
	song1.Stop();
	song2.Stop();
	song3.Stop();
}