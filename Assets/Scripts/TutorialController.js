#pragma strict

var tutorialHUD : GameObject;
var nextOverlay : GameObject;

function Start () {

}

function Update () {

}

function OnTriggerEnter2D (collision : Collider2D) {
	if (collision.gameObject.name == "Player") {
		Methods.destroyChildren(tutorialHUD);
		var newOverlay = Instantiate(nextOverlay);
		newOverlay.transform.parent = tutorialHUD.transform;
		newOverlay.transform.localPosition = Vector3(0, 0, 0);
		Destroy(this.gameObject);
	}
}