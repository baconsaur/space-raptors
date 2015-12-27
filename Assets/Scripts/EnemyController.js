#pragma strict

var health :int;
var shotOffset :Vector2;
var currentWeapon :GameObject;
var defaultCooldown : int;

private var shotCooldown :int;

function Start () {
	shotCooldown = 100;
}

function Update () {
	if (shotCooldown) {
		shotCooldown--;
	}
	if (!shotCooldown) {
//		animator.SetTrigger("shoot");
		var newShot = Instantiate(currentWeapon, Vector2(gameObject.transform.position.x + shotOffset.x, gameObject.transform.position.y + shotOffset.y), Quaternion.identity);
		newShot.GetComponent(ProjectileController).direction = -transform.localScale.x;
		shotCooldown = defaultCooldown;
	}
}

function TakeDamage (damage :int) {
	health -= damage;
	if (health <= 0) {
		Destroy(gameObject);
	}
}