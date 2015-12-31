#pragma strict
public var meleeRate :int;
public var meleeSpeed :float;
public var meleeRange :float;
public var meleeDamage :int;


private var meleeCooldown :int;
private var player :GameObject;
private var myPlatform :GameObject;
private var playerPlatform :GameObject;


function Start() {
	player = GameObject.Find('Player');
}

function FixedUpdate () {
	var Methods :Methods;
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
	} else {
		if (playerPlatform && myPlatform && playerPlatform == myPlatform) {
			meleeCooldown = meleeRate;
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
	yield WaitForFixedUpdate();
	while (Methods.distance(player.transform.position, transform.position) > meleeRange) {
		transform.Translate(Vector2(meleeSpeed * -transform.localScale.x * Time.deltaTime, 0));
		yield WaitForFixedUpdate();
	}
	// yield Attack Animation
	Debug.Log('I bite you');
	player.SendMessage('TakeDamage', meleeDamage);
	GetComponent(FollowAI).getem = true;
}