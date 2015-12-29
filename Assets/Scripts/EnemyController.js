#pragma strict

var health :int;
var shotOffset :Vector2;
var currentWeapon :GameObject;
var defaultCooldown :int;
var animator :Animator;
var player :GameObject;
var shootDifferentialY :float;
var enemyType :GameObject;

private var shotCooldown :int;

function Start () {
	shotCooldown = 100;
}

function Update () {
	if (shotCooldown) {
		shotCooldown--;
	}
	var compareY :float = Mathf.Abs(player.transform.position.y - this.gameObject.transform.position.y);
	if (!shotCooldown && compareY <= shootDifferentialY) {
		FacePlayer();
		animator.SetTrigger("shoot");
		var newShot = Instantiate(currentWeapon, Vector2(gameObject.transform.position.x + shotOffset.x, gameObject.transform.position.y + shotOffset.y), Quaternion.identity);
		newShot.GetComponent(ProjectileController).direction = -transform.localScale.x;
		shotCooldown = defaultCooldown;
	}
}

function TakeDamage (damage :int) {
	health -= damage;
	if (health <= 0) {
		Destroy(gameObject);
		var newEnemy = Instantiate(enemyType);
		newEnemy.GetComponent(EnemyController).player = player;
		newEnemy.GetComponent(FollowAI).pointers.player = player;
	}
}

function FacePlayer() {
	this.gameObject.transform.localScale.x = player.transform.position.x <= this.transform.position.x ? 1f : -1f;
}