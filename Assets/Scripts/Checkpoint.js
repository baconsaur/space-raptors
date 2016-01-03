#pragma strict

public var respawnPosition :Vector2;


function OnTriggerEnter2D(other :Collider2D) {
	if (other.transform.gameObject.name == 'Player') {
		GameObject.Find('CheckpointController').GetComponent(CheckpointController).Save(respawnPosition, this.gameObject);
		Destroy(this.gameObject);
	}
}
