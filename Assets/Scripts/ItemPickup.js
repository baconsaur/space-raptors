#pragma strict

var itemType: GameObject;

function Start () {

}

function Update () {

}

function OnTriggerEnter2D (collision :Collider2D) {
	if (collision.gameObject.tag == "Player") {
		collision.gameObject.SendMessage("ItemPickup", itemType);
		Destroy(gameObject);
	}
}