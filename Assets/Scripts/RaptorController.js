#pragma strict
public var health :int;
public var speed :float;
public var shotOffset :Vector2;
public var currentWeapon :GameObject;
public var shootingCooldown :int;
public var animator :Animator;
public var enemyType :GameObject;
public var activationDistance :float;
public var sightDistance :float;
public var waitAfterShooting :int;
public var patrolSpeed :float;
public var jumpForce :float;
public var maxPlayerProximity :float;



private var shotCooldown :int;
private var moveWait :int;
private var player :GameObject;
private var platform :GameObject;
private var faceSensitivity :float = 0.1;
private var awareOfPlayer :boolean;
private var myCollider :BoxCollider2D;
private var roughRadius :float;
private var turnWait :float;
private var body :Rigidbody2D;
private var onGround :boolean;



function Start () {
	player = GameObject.Find('Player');
	platform = GameObject.Find('Collision');
	shotCooldown = 5;
	moveWait = 5;
	turnWait = patrolSpeed;
	awareOfPlayer = false;
	myCollider = this.gameObject.GetComponent(BoxCollider2D);
	body = this.gameObject.GetComponent(Rigidbody2D);
	roughRadius = Mathf.Sqrt(Mathf.Pow(myCollider.bounds.extents.x * 2, 2f) + Mathf.Pow(myCollider.bounds.extents.y * 2, 2f));
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
	


	// Shoot at player
//	FacePlayer();

	// Move toward player
}

function TakeDamage (damage :int) {
	awareOfPlayer = true;
	health -= damage;
	if (health <= 0) {
		var newEnemy = Instantiate(enemyType, Vector2(Random.Range(-9, 9), 6), Quaternion.identity);
		newEnemy.GetComponent(EnemyController).player = player;
		newEnemy.GetComponent(FollowAI).pointers.player = player;
		newEnemy.GetComponent(EnemyController).enemyType = enemyType;
		Destroy(gameObject);
	} else {
		this.gameObject.SendMessage('DisplayDamage');
	}
}

function FacePlayer () {
//	var prevDirection :float = transform.localScale.x;
	if (player.transform.position.x - transform.position.x > faceSensitivity) transform.localScale.x = -1f;
	else if (transform.position.x - player.transform.position.x > faceSensitivity) transform.localScale.x = 1f;
//	if (transform.localScale.x != prevDirection) ScanTerrain();
}

function Jump() {
	if (onGround) body.AddForce(Vector2(0, jumpForce));
}

function CoolDowns() {
	if (shotCooldown) {
		shotCooldown--;
	}
	if (moveWait) {
		moveWait--;
	}
}

private class Obstacles {
	public var forward :RaycastHit2D;
	public var upward :RaycastHit2D;
	public var downward :RaycastHit2D;
	public function Obstacles(front :RaycastHit2D, up :RaycastHit2D, down :RaycastHit2D) {
		forward = front;
		upward = up;
		downward = down;
	}
}

function ScanTerrain() :Obstacles {
	var forward :RaycastHit2D = RaycastClosest(Vector2(-transform.localScale.x, 0));
	var up :RaycastHit2D = RaycastClosest(Vector2(-transform.localScale.x, 1f));
	var down :RaycastHit2D = RaycastClosest(Vector2(-transform.localScale.x, -1f));
	return new Obstacles(forward, up, down);
}

function Raycast(direction :Vector2) :RaycastHit2D[] {
	var rays :RaycastHit2D[];
	var array :Array = new Array();
	rays = Physics2D.RaycastAll(transform.position, direction);
	if (!rays.Length) return;
	for (var i: int = 0; i < rays.Length; i++) {
		array.Push(rays[i]);
	}
	array = Methods.filter(array, function(ray :RaycastHit2D) {
		return ray.transform != transform && !ray.collider.isTrigger;
	});
	rays = new RaycastHit2D[array.length];
	for (i = 0; i < array.length; i++) {
		rays[i] = array[i];
	}
	return rays;
}

function RaycastClosest(direction :Vector2) :RaycastHit2D {
	var Methods :Methods;
	var rays :RaycastHit2D[] = Raycast(direction);
	var array :Array = new Array();
	if (!rays.Length) return;
	for (var i: int = 0; i < rays.Length; i++) {
		array.Push(rays[i]);
	}
	Methods.sort(array, function(ray1 :RaycastHit2D, ray2 :RaycastHit2D) {
		return Methods.distance(transform.position, ray2.point) - Methods.distance(transform.position, ray1.point);
	});
	return array[0];
}

function CanSeePlayer() :boolean {
	var Methods :Methods;
	var direction :Vector2 = player.transform.position - transform.position;
	var divisor :float = Mathf.Max(Mathf.Abs(direction.x), Mathf.Abs(direction.y));
	direction.x /= divisor;
	direction.y /= divisor;
	var ray :RaycastHit2D = RaycastClosest(direction);
	return ray.transform.gameObject == player &&
		Mathf.Approximately(direction.x, -transform.localScale.x) &&
		Methods.distance(transform.position, player.transform.position) <= sightDistance &&
		!player.GetComponent(PlayerController).stealth;
}

function OnCollisionEnter2D(other :Collision2D) {
	if (other.transform.gameObject == platform && other.contacts[0].point.y < transform.position.y) onGround = true;
}

function OnCollisionExit2D(other :Collision2D) {
	if (other.transform.gameObject == platform && other.contacts[0].point.y < transform.position.y) onGround = false;
}

function Patrol(obstacles :Obstacles) {
	var Methods :Methods;
	var distanceToGround :float = Methods.distance(obstacles.downward.point, transform.position);
	var distanceToWall :float = Methods.distance(obstacles.forward.point, transform.position);
	if (distanceToGround <= roughRadius && distanceToWall >= roughRadius) {
		transform.Translate(Vector2(speed / 2f * -transform.localScale.x * Time.deltaTime, 0.1));
	} else if (turnWait) {
		turnWait --;
	}
	else {
		turnWait = patrolSpeed;
		transform.localScale.x *= -1f;
	}
}

function FollowAttack(obstacles :Obstacles) {
	FacePlayer();
	if (!shotCooldown && obstacles.forward && obstacles.forward.transform.gameObject == player && onGround) {
		animator.SetTrigger("shoot");
		var newShot = Instantiate(currentWeapon, Vector2(gameObject.transform.position.x + (shotOffset.x * transform.localScale.x), gameObject.transform.position.y + shotOffset.y), Quaternion.identity);
		newShot.GetComponent(ProjectileController).direction = -transform.localScale.x;
		shotCooldown = shootingCooldown;
		moveWait = waitAfterShooting;
	} else if (!moveWait && obstacles.forward && obstacles.forward.transform.gameObject != player) {
//		var distanceToGround :float = Methods.distance(obstacles.downward.point, transform.position);
		var distanceToWall :float = Methods.distance(obstacles.forward.point, transform.position);
//		var distanceToPlatform :float = Methods.distance(obstacles.upward.point, transform.position);
		var distanceToPlayer :float = Mathf.Abs(player.transform.position.x - transform.position.x);
		if (player.transform.position.y >= transform.position.y && distanceToWall <= roughRadius && onGround) Jump();
		if (distanceToPlayer > maxPlayerProximity) {
			transform.Translate(Vector2(speed * -transform.localScale.x * Time.deltaTime, onGround ? 0.1 : 0));
		}
	}
}
