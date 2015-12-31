#pragma strict

function Start () {

}

function Update () {

}

function OnTriggerEnter2D (collision :Collider2D) {
	if (collision.gameObject.tag == "Player") {
		Debug.Log("hello");
		Debug.Log(transform);
		collision.GetComponent.<PlayerController>().spawnPoint = transform;

	}
}