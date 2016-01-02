#pragma strict

var damage :int;
var speed :float;
var animator: Animator;
var direction :Vector3;
var weaponId :int;
var hitSound :AudioSource;
var angleY :float;

private var boundsMin :Vector3;
private var boundsMax :Vector3;

function Start () {
	transform.localScale.x = direction.x < 0 ? -1 : 1;
	transform.localScale.y = direction.y < 0 ? -1 : 1;
	boundsMin = Camera.main.ScreenToWorldPoint(Vector3(0, 0, 0));
	boundsMax = Camera.main.ScreenToWorldPoint(Vector3(Screen.width, Screen.height, 0));
}

function Update () {
	if (animator.GetBool("hit") == false) {
		transform.Translate(
			speed * direction.x * Time.deltaTime,
			speed * direction.y * Time.deltaTime,
			speed * direction.z * Time.deltaTime
		);
	}
	if (transform.position.x > boundsMax.x || transform.position.x < boundsMin.x) {
		DestroyThis();
	}
}

function OnTriggerEnter2D(collision :Collider2D) {
	if (collision.gameObject.tag == "Player" && weaponId != 2 && weaponId != 4) {
		return;
	} else if (collision.gameObject.tag == "Enemy" && weaponId == 2) {
		return;
	} else if (collision.gameObject.tag == "MiniBoss" && (weaponId == 4 || weaponId == 5)) {
		return;
	} else {
		animator.SetBool("hit", true);
		hitSound.Play();
		collision.gameObject.SendMessage("TakeDamage", damage, SendMessageOptions.DontRequireReceiver);
	}
}

function DestroyThis() {
	Destroy(gameObject);
}
