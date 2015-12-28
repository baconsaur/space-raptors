#pragma strict
// Inspector Variables
public class Capabilities {
	var speed :float;
	var jumpForce :float;
	var jumpHeight :float;
	var jumpWidth :float;
	var reactionTime :float;
}
public class Pointers {
	var rigidBody :Rigidbody2D;
	var animator :Animator;
	var player :GameObject;
}
public var capabilities :Capabilities;
public var pointers :Pointers;
public var stuckYarp :float;



// Script Variables
private var Methods :Methods;
private var PathFinding :PathFinding;
private var playerPlatform :GameObject;
private var path :Array;
private var timeUntilReady :float;
private var following :boolean = false;
private var stuckMebbe :float = 0f;




function Start () {
	timeUntilReady = 0f;
}

function FixedUpdate () {
	stuckMebbe += Time.deltaTime;
	if (stuckMebbe >= stuckYarp) {
		StopAllCoroutines();
		stuckMebbe = 0;
		following = false;
		path = null;
	}
	
	var playerPlat = Methods.onTaggedObject(pointers.player, 0.1, 'Platform');
	var myPlat = Methods.onTaggedObject(this.gameObject, 0.1, 'Platform');
	if (playerPlat) playerPlatform = playerPlat;
	if (!following && !timeUntilReady && myPlat && playerPlat && (!path || !path.length || myPlat != playerPlat)) {
		path = PathFinding.buildSteps(pointers.player, this.gameObject, 'Platform', 0.1, capabilities);
		StartCoroutine(FollowPath(path, 0.1, this.gameObject, pointers.rigidBody, capabilities));
		timeUntilReady = capabilities.reactionTime;
	}
	if (timeUntilReady && !following) timeUntilReady = Mathf.Max(timeUntilReady - (capabilities.reactionTime * Time.deltaTime), 0);
}














































public function FollowPath(path :Array, timeout :float, me: GameObject, body :Rigidbody2D, stats :Capabilities) {
	var PathFinding :PathFinding;
	following = true;
	for (var i :int = 1; i < path.length && following; i++) {
		if (path[i - 1] != Methods.onTaggedObject(me, 0.1, 'Platform')) {
			Debug.Log('previous move did not work');
			i = path.length;
		} else {
			var howTo :Array = PathFinding.howToGetThere(me, path[i - 1], path[i], 0.1, stats);
			if (howTo.length) {
				Debug.Log('start:');
				Debug.Log(path[i - 1]);
				Debug.Log('target:');
				Debug.Log(path[i]);
				yield StartCoroutine(Move(howTo, me, body, stats));
	//			yield WaitForSeconds(timeout);
			} else {
				Debug.Log('cannot get there');
				i = path.length;
			}
		}
		
	}
	following = false;
}
private function Move(step :Array, me :GameObject, body :Rigidbody2D, stats :Capabilities) {
	stuckMebbe = 0;
	var Methods :Methods;
	Methods.forEach(step, Debug.Log);
	var method :String = step.Shift();
	switch (method) {
		case 'FallLeft':
			yield StartCoroutine(FallLeft(step[0], me, me.transform.position.y, stats));
			break;
		case 'FallRight':
			yield StartCoroutine(FallRight(step[0], me, me.transform.position.y, stats));
			break;
		case 'FallAroundLeft':
			yield StartCoroutine(FallAroundLeft(step[0], me, me.transform.position.y, stats));
			break;
		case 'FallAroundRight':
			yield StartCoroutine(FallAroundRight(step[0], me, me.transform.position.y, stats));
			break;
		case 'MoveLeft':
			yield StartCoroutine(GoLeft(step[0], me, stats));
			break;
		case 'MoveRight':
			yield StartCoroutine(GoRight(step[0], me, stats));
			break;
		case 'JumpLeft':
			yield StartCoroutine(JumpLeft(step[0], step[1], step[2], me, body, stats));
			break;
		case 'JumpRight':
			yield StartCoroutine(JumpRight(step[0], step[1], step[2], me, body, stats));
			break;
		case 'JumpAroundLeft':
			yield StartCoroutine(JumpAroundLeft(step[0], step[1], me, body, stats));
			break;
		case 'JumpAroundRight':
			yield StartCoroutine(JumpAroundRight(step[0], step[1], me, body, stats));
			break;
		default:
			Debug.Log('no method');
			return;
	}
}

private function DoUntil(action :Function, condition :Function) {
	while (condition() && following) {
		action();
		yield WaitForFixedUpdate();
	}
}

private function Jump(body :Rigidbody2D, stats :Capabilities) {
	body.AddForce(Vector2(0, stats.jumpForce));
}

private function GoLeft(position :Vector2, me :GameObject, stats :Capabilities) {
	me.transform.localScale.x = 1f;
	me.GetComponent(EnemyController).shotOffset.x = -2;
	yield StartCoroutine(DoUntil(function() {
		me.transform.Translate(Vector3(-1f * stats.speed * Time.deltaTime, 0, 0));
	}, function() {
		return me.transform.position.x > position.x;
	}));
}

private function GoRight(position :Vector2, me :GameObject, stats :Capabilities) {
	me.transform.localScale.x = -1f;
	me.GetComponent(EnemyController).shotOffset.x = 2;
	yield StartCoroutine(DoUntil(function() {
		me.transform.Translate(Vector3(stats.speed * Time.deltaTime, 0, 0));
	}, function() {
		Debug.Log(me.transform.position.x);
		return me.transform.position.x < position.x;
	}));
}

