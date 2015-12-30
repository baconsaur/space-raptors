#pragma strict

function Start() {
	
}

function FixedUpdate() {
	
}

public function DisplayDamage() {
	var renderer :SpriteRenderer = GetComponent(SpriteRenderer);
	var alpha = renderer.color.a;
	renderer.color = Color(0.9, 0.5, 0.5, alpha);
	yield WaitForSeconds(0.333);
	renderer.color = Color(1, 1, 1, alpha);
}