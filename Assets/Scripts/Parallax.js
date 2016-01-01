#pragma strict
var parallax1 :GameObject;
var parallax2 :GameObject;
var player :GameObject;
var space :GameObject;

function Start () {
	
}

function Update () {
	parallax2.gameObject.transform.position = Vector3(player.transform.position.x * 0.9, player.transform.position.y * 0.9, parallax2.gameObject.transform.position.z);
	parallax1.gameObject.transform.position = Vector3(player.transform.position.x * 0.8, player.transform.position.y * 0.8, parallax1.gameObject.transform.position.z);
	space.gameObject.transform.position = Vector3(player.transform.position.x, player.transform.position.y, space.gameObject.transform.position.z);
}