private function FallLeft(position :Vector2, me :GameObject, untilY :float, stats :Capabilities) {
	me.transform.localScale.x = 1f;
	yield StartCoroutine(DoUntil(function() {
		me.transform.Translate(Vector3(-1f * stats.speed * Time.deltaTime, 0, 0));
	}, function() {
		return me.transform.position.y >= untilY - 0.1 && me.transform.position.x >= position.x;
	}));
}

private function FallRight(position :Vector2, me :GameObject, untilY :float, stats :Capabilities) {
	me.transform.localScale.x = -1f;
	yield StartCoroutine(DoUntil(function() {
		me.transform.Translate(Vector3(stats.speed * Time.deltaTime, 0, 0));
	}, function() {
		return me.transform.position.y >= untilY - 0.1 && me.transform.position.x <= position.x;
	}));

}

private function FallAroundLeft(position :Vector2, me :GameObject, untilY :float, stats :Capabilities) {
	yield StartCoroutine(FallLeft(position, me, untilY, stats));
	yield WaitForFixedUpdate();
	while (me.transform.position.y >= untilY - 1f && following) {
		yield WaitForFixedUpdate();
	}
	yield StartCoroutine(GoRight(position, me, stats));
	yield WaitForFixedUpdate();
}

private function FallAroundRight(position :Vector2, me :GameObject, untilY :float, stats :Capabilities) {
	yield StartCoroutine(FallRight(position, me, untilY, stats));
	yield WaitForFixedUpdate();
	while (me.transform.position.y >= untilY - 1f && following) {
		yield WaitForFixedUpdate();
	}
	yield StartCoroutine(GoLeft(position, me, stats));
	yield WaitForFixedUpdate();
}

private function JumpLeft(arg1 :Vector2, untilY :float, arg2 :Vector2, me :GameObject, body :Rigidbody2D, stats :Capabilities) {
	// GO LEFT OR RIGHT????
	yield arg1.x < me.transform.position.x ? StartCoroutine(GoLeft(arg1, me, stats)) : StartCoroutine(GoRight(arg1, me, stats));
//	yield StartCoroutine(GoLeft(arg1, me, stats));
	Jump(body, stats);
	yield WaitForFixedUpdate();
	yield StartCoroutine(DoUntil(function() {}, function () {
		var objWCorn :Methods.ObjectWithCorners = new Methods.ObjectWithCorners(me);
		return objWCorn.corners.topLeft.y <= untilY;
	}));
	yield StartCoroutine(GoLeft(arg2, me, stats));
	yield WaitForFixedUpdate();
}

private function JumpRight(arg1 :Vector2, untilY :float, arg2 :Vector2, me :GameObject, body :Rigidbody2D, stats :Capabilities) {
	// GO LEFT OR RIGHT????
	yield arg1.x < me.transform.position.x ? StartCoroutine(GoLeft(arg1, me, stats)) : StartCoroutine(GoRight(arg1, me, stats));
//	yield StartCoroutine(GoRight(arg1, me, stats));
	Jump(body, stats);
	yield WaitForFixedUpdate();
	yield StartCoroutine(DoUntil(function() {}, function () {
		var objWCorn :Methods.ObjectWithCorners = new Methods.ObjectWithCorners(me);
		return objWCorn.corners.topRight.y <= untilY;
	}));
	yield StartCoroutine(GoRight(arg2, me, stats));
	yield WaitForFixedUpdate();
}

private function JumpAroundLeft(arg1 :Vector2, arg2 :Vector2, me :GameObject, body :Rigidbody2D, stats :Capabilities) {
	yield StartCoroutine(GoLeft(arg1, me, stats));
	Jump(body, stats);
	yield WaitForFixedUpdate();
	yield StartCoroutine(DoUntil(function() {
		me.transform.Translate(Vector3(-1f * stats.speed * Time.deltaTime, 0, 0));
	}, function() {
		var objWCorn :Methods.ObjectWithCorners = new Methods.ObjectWithCorners(me);
		return objWCorn.corners.topRight.x >= arg2.x;
	}));
	do {
		yield WaitForFixedUpdate();
		var objWCorn :Methods.ObjectWithCorners = new Methods.ObjectWithCorners(me);
	} while (objWCorn.corners.topRight.y < arg2.y && following);
	yield WaitForFixedUpdate();
	yield StartCoroutine(GoRight(arg2, me ,stats));
	yield WaitForFixedUpdate();
}

private function JumpAroundRight(arg1 :Vector2, arg2 :Vector2, me :GameObject, body :Rigidbody2D, stats :Capabilities) {
	yield StartCoroutine(GoRight(arg1, me, stats));
	Jump(body, stats);
	yield WaitForFixedUpdate();
	yield StartCoroutine(DoUntil(function() {
		me.transform.Translate(Vector3(stats.speed * Time.deltaTime, 0, 0));
	}, function() {
		var objWCorn :Methods.ObjectWithCorners = new Methods.ObjectWithCorners(me);
		return objWCorn.corners.topLeft.x <= arg2.x;
	}));
	do {
		yield WaitForFixedUpdate();
		var objWCorn :Methods.ObjectWithCorners = new Methods.ObjectWithCorners(me);
	} while (objWCorn.corners.topRight.y < arg2.y && following);
	yield WaitForFixedUpdate();
	yield StartCoroutine(GoLeft(arg2, me ,stats));
	yield WaitForFixedUpdate();
}
