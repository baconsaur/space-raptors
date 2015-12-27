#pragma strict

var damage :int;
var speed :float;
var animator: Animator;
var direction :int;
var weaponId :int;
var hitSound :AudioSource;

private var boundsMin :Vector3;
private var boundsMax :Vector3;

function Start () {
	transform.localScale = new Vector3(direction, 1, 1);
	boundsMin = Camera.main.ScreenToWorldPoint(Vector3(0, 0, 0));
	boundsMax = Camera.main.ScreenToWorldPoint(Vector3(Screen.width, Screen.height, 0));
}

function Update () {
	if (animator.GetBool("hit") == false) {
		transform.Translate(speed * direction * Time.deltaTime, 0, 0);
	}
	if (transform.position.x > boundsMax.x || transform.position.x < boundsMin.x) {
		DestroyThis();
	}
}

function OnCollisionEnter2D(collision :Collision2D) {
	if (collision.gameObject.tag == "Player" && weaponId != 2) {
		return;
	} else if (collision.gameObject.tag == "Enemy" && weaponId == 2) {
		return;
	} else {
		animator.SetBool("hit", true);
		hitSound.Play();
		collision.gameObject.SendMessage("TakeDamage", damage);
	}
}

function DestroyThis() {
	Destroy(gameObject);
}
