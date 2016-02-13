#pragma strict

function OnTriggerEnter2D(other :Collider2D) {
	if (other.transform.gameObject.name == 'Player') {
		other.transform.position = Vector2(-25.29, -7.69);
		Application.LoadLevel('MiniBossFight');
	}
}
