#pragma strict
public var distance :float;
public var width :float;
public var startRotation :float;
public var honingSpeed :float;
public var coneOffsetX :float;
public var coneOffsetY :float;
public var damage :int;
public var laserPrefab :GameObject;
public var startColor :Color;
public var endColor :Color;
public var damageRate :int;


private var area :PolygonCollider2D;
private var player :GameObject;
private var seesPlayer :boolean;
private var honingTimer :float;
private var targetLineNeg :GameObject;
private var targetLinePos :GameObject;
private var fireLine :GameObject;
private var damageRepeat :int;
private var targeting :boolean;


function Start () {
	honingTimer = honingSpeed;
	player = GameObject.Find('Player');
	area = this.gameObject.AddComponent(PolygonCollider2D);
	area.pathCount = 1;
	targetLineNeg = this.gameObject.Find('TargetLaserNeg');
	targetLinePos = this.gameObject.Find('TargetLaserPos');
	fireLine = this.gameObject.Find('FiringLaser');
	targetLineNeg.SetActive(false);
	targetLinePos.SetActive(false);
	fireLine.SetActive(false);
	damageRepeat = damageRate;
	targeting = true;


	var vex :Vector2[] = new Vector2[3];
	vex[0] = new Vector2(coneOffsetX, coneOffsetY);
  vex[1] = RotatePoint(Vector2(0, distance) + vex[0], vex[0], startRotation + (width / 2));
  vex[2] = RotatePoint(Vector2(0, distance) + vex[0], vex[0], startRotation - (width / 2));
	area.SetPath(0, vex);
	area.isTrigger = true;
}

function FixedUpdate () {
	if (!seesPlayer || player.GetComponent(PlayerController).stealth) {
		honingTimer = honingSpeed;
		DestroyLines();
		targeting = false;
		StopAllCoroutines();
	} else if (seesPlayer && !targeting){
		targeting = true;
		StartCoroutine(Target());
	}
}

function OnTriggerEnter2D(other :Collider2D) {
	if (other.gameObject == player) seesPlayer = true;
}

function OnTriggerExit2D(other :Collider2D) {
	if (other.gameObject == player) seesPlayer = false;
}

function RotatePoint (point :Vector2, origin :Vector2, angle :float) :Vector2 {
	var ret :Vector2 = new Vector2(0, 0);
	while (angle < 0) angle += 360f;
	angle = angle % 360f;
	var radians :float = angle * Mathf.Deg2Rad;
  ret.x = ((point.x - origin.x) * Mathf.Cos(radians) -
    (point.y - origin.y) * -Mathf.Sin(radians)) + origin.x;
  ret.y = ((point.x - origin.x) * Mathf.Sin(radians) -
    (point.y - origin.y) * -Mathf.Cos(radians)) + origin.y;
  return ret + origin;
}

function Target() {
	UpdateLine(targetLineNeg, -honingTimer / honingSpeed, startColor, startColor);
	UpdateLine(targetLinePos, honingTimer / honingSpeed, startColor, startColor);
	targetLineNeg.SetActive(true);
	targetLinePos.SetActive(true);
	while (honingTimer > 0) {
		honingTimer -= Time.deltaTime;
		UpdateLine(targetLineNeg, -honingTimer / honingSpeed, startColor, endColor);
		UpdateLine(targetLinePos, honingTimer / honingSpeed, startColor, endColor);
		yield WaitForFixedUpdate();
	}
	player.SendMessage("TakeDamage", damage);
	targetLineNeg.SetActive(false);
	targetLinePos.SetActive(false);
	UpdateLine(fireLine, 0, endColor, endColor);
	fireLine.SetActive(true);
	while (true) {
		while (damageRepeat) {
			damageRepeat --;
			yield WaitForFixedUpdate();
		}
		damageRepeat = damageRate;
		player.SendMessage("TakeDamage", damage);
		yield WaitForFixedUpdate();
	}
}

function DestroyLines() {
	targetLineNeg.SetActive(false);
	targetLinePos.SetActive(false);
	fireLine.SetActive(false);
}

function UpdateLine(object :GameObject, percent :float, startColor :Color, endColor :Color) {
	startColor.a = 1f;
	endColor.a = 1f;
	var line :LineRenderer = object.GetComponent(LineRenderer);
	var vertices :Vector3[] = new Vector3[2];
	var coneOffset :Vector3 = new Vector3(coneOffsetX, coneOffsetY, 0);
	vertices[0] = coneOffset + this.gameObject.transform.position;
	vertices[1] = RotatePoint(player.transform.position, vertices[0], percent * honingSpeed * 20) - vertices[0];
	line.SetPositions(vertices);
	var color :Color = Color.Lerp(endColor, startColor, Mathf.Abs(percent));
	line.SetColors(color, color);
}