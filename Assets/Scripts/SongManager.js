#pragma strict

var song1 :AudioClip;
var song2 :AudioClip;
var song3 :AudioClip;
var audioSource :AudioSource;
var dropDown :UnityEngine.UI.Dropdown;

function Start () {
	song1 = Resources.Load("Sounds/song1", AudioClip);
	song2 = Resources.Load("Sounds/song2", AudioClip);
	song3 = Resources.Load("Sounds/song3", AudioClip);
	audioSource = gameObject.Find("HUDCanvas").GetComponent(AudioSource);
	audioSource.clip = song3;
	audioSource.Play();
}

function Play(num :int) {
	num = dropDown.value;
	audioSource.Stop();
	if(num == 1) {
		audioSource.clip = song1;
	} else if (num == 2) {
		audioSource.clip = song2;
	} else if (num == 3) {
		audioSource.clip = song3;
	}
	audioSource.Play();
}
