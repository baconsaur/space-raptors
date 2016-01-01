#pragma strict
public var meleeRate :int;
public var meleeSpeed :float;
public var meleeRange :float;
public var smackem :boolean;


private var meleeCooldown :int;
private var player :GameObject;
private var myPlatform :GameObject;
private var playerPlatform :GameObject;
private var arm :GameObject;

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

	if (meleeCooldown) {
		if (GetComponent(FollowAI).getem) meleeCooldown--;
		if (playerPlatform && myPlatform && playerPlatform == myPlatform) {
			var corners :Methods.ObjectWithCorners = new Methods.ObjectWithCorners(myPlatform);
			var relevant = transform.localScale.x < 0 ? corners.corners.topLeft : corners.corners.topRight;
			var speed = GetComponent(FollowAI).capabilities.speed;
			if (Mathf.Abs(transform.position.x - relevant.x) > speed * Time.deltaTime) {
				transform.Translate(Vector2(transform.localScale.x * speed / 3f * Time.deltaTime, 0));
			}
		}
	} else if (GetComponent(FollowAI).getem) {
		if (playerPlatform && myPlatform && playerPlatform == myPlatform) {
//			meleeCooldown = meleeRate;
			StartCoroutine(Attack());
		}
	}
}

function FacePlayer() {
	transform.localScale.x = player.transform.position.x < transform.position.x ? 1f : -1f;
}

function Attack() {
	GetComponent(FollowAI).getem = false;
	var Methods :Methods;
	FacePlayer();
	arm.SetActive(true);
	yield WaitForFixedUpdate();
	while (Methods.distance(player.transform.position, transform.position) > meleeRange) {
		transform.Translate(Vector2(meleeSpeed * -transform.localScale.x * Time.deltaTime, 0));
		yield WaitForFixedUpdate();
	}
	// yield Attack Animation
	yield WaitForSeconds(0.2);
	meleeCooldown = meleeRate;
	arm.SetActive(false);
	GetComponent(FollowAI).getem = true;
}