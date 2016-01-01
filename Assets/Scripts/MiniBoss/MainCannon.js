#pragma strict

public var shootem :boolean;
public var shootToleranceY :float;
public var cannonCoolDown :int;
public var projectile :GameObject;


private var cannonTimer :int;
private var shooting :boolean;
private var myPlatform :GameObject;


function Start() {
	
}

function FixedUpdate() {
	if (!shootem) return;
	myPlatform = Methods.onTaggedObject(this.gameObject, 0.1, 'Platform');

	if (cannonTimer && !shooting) cannonTimer--;

	if (!cannonTimer && myPlatform) {
		cannonTimer = cannonCoolDown;
		shooting = true;
		StartCoroutine(AimAndShoot());
	}

}

function AimAndShoot() {
	//Animate aimining...
	var renderer :SpriteRenderer = GetComponent(SpriteRenderer);
	var follow :FollowAI = GetComponent(FollowAI);
	var attack :MeleeAttack = GetComponent(MeleeAttack);
	var otherCannon :PlatformCannon = GetComponent(PlatformCannon);

	follow.getem = false;
	attack.smackem = false;
	otherCannon.destroyem = false;
	renderer.color = Color(0, 0, 0, 1);
	yield WaitForSeconds(3);

	var blast = Instantiate(projectile, Vector2(transform.position.x, transform.position.y), Quaternion.identity);
	blast.GetComponent(ProjectileController).direction.x = -transform.localScale.x;

	yield WaitForSeconds(0.5);
	renderer.color = Color(1, 1, 1, 1);
	shooting = false;
	follow.getem = true;
	attack.smackem = true;
	otherCannon.destroyem = true;
}
