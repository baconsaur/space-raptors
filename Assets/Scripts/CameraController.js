#pragma strict
public var cameraComponent :Camera;
public var setZoom :float;
public var zoomSpeed :float;
public var setPosition :Vector2;
public var positionSpeed :float;



public var shakeTest :boolean;


private var zoom :float;
private var position :Vector3;
private var player :GameObject;
private var shaking :boolean;


function Start () {
	zoom = cameraComponent.orthographicSize;
	position = new Vector3(setPosition.x, setPosition.y, -10f);
	player = GameObject.Find('Player');
}

function Update () {
	if (zoom != setZoom) {
		if (Mathf.Abs(zoom - setZoom) <= zoomSpeed) zoom = setZoom;
		else zoom = zoom > setZoom ? zoom - zoomSpeed : zoom + zoomSpeed;
		cameraComponent.orthographicSize = zoom;
	}
	if (!shaking && (position.x != setPosition.x || position.y != setPosition.y)) {
		if (Mathf.Abs(position.x - setPosition.x) <= positionSpeed) position.x = setPosition.x;
		else position.x = position.x > setPosition.x ? position.x - positionSpeed : position.x + positionSpeed;
		if (Mathf.Abs(position.y - setPosition.y) <= positionSpeed) position.y = setPosition.y;
		else position.y = position.y > setPosition.y ? position.y - positionSpeed : position.y + positionSpeed;
		position.z = cameraComponent.transform.localPosition.z;
		cameraComponent.transform.localPosition = position;
	}
	if (shakeTest) {
		shakeTest = false;
		StartCoroutine(Shake(10, 0.2));
	}
}

function SetZoom(zoom :float, speed :float) {
	zoomSpeed = speed;
	setZoom = zoom;
}

function SetZoom(zoom :float) {
	setZoom = zoom;
}


function SetPosition(position :Vector2, speed :float) {
	positionSpeed = speed;
	setPosition = position;
}

function SetPosition(position :Vector2) {
	setPosition = position;
}

function Shake(iterations :int, velocity :float) {
	var Methods :Methods;
	shaking = true;
	var end :Vector3 = cameraComponent.transform.localPosition;
	var shakes :Array = new Array(
		Vector3(-velocity, velocity, position.z),
		Vector3(velocity, -velocity, position.z),
		Vector3(-velocity, -velocity, position.z),
		Vector3(velocity, velocity, position.z)
	);
	for (var i :int = 0; i < iterations; i++) {
		for (var j :int = 0; j < shakes.length; j++) {
			var vec :Vector3 = shakes[j];
			cameraComponent.transform.localPosition = end + vec;
			yield WaitForFixedUpdate();
		}
	}
	cameraComponent.transform.localPosition = end;
	shaking = false;
}