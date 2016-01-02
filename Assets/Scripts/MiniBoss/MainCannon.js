#pragma strict

public var shootem :boolean;
public var destroyem :boolean;
public var shootToleranceY :float;
public var cannonCoolDown :int;
public var mainProjectile :GameObject;
public var platformProjectile :GameObject;



/*private*/ var cannonTimer :int;
private var shooting :boolean;
private var myPlatform :GameObject;
private var player :GameObject;
private var playerPlatform :GameObject;
private var lastProjectile :GameObject;

function Start() {
	player = GameObject.Find('Player');
}

function FixedUpdate() {
	if (!shootem) return;
	myPlatform = Methods.onTaggedObject(this.gameObject, 0.1, 'Platform');
	playerPlatform = Methods.onTaggedObject(player, 0.1, 'Platform');

	if (cannonTimer && !shooting) cannonTimer--;

	if (!cannonTimer && myPlatform) {
		shooting = true;
		cannonTimer = cannonCoolDown;
		var follow :FollowAI = GetComponent(FollowAI);
		var attack :MeleeAttack = GetComponent(MeleeAttack);

		follow.getem = false;
		attack.smackem = false;
		FacePlayer();

		if (Mathf.Abs(transform.position.y - player.transform.position.y) <= shootToleranceY) {
			StartCoroutine(AimAndShoot());
		} else {
			if (playerPlatform && destroyem && lastProjectile != platformProjectile) {
				StartCoroutine(PlatformShoot(playerPlatform));
			} else {
				StartCoroutine(AimAndShoot());
			}
		}
	}
}

function AimAndShoot() {
	lastProjectile = mainProjectile;
	//Animate aimining...
	var renderer :SpriteRenderer = GetComponent(SpriteRenderer);
	renderer.color = Color(0, 0, 1, 1);
	yield WaitForSeconds(3);
		
	var blast = Instantiate(mainProjectile, Vector2(transform.position.x, transform.position.y), Quaternion.identity);
	blast.GetComponent(ProjectileController).direction.x = -transform.localScale.x;

	yield WaitForSeconds(0.5);
	renderer.color = Color(1, 1, 1, 1);

	var follow :FollowAI = GetComponent(FollowAI);
	var attack :MeleeAttack = GetComponent(MeleeAttack);
	shooting = false;
	follow.getem = true;
	attack.smackem = true;
}

function PlatformShoot(platform :GameObject) {
	lastProjectile = platformProjectile;
	//Animate aimining...
	var renderer :SpriteRenderer = GetComponent(SpriteRenderer);
	renderer.color = Color(0, 1, 0, 1);
	yield WaitForSeconds(3);

	var direction :Vector2 = platform.transform.position - transform.position;
	var denom :float = Mathf.Abs(direction.x) > Mathf.Abs(direction.y) ? direction.x : direction.y;
	direction.x /= denom;
	direction.y /= denom;

	var blast = Instantiate(platformProjectile, Vector2(transform.position.x, transform.position.y), Quaternion.identity);
	blast.GetComponent(ProjectileController).direction = direction;

	yield WaitForSeconds(0.5);
	renderer.color = Color(1, 1, 1, 1);

	var follow :FollowAI = GetComponent(FollowAI);
	var attack :MeleeAttack = GetComponent(MeleeAttack);
	shooting = false;
	follow.getem = true;
	attack.smackem = true;
}

function FacePlayer() {
	transform.localScale.x = player.transform.position.x < transform.position.x ? 1f : -1f;
}