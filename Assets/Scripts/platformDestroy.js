#pragma strict

function TakeDamage(damage :int) {
	if (!damage) Destroy(this.gameObject);
}