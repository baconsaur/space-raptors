#pragma strict
public var distance :float;
public var width :float;
public var startRotation :float;
public var honingSpeed :float;


private var area :PolygonCollider2D;
private var player :GameObject;


function Start () {
	player = GameObject.Find('Player');
	area = this.gameObject.AddComponent(PolygonCollider2D);
	area.pathCount = 1;
	var vex :Vector2[] = new Vector2[3];
	vex[0] = new Vector2(0, 0);
  vex[1] = RotatePoint(Vector2(0, distance), startRotation + (width / 2));
  vex[2] = RotatePoint(Vector2(0, distance), startRotation - (width / 2));
	area.SetPath(0, vex);
	area.isTrigger = true;
}

function FixedUpdate () {
	
}

function OnTriggerEnter2D(other :Collider2D) {
	if (other.gameObject == player && !player.GetComponent(PlayerController).stealth) {
		var ray :RaycastHit2D;
		ray = Physics2D.Raycast(this.gameObject.transform.position, player.transform.position, distance);
		Debug.Log(ray.collider);
	}
}

function RotatePoint (point :Vector2, angle :float) :Vector2 {
	var ret :Vector2 = new Vector2(0,0);
	while (angle < 0) angle += 360f;
	angle = angle % 360f;
	var radians :float = angle * Mathf.Deg2Rad;
  ret.x = -point.x * Mathf.Cos(radians) + point.y * Mathf.Sin(radians);
  ret.y = point.x * Mathf.Sin(radians) + point.y * Mathf.Cos(radians);
  return ret;
}