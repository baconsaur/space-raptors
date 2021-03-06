﻿#pragma strict
public var health :int;
public var speed :float;
public var shotOffset :Vector2;
public var currentWeapon :GameObject;
public var shootingCooldown :int;
public var animator :Animator;
public var activationDistance :float;
public var sightDistance :float;
public var waitAfterShooting :int;
public var patrolSpeed :float;
public var jumpForce :float;
public var maxPlayerProximity :float;
public var stealthTimeout :int;
public var pointValue :int;
public var willShootY :float;
public var drops :GameObject[];


private var shotCooldown :int;
private var stealthReset :int;
private var moveWait :int;
private var player :GameObject;
private var faceSensitivity :float = 0.5;
private var awareOfPlayer :boolean;
private var myCollider :BoxCollider2D;
private var roughRadius :float;
private var turnWait :float;
private var body :Rigidbody2D;
private var SoundFXManager :SoundFXManager;
private var audioSource :AudioSource;
private var lastKnownPos :Vector2;
private var lastSpin :float;
private var lastJump :float;


function Start () {
	player = GameObject.Find('Player');
	shotCooldown = 5;
	moveWait = 5;
	turnWait = patrolSpeed;
	awareOfPlayer = false;
	myCollider = this.gameObject.GetComponent(BoxCollider2D);
	body = this.gameObject.GetComponent(Rigidbody2D);
	roughRadius = Mathf.Sqrt(Mathf.Pow(myCollider.bounds.extents.x * 2, 2f) + Mathf.Pow(myCollider.bounds.extents.y * 2, 2f));
	SoundFXManager = gameObject.Find("SoundFX").GetComponent("SoundFXManager");
	audioSource = gameObject.GetComponent(AudioSource);
	lastKnownPos = player.transform.position;
}

function FixedUpdate () {
	var Methods :Methods;

	// Only update if within activationDistance
	if (Methods.distance(player.transform.position, transform.position) > activationDistance) return;

	// CoolDowns
	if (awareOfPlayer) {
		CoolDowns();
	}

	// Knows of Player
	var obstacles :Obstacles = ScanTerrain();
	if (!awareOfPlayer) {
		awareOfPlayer = CanSeePlayer();
	}

	// Patrol
	if (!awareOfPlayer) {
		Patrol(obstacles);
	}

	// Follow and Attack
	if (awareOfPlayer) {
		FollowAttack(obstacles);
	}
}

function TakeDamage (damage :int) {
	awareOfPlayer = true;
	Face(player.transform.position);
	health -= damage;
	if (health <= 0) {
		Destroy(gameObject);
		player.SendMessage('GetPoints', pointValue);
		RandomDrop();
	} else {
		this.gameObject.SendMessage('DisplayDamage');
	}
}

function RandomDrop () {
	var drop :GameObject;
	var randomizer = Random.Range(0, 8);
	if (randomizer == 0) {
		return;
	} else if (randomizer == 2) {
		if (player.GetComponent(PlayerController).weapons.length > 1) {
			drop = Instantiate(drops[0]);
		} else {
			drop = Instantiate(drops[1]);
		}
	} else if (randomizer == 3) {
		drop = Instantiate(drops[2]);
	} else {
		drop = Instantiate(drops[1]);
	}
	if (drop) {
		drop.transform.position = transform.position;
	}
}

function CoolDowns() {
	if (shotCooldown) shotCooldown--;
	if (moveWait) moveWait--;
	if (stealthReset) stealthReset--;
	lastSpin += Time.deltaTime;
	lastJump += Time.deltaTime;
}

private class Obstacles {
	public var forward :RaycastHit2D;
	public var upward :RaycastHit2D;
	public var downward :RaycastHit2D;
	public var backward :RaycastHit2D;
	public function Obstacles(front :RaycastHit2D, up :RaycastHit2D, down :RaycastHit2D, back :RaycastHit2D) {
		forward = front;
		upward = up;
		downward = down;
		backward = back;
	}
}

function ScanTerrain() :Obstacles {
	var forward :RaycastHit2D = Methods.RaycastClosest(transform.position, Vector2(-transform.localScale.x, 0), transform);
	var up :RaycastHit2D = Methods.RaycastClosest(transform.position, Vector2(-transform.localScale.x, 1f), transform);
	var down :RaycastHit2D = Methods.RaycastClosest(transform.position, Vector2(-transform.localScale.x, -1f), transform);
	var backward :RaycastHit2D = Methods.RaycastClosest(transform.position, Vector2(transform.localScale.x, 0), transform);
	return new Obstacles(forward, up, down, backward);
}

function CanSeePlayer() :boolean {
	var direction :Vector2 = player.transform.position - transform.position;
	var divisor :float = Mathf.Max(Mathf.Abs(direction.x), Mathf.Abs(direction.y));
	direction.x /= divisor;
	direction.y /= divisor;
	var ray :RaycastHit2D = Methods.RaycastClosest(transform.position, direction, transform);
	return ray.transform.gameObject == player &&
		Mathf.Approximately(direction.x, -transform.localScale.x) &&
		Methods.distance(transform.position, player.transform.position) <= sightDistance &&
		!player.GetComponent(PlayerController).stealth;
}

