#pragma strict

function Start() {
	
}

function FixedUpdate() {
	
}

public function DisplayDamage() {
	var renderer :SpriteRenderer = GetComponent(SpriteRenderer);
	renderer.color = Color(0.9, 0.5, 0.5, 1);
	yield WaitForSeconds(0.333);
	renderer.color = Color.white;
}