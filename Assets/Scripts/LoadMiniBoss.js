#pragma strict

function OnTriggerEnter2D(other :Collider2D) {
	if (other.transform.gameObject.name == 'Player') {
		Application.LoadLevel('MiniBossFight');
	}
}