function OnCollisionEnter2D(other :Collision2D) {
	var wall :boolean = false;
	for (var i :int = 0; i < other.contacts.Length; i++) {
		if (Mathf.Abs(other.contacts[i].point.x - transform.position.x) > Mathf.Abs(other.contacts[i].point.y - transform.position.y)) {
			wall = true;
		}
	}

	if (wall && other.transform.gameObject == player) {
		transform.Translate(Vector2(0.1 * -transform.localScale.x, 0));
	}
}






function Patrol(obstacles :Obstacles) {
	var Methods :Methods;
	var distanceToGround :float = Methods.distance(obstacles.downward.point, transform.position);
	var distanceToWall :float = Methods.distance(obstacles.forward.point, transform.position);
	if (distanceToGround <= roughRadius * 2 && distanceToWall >= roughRadius / 1.5) {
		AnimateMove(Vector2(speed / 2f * -transform.localScale.x * Time.deltaTime, 0.1));
	} else if (turnWait) {
		animator.SetBool("walking", false);
		turnWait --;
	}
	else {
		animator.SetBool("walking", false);
		turnWait = patrolSpeed;
		transform.localScale.x *= -1f;
	}
}






function FollowAttack(obstacles :Obstacles) {
	var visible :boolean = !player.GetComponent(PlayerController).stealth;
	if (visible && CanSeePlayer()) {
		lastKnownPos = player.transform.position;
		stealthReset = stealthTimeout;
	}
	var onSomething :GameObject = Methods.onSomething(this.gameObject, 0.1);
	var playerOn :GameObject = Methods.onSomething(player, 0.1);
	if (!stealthReset && (visible ||
		(onSomething && onSomething.name != 'Player') ||	
		(playerOn && playerOn.name != this.gameObject.name))
	) {
		awareOfPlayer = false;
	}

	if (!shotCooldown && Mathf.Abs(lastKnownPos.y - transform.position.y) <= willShootY) {
		Face(lastKnownPos);
		Shoot();
	} else if (!moveWait) {
		if (Mathf.Abs(transform.position.y - lastKnownPos.y) * 3f > Mathf.Abs(transform.position.x - lastKnownPos.x) &&
			transform.position.y > lastKnownPos.y
		) {
			GetDown(obstacles);
		} else if (onGround() &&
			(lastKnownPos.y - transform.position.y > 0.2 ||
			(obstacles.forward && obstacles.forward.distance < roughRadius * 3f && obstacles.forward.transform.gameObject != player) ||
			(!obstacles.downward || (obstacles.downward.distance > roughRadius * 2f && lastKnownPos.y > obstacles.downward.point.y)))
		) {
			Face(lastKnownPos);
			Jump();
		} else if (Mathf.Abs(transform.position.x - lastKnownPos.x) > maxPlayerProximity) {
			 Face(lastKnownPos);
			Jump();
			AnimateMove(Vector2(-transform.localScale.x * speed * Time.deltaTime, 0.1));
		}
	} else {
		animator.SetBool("walking", false);
	}
}

function AnimateMove(amount :Vector2) {
	if (onGround()) animator.SetBool("walking", true);
	transform.Translate(amount);
}

function Shoot() {
	animator.SetBool("walking", false);
	animator.SetTrigger("shoot");
	var newShot :GameObject = Instantiate(currentWeapon, Vector2(gameObject.transform.position.x + (shotOffset.x * transform.localScale.x), gameObject.transform.position.y + shotOffset.y), Quaternion.identity);
	newShot.GetComponent(ProjectileController).direction.x = -transform.localScale.x;
	shotCooldown = shootingCooldown;
	moveWait = waitAfterShooting;
}

function nothingBetweenMeAnd(position :Vector2, obstacles :Obstacles) :boolean {
	return !obstacles.forward || obstacles.forward.transform.gameObject == player ||
		obstacles.forward.distance > Methods.distance(position, transform.position) + roughRadius;
}

function Face(position :Vector2) {
	if (position.x - transform.position.x > faceSensitivity) transform.localScale.x = -1f;
	else if (transform.position.x - position.x > faceSensitivity) transform.localScale.x = 1f;
}

function Jump() {
	if (onGround() && lastJump > 1f) {
		lastJump = 0;
		animator.SetBool("walking", false);
		body.AddForce(Vector2(transform.localScale.x * 50f, jumpForce));
		SoundFXManager.Play(audioSource, "action", "raptor_jump");
	}
}

function GetDown(obstacles :Obstacles) {
	if (obstacles.forward.distance <= roughRadius || obstacles.upward.distance <= roughRadius) TurnAround();
	if (obstacles.downward.distance > roughRadius || lastKnownPos.y > transform.position.y) Jump();
	AnimateMove(Vector2(speed * -transform.localScale.x * Time.deltaTime, onGround() ? 0.1 : 0));
}

function onGround() :boolean {
	var ret :GameObject = Methods.onSomething(this.gameObject, 0.1);
	return Mathf.Abs(GetComponent(Rigidbody2D).velocity.y) < 0.5 && (!ret || ret.name != 'Player');
}

function TurnAround() {
	if (lastSpin > 1f) {
		lastSpin = 0;
		transform.localScale.x *= -1f;
	}
}