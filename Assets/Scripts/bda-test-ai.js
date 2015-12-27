#pragma strict
// Inspector Variables
public class Capabilities {
	var speed :float;
	var jumpForce :float;
	var attackPower :float;
	var maxVelocity :float;
	var meleeRange :float;
	var jumpHeight :float;
	var jumpWidth :float;
}
public class Reactions {
	var reactionTime :float;
	var distThreshold :float;
	var meleeFreq :float;
	var randomLikelihood :int;
}
public class Pointers {
	var rigidBody :Rigidbody2D;
	var animator :Animator;
	var player :GameObject;
}
public var capabilities :Capabilities;
public var reactions :Reactions;
public var pointers :Pointers;



// Script Variables
private var methods :General;
private var pathFinding :PathFinding;
private var playerPlatform :GameObject;
private var followAI :FollowAI;



// Private Classes
private class Step {
	public var doThis :Function;
	public var whileThis :Function;
	public function Step(doFunc :Function, whileFunc :Function) {
		doThis = doFunc;
		whileThis = whileFunc;
	}
}
private class FollowAI {
	private var pathFinding :PathFinding;
	public var path :Array;
	public var step :Array;
	public var currentStep :int;
	private var self :GameObject;
	private var stats :Capabilities;
	public function FollowAI(pathway :Array, pathFind :PathFinding, me :GameObject, capabilities :Capabilities) {
		pathFinding = pathFind;
		path = pathway;
		currentStep = 1;
		self = me;
		stats = capabilities;
	}
	public function Clear() {
		path = new Array();
		currentStep = 0;
		step = null;
	}
}





function Start () {
	pathFinding = ScriptableObject.CreateInstance('PathFinding') as PathFinding;
	methods = ScriptableObject.CreateInstance('General') as General;
	followAI = new FollowAI(new Array(), pathFinding, this.gameObject, capabilities);
}

function FixedUpdate () {	
	var platform = methods.onTaggedObject(pointers.player, 0.1, 'Platform');
	if (platform) playerPlatform = platform;
	if (!followAI.path || !followAI.path.length || followAI.path[followAI.path.length - 1] != playerPlatform) {
		var path = pathFinding.buildSteps(pointers.player, this.gameObject, 'Platform', 0.1, capabilities);
		if (path.length >= 2) {
			followAI = new FollowAI(path, pathFinding, this.gameObject, capabilities);	
		}
	}
	if (followAI.currentStep < followAI.path.length) {
		if (!followAI.step) {
			followAI.step = pathFinding.howToGetThere(this.gameObject, followAI.path[followAI.currentStep - 1] as GameObject, followAI.path[followAI.currentStep] as GameObject,
				0.1, capabilities);
		}
		if (!followAI.step.length) followAI.Clear();
		else {
			MoveMe(followAI.step, this.gameObject, pointers.rigidBody, capabilities);
		}
	}
}


function MoveMe(step :Array, me :GameObject, body :Rigidbody2D, stats :Capabilities) {
	methods.forEach(step, Debug.Log);
	var method :String = step.Shift();
	switch (method) {
		case 'FallLeft':
			yield StartCoroutine(FallLeft(me, me.transform.position.y, stats));
			break;
		case 'FallRight':
			yield StartCoroutine(FallRight(me, me.transform.position.y, stats));
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
			yield StartCoroutine(JumpLeft(step[0], step[1], me, body, stats));
			break;
		case 'JumpRight':
			yield StartCoroutine(JumpRight(step[0], step[1], me, body, stats));
			break;
		case 'JumpAroundLeft':
			yield StartCoroutine(JumpAroundLeft(step[0], step[1], me, body, stats));
			break;
		case 'JumpAroundRight':
			yield StartCoroutine(JumpAroundRight(step[0], step[1], me, body, stats));
			break;
		default:
			return;
	}
}

function DoUntil(action :Function, condition :Function) {
	while (condition()) {
		action();
		yield WaitForFixedUpdate();
	}
}

function Jump(body :Rigidbody2D, stats :Capabilities) {
	body.AddForce(Vector2(0, stats.jumpForce));
}

function GoLeft(position :Vector2, me :GameObject, stats :Capabilities) {
	me.transform.localScale.x = 1f;
	yield StartCoroutine(DoUntil(function() {
		me.transform.Translate(Vector3(-1f * stats.speed * Time.deltaTime, 0, 0));
	}, function() {
		return me.transform.position.x > position.x;
	}));
}

