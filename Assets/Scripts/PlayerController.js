#pragma strict

var speed :float;
var jumpForce :float;
var rigidBody :Rigidbody2D;
var maxVelocity :float;
var turnDeadZone :float;
var animator :Animator;

function Start () {

}

function FixedUpdate () {
	var direction = Input.GetAxisRaw("Horizontal") * speed * Time.deltaTime;
	transform.Translate(new Vector2(direction, 0));
	
	if (direction > turnDeadZone) {
		transform.localScale = new Vector3(1, 1, 1);
		animator.SetBool("walking", true);
	} else if (direction < -turnDeadZone) {
		transform.localScale = new Vector3(-1, 1, 1);
		animator.SetBool("walking", true);
	} else {
		animator.SetBool("walking", false);
	}
	
	if (Input.GetAxis("Vertical") > 0 && rigidBody.velocity.y == 0) {
		animator.SetBool("jumping", true);
		rigidBody.AddForce(Vector2(0, jumpForce));
	} else if (rigidBody.velocity.y == 0) {
	//TODO: This also gets set to 0 at the apex of a jump
		animator.SetBool("jumping", false);
	}
}