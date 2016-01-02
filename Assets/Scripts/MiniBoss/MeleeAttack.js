#pragma strict
public var meleeRate :int;
public var chargeSpeed :float;
public var chargeRange :float;
public var damageRange :float;
public var smackem :boolean;


private var meleeCooldown :int;
private var player :GameObject;
private var myPlatform :GameObject;
private var playerPlatform :GameObject;
private var arm :GameObject;
private var chargeDistance :float;

function Start() {
	player = GameObject.Find('Player');
	arm = this.gameObject.Find('MeleeCollision');
	arm.SetActive(false);
	smackem = true;
}

function FixedUpdate () {
	if (!smackem) return;
	playerPlatform = Methods.onTaggedObject(player, 0.1, 'Platform');
	myPlatform = Methods.onTaggedObject(this.gameObject, 0.1, 'Platform');
	var speed = GetComponent(FollowAI).capabilities.speed;

	if (meleeCooldown) {
		if (GetComponent(FollowAI).getem) meleeCooldown--;
		if (playerPlatform && myPlatform && playerPlatform == myPlatform) {
			// Back up after attack
			var corners :Methods.ObjectWithCorners = new Methods.ObjectWithCorners(myPlatform);
			var relevant = transform.localScale.x < 0 ? corners.corners.topLeft : corners.corners.topRight;
			if (Mathf.Abs(transform.position.x - relevant.x) > speed * Time.deltaTime) {
				transform.Translate(Vector2(transform.localScale.x * speed / 3f * Time.deltaTime, 0));
			}
		}
	} else if (GetComponent(FollowAI).getem) {
		if (playerPlatform && myPlatform && playerPlatform == myPlatform) {
			if (DistanceToPlayerX() <= chargeRange) {
				// ATTACK!
				StartCoroutine(Attack());
			} else {
				transform.Translate(Vector2(-transform.localScale.x * speed * Time.deltaTime, 0));
			}
		}
	}
}

function FacePlayer() {
	transform.localScale.x = player.transform.position.x < transform.position.x ? 1f : -1f;
}

function DistanceToPlayerX() :float {
	return Mathf.Abs(player.transform.position.x - transform.position.x);
}

function Attack() {
	var follow :FollowAI = GetComponent(FollowAI);
	var cannon :MainCannon = GetComponent(MainCannon);
	if (follow) follow.getem = false;
	if (cannon) cannon.shootem = false;
	var Methods :Methods;
	FacePlayer();
	arm.SetActive(true);
	yield WaitForFixedUpdate();
	chargeDistance = chargeRange;
	while (Methods.distance(player.transform.position, transform.position) > damageRange && chargeDistance > 0) {
		var distance :float = chargeSpeed * -transform.localScale.x * Time.deltaTime;
		chargeDistance -= Mathf.Abs(distance);
		transform.Translate(Vector2(distance, 0));
		yield WaitForFixedUpdate();
	}
	// yield Attack Animation
	yield WaitForSeconds(0.2);
	meleeCooldown = meleeRate;
	arm.SetActive(false);
	if (follow) follow.getem = true;
	if (cannon) cannon.shootem = true;
}