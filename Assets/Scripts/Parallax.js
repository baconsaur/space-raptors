#pragma strict
var parallax1 :GameObject;
var parallax2 :GameObject;
var mainCam :GameObject;
var space :GameObject;

function Start () {
	mainCam = GameObject.Find('Main Camera');
}

function Update () {
	parallax2.gameObject.transform.position = Vector3(mainCam.transform.position.x * 0.9, mainCam.transform.position.y * 0.9, parallax2.gameObject.transform.position.z);
	parallax1.gameObject.transform.position = Vector3(mainCam.transform.position.x * 0.8, mainCam.transform.position.y * 0.8, parallax1.gameObject.transform.position.z);
	space.gameObject.transform.position = Vector3(mainCam.transform.position.x, mainCam.transform.position.y, space.gameObject.transform.position.z);
}