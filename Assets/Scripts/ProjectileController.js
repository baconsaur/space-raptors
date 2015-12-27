#pragma strict

var speed :float;
var animator: Animator;
var direction :int;

function Start () {
	transform.localScale = new Vector3(direction, 1, 1);
}

function Update () {
	if (animator.GetBool("hit") == false) {
		transform.Translate(speed * direction * Time.deltaTime, 0, 0);
	}
	if (transform.position.x > 10) {
		Destroy(gameObject);
	}
}

function OnCollisionEnter2D() {
	animator.SetBool("hit", true);
}

function DestroyThis() {
	Destroy(gameObject);
}