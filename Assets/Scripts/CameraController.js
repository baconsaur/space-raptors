#pragma strict
public var zoomSpeed :float;
public var positionSpeed :Vector2;
public var startingBounds :GameObject;
public var manualPositioning :boolean;
public var playerOffset :Vector2;


//public var shakeTest :boolean;


private var zoom :float;
private var position :Vector3;
private var player :GameObject;
private var shaking :boolean;
private var boundary :Bounds;
private var cameraObj :Camera;
private var targetPosition :Vector3;
private var targetZoom :float;


function Start () {
	cameraObj = GetComponent(Camera);
	targetZoom = cameraObj.orthographicSize;
	zoom = targetZoom;
	player = GameObject.Find('Player');
	transform.position = new Vector3(
		player.transform.position.x,
		player.transform.position.y,
		-10f
	);
	if (Application.loadedLevelName == 'MiniBossFight') SetZoom(15);
	SetBoundaries(startingBounds);
}

function FixedUpdate () {
	// Zoom
	if (zoom != targetZoom) {
		if (Mathf.Abs(zoom - targetZoom) <= zoomSpeed * Time.deltaTime) zoom = targetZoom;
		else zoom += zoom > targetZoom ? -zoomSpeed * Time.deltaTime : zoomSpeed * Time.deltaTime;
		cameraObj.orthographicSize = zoom;
	}

	// Set Position to Player
	if (!manualPositioning) {
		var position :Vector2 = new Vector2(
			player.transform.position.x + (player.transform.localScale.x * playerOffset.x),
			player.transform.position.y + (player.transform.localScale.y * playerOffset.y)
		);
		SetPosition(position);
	}

	// Move Camera
	if (!shaking) {
		if (Mathf.Abs(transform.position.x - targetPosition.x) <= positionSpeed.x * Time.deltaTime) {
			transform.position.x = targetPosition.x;
		} else {
			transform.position.x += (transform.position.x > targetPosition.x) ?
				-positionSpeed.x * Time.deltaTime :
				positionSpeed.x * Time.deltaTime;
		}
		if (Mathf.Abs(transform.position.y - targetPosition.y) <= positionSpeed.y * Time.deltaTime) {
			transform.position.y = targetPosition.y;
		} else {
			transform.position.y += (transform.position.y > targetPosition.y) ?
				-positionSpeed.y * Time.deltaTime :
				positionSpeed.y * Time.deltaTime;
		}
	}

}

function SetZoom(zoom :float, speed :float) {
	zoomSpeed = speed;
	targetZoom = zoom;
}

function SetZoom(zoom :float) {
	SetZoom(zoom, zoomSpeed);
}


function SetPosition(position :Vector2, speed :Vector2, stayInBounds) {
	positionSpeed = speed;

	if (stayInBounds && (boundary.extents.x || boundary.extents.y)) {
		var minBound :Vector2 = MinBound(position);
		var maxBound :Vector2 = MaxBound(minBound);

		position = new Vector2(
			Mathf.Min(maxBound.x, minBound.x),
			Mathf.Min(maxBound.y, minBound.y)
		);
	}

	targetPosition = position;
	targetPosition.z = -10f;
}

function SetPosition(position :Vector2, speed :Vector2) {
	SetPosition(position, speed, true);
}

function SetPosition(position :Vector2) {
	SetPosition(position, positionSpeed, true);
}

function SetPositionManual(position :Vector2) {
	targetPosition = position;
	targetPosition.z = -10f;
}

function Shake(iterations :int, velocity :float) {
	shaking = true;
	var end :Vector3 = cameraObj.transform.localPosition;
	var shakes :Array = new Array(
		Vector3(-velocity, velocity, position.z),
		Vector3(velocity, -velocity, position.z),
		Vector3(-velocity, -velocity, position.z),
		Vector3(velocity, velocity, position.z)
	);
	for (var i :int = 0; i < iterations; i++) {
		for (var j :int = 0; j < shakes.length; j++) {
			var vec :Vector3 = shakes[j];
			cameraObj.transform.localPosition = end + vec;
			yield WaitForFixedUpdate();
		}
	}
	cameraObj.transform.localPosition = end;
	shaking = false;
}

function SetBoundaries(obj :GameObject) {
	if (obj) boundary = obj.GetComponent(MeshRenderer).bounds;
}

function MinBound(position :Vector2) :Vector2 {
	return EitherBound(position, 1.9f, boundary.min, Mathf.Max);
}

function MaxBound(position :Vector2) :Vector2 {
	return EitherBound(position, -1.9f, boundary.max, Mathf.Min);
}

function EitherBound(position :Vector2, divisor :float, boundPos :Vector2, compare :Function) :Vector2 {
	var centerPos :Vector2 = cameraObj.WorldToScreenPoint(position);
	var comparePos :Vector2 = new Vector2(
		centerPos.x - cameraObj.pixelWidth / divisor,
		centerPos.y - cameraObj.pixelHeight / divisor
	);
	comparePos = cameraObj.ScreenToWorldPoint(comparePos);
	comparePos.x = compare(comparePos.x, boundPos.x);
	comparePos.y = compare(comparePos.y, boundPos.y);
	comparePos = cameraObj.WorldToScreenPoint(comparePos);
	centerPos = new Vector2(
		comparePos.x + cameraObj.pixelWidth / divisor,
		comparePos.y + cameraObj.pixelHeight / divisor
	);
	return cameraObj.ScreenToWorldPoint(centerPos);
}