#pragma strict
public var meleeDamage :int;

private var player :GameObject;

function Start() {
	player = GameObject.Find('Player');
}

function OnTriggerEnter2D(other :Collider2D) {
	Debug.Log('smack!');
	if (other.transform.gameObject == player) player.SendMessage('TakeDamage', meleeDamage);
}