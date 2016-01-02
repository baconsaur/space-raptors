#pragma strict
public var leftLevel :GameObject;
public var rightLevel :GameObject;


private var cameraController :CameraController;
private var player :GameObject;
private var inside :boolean;


function Start() {
	cameraController = GameObject.Find('Main Camera').GetComponent(CameraController);
	player = GameObject.Find('Player');
}

function OnTriggerEnter2D(other :Collider2D) {
	if (other.transform.gameObject == player) {
		cameraController.manualPositioning = true;
		cameraController.SetPositionManual(transform.position);
	}
}

function OnTriggerExit2D(other :Collider2D) {
	if (other.transform.gameObject == player) {
		cameraController.manualPositioning = false;
		cameraController.SetBoundaries(player.transform.position.x < transform.position.x ? leftLevel : rightLevel);
	}
}