function GoRight(position :Vector2, me :GameObject, stats :Capabilities) {
	me.transform.localScale.x = -1f;
	yield StartCoroutine(DoUntil(function() {
		me.transform.Translate(Vector3(stats.speed * Time.deltaTime, 0, 0));
	}, function() {
		return me.transform.position.x < position.x;
	}));
}

function FallLeft(me :GameObject, y :float, stats :Capabilities) {
	me.transform.localScale.x = 1f;
	yield StartCoroutine(DoUntil(function() {
		me.transform.Translate(Vector3(-1f * stats.speed * Time.deltaTime, 0, 0));
	}, function() {
		return me.transform.position.y >= y;
	}));
}

function FallRight(me :GameObject, y :float, stats :Capabilities) {
	me.transform.localScale.x = -1f;
	yield StartCoroutine(DoUntil(function() {
		me.transform.Translate(Vector3(stats.speed * Time.deltaTime, 0, 0));
	}, function() {
		return me.transform.position.y >= y;
	}));

}








function FallAroundLeft(position :Vector2, me :GameObject, y :float, stats :Capabilities) {
	yield StartCoroutine(FallLeft(me, y, stats));
	yield WaitForFixedUpdate();
	while (me.transform.position.y >= y - 1f) {
		yield WaitForFixedUpdate();
	}
	yield StartCoroutine(GoRight(position, me, stats));
	yield WaitForFixedUpdate();
}

function FallAroundRight(position :Vector2, me :GameObject, y :float, stats :Capabilities) {
	yield StartCoroutine(FallRight(me, y, stats));
	yield WaitForFixedUpdate();
	while (me.transform.position.y >= y - 1f) {
		yield WaitForFixedUpdate();
	}
	yield StartCoroutine(GoLeft(position, me, stats));
	yield WaitForFixedUpdate();
}

function JumpLeft(arg1 :Vector2, arg2 :Vector2, me :GameObject, body :Rigidbody2D, stats :Capabilities) {
	yield StartCoroutine(GoLeft(arg1, me, stats));
	Jump(body, stats);
	yield WaitForFixedUpdate();
	yield StartCoroutine(GoLeft(arg2, me, stats));
	yield WaitForFixedUpdate();
}

function JumpRight(arg1 :Vector2, arg2 :Vector2, me :GameObject, body :Rigidbody2D, stats :Capabilities) {
	yield StartCoroutine(GoRight(arg1, me, stats));
	Jump(body, stats);
	yield WaitForFixedUpdate();
	yield StartCoroutine(GoRight(arg2, me, stats));
	yield WaitForFixedUpdate();
}

function JumpAroundLeft(arg1 :Vector2, arg2 :Vector2, me :GameObject, body :Rigidbody2D, stats :Capabilities) {
	yield StartCoroutine(GoLeft(arg1, me, stats));
	Jump(body, stats);
	yield WaitForFixedUpdate();
	yield StartCoroutine(DoUntil(function() {
		me.transform.Translate(Vector3(-1f * stats.speed * Time.deltaTime, 0, 0));
	}, function() {
		var objWCorn :General.ObjectWithCorners = new General.ObjectWithCorners(me);
		return objWCorn.corners.topRight.x >= arg2.x;
	}));
	do {
		yield WaitForFixedUpdate();
		var objWCorn :General.ObjectWithCorners = new General.ObjectWithCorners(me);
	} while (objWCorn.corners.topRight.y < arg2.y);
	yield WaitForFixedUpdate();
	yield StartCoroutine(GoRight(arg2, me ,stats));
	yield WaitForFixedUpdate();
}

function JumpAroundRight(arg1 :Vector2, arg2 :Vector2, me :GameObject, body :Rigidbody2D, stats :Capabilities) {
	yield StartCoroutine(GoRight(arg1, me, stats));
	Jump(body, stats);
	yield WaitForFixedUpdate();
	yield StartCoroutine(DoUntil(function() {
		me.transform.Translate(Vector3(stats.speed * Time.deltaTime, 0, 0));
	}, function() {
		var objWCorn :General.ObjectWithCorners = new General.ObjectWithCorners(me);
		return objWCorn.corners.topLeft.x <= arg2.x;
	}));
	do {
		yield WaitForFixedUpdate();
		var objWCorn :General.ObjectWithCorners = new General.ObjectWithCorners(me);
	} while (objWCorn.corners.topRight.y < arg2.y);
	yield WaitForFixedUpdate();
	yield StartCoroutine(GoLeft(arg2, me ,stats));
	yield WaitForFixedUpdate();
}
