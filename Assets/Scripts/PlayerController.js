#pragma strict

var speed :float;
var jumpForce :float;
var rigidBody :Rigidbody2D;
var maxVelocity :float;
var turnDeadZone :float;

function Start () {

}

function FixedUpdate () {
	var direction = Input.GetAxisRaw("Horizontal") * speed * Time.deltaTime;
	Debug.Log(direction);
	if (direction > turnDeadZone) {
		transform.localScale = new Vector3(1, 1, 1);
	} else if (direction < -turnDeadZone) {
		transform.localScale = new Vector3(-1, 1, 1);
	}
	transform.Translate(new Vector2(direction, 0));
	if (Input.GetAxis("Vertical") > 0 && rigidBody.velocity.y == 0) {
		rigidBody.AddForce(Vector2(0, jumpForce));
	}
}