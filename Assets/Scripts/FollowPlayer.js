#pragma strict

var player :Transform;
var OffSetX :int;
var OffSetY :int;

function Start () {
	player = GameObject.Find("Player").transform;
}

function Update () {
	transform.position = new Vector3 (player.position.x + OffSetX, player.position.y + OffSetY, -1);
}