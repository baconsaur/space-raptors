#pragma strict
// Constants
static var ACTIONS :int = 3;


// Inspector Variables
public class Capabilities {
	var speed :float;
	var jumpForce :float;
	var attackPower :float;
	var maxVelocity :float;
	var meleeRange :float;
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
private var randomActions :String[];
private var meleeCoolDown :float = 1f;
private var reactionCoolDown :float = 1f;
private var ready :boolean = true;
private var turnable :boolean = true;
private var lastLocation :GameObject;



// Muscle-Man Action Instructions Class
private class Instruction {
	private var action :Function;
	private var argument :float;
	public function Instruction(act :Function, arg :float) {
		action = act;
		argument = arg;
	}
	public function go() {
		action(argument);
	}
	
	static function GetToFrom(start :GameObject, end :GameObject) :Instruction {
		var jumpRatio = 1f;
		var startCorners = new Corners(start);
		var endCorners = new Corners(end);
		var argument :float;
		if (true) {
			return new Instruction(PathActions.JumpUpLeft, argument);
		} else if (true) {
			return new Instruction(PathActions.JumpUpRight, argument);
		} else if (true) {
			return new Instruction(PathActions.JumpAcrossLeft, argument);
		} else if (true) {
			return new Instruction(PathActions.JumpAcrossRight, argument);
		} else if (true) {
			return new Instruction(PathActions.JumpAroundLeft, argument);
		} else if (true) {
			return new Instruction(PathActions.JumpAroundRight, argument);
		} else if (true) {
			return new Instruction(PathActions.GoLeft, argument);
		} else if (true) {
			return new Instruction(PathActions.GoRight, argument);
		} else if (true) {
			return new Instruction(PathActions.FallAroundLeft, argument);
		} else if (true) {
			return new Instruction(PathActions.FallAroundRightt, argument);
		}
		else return null;
	}
	
	static function GetPossibleUpPath(start :GameObject, end :GameObject, platforms :GameObject[]) :Array {
		if (start == end) return new Array(GetToFrom(start, end));
		for (var i :int = 0; i < platforms.length; i++) {
			if (platforms[i] != start) {
				var instruction :Instruction = Instruction.GetToFrom(start, platforms[i]);
				if (instruction) {
					var works :Array = Instruction.GetPossibleUpPath(platforms[i], end, platforms);
					if (works) return new Array(instruction).concat(works);
				}
			}
		}
		return null;
	}
}

private class PathActions {
	static function JumpUpLeft(distance :float) {
	
	}
	static function JumpUpRight(distance :float) {
	
	}
	static function JumpAcrossLeft(distance :float) {
	
	}
	static function JumpAcrossRight(distance :float) {
	
	}
	static function JumpAroundLeft(distance :float) {
	
	}
	static function JumpAroundRight(distance :float) {
	
	}
	static function GoLeft(distance :float) {
	
	}
	static function GoRight(distance :float) {
	
	}
	static function FallAroundLeft(distance :float) {
		
	}
	static function FallAroundRightt(distance :float) {
		
	}
}

// Class for finding boxcollider corners
public class Corners {
	public var topLeft :Vector2;
	public var topRight :Vector2;
	public var bottomLeft :Vector2;
	public var bottomRight :Vector2;
	public function Corners(object :GameObject) {
		var pos :Vector2 = new Vector2 (object.transform.position.x, object.transform.position.y);
		var collider :BoxCollider2D = object.GetComponent(BoxCollider2D);
		var ext :Vector2 = new Vector2(collider.bounds.extents.x, collider.bounds.extents.y);
		var off :Vector2 = collider.offset;
		topLeft = new Vector2(pos.x - ext.x + off.x, pos.y + ext.y + off.y);
		topRight = new Vector2(pos.x + ext.x + off.x, pos.y + ext.y + off.y);
		bottomLeft = new Vector2(pos.x - ext.x + off.x, pos.y - ext.y + off.y);
		bottomRight = new Vector2(pos.x + ext.x + off.x, pos.y - ext.y + off.y);
	}
}





function Start () {
	randomActions = new String[ACTIONS];
	randomActions[0] = 'Growl';
	randomActions[1] = 'Stomp';
	randomActions[2] = 'Hiss';
}

function FixedUpdate () {
	if (turnable) FacePlayer();
	
	if (ready) {
		if (meleeCoolDown > 0f) meleeCoolDown -= Time.deltaTime;
		if (reactionCoolDown > 0f) reactionCoolDown -= Time.deltaTime;
		var dist :float = distanceCalc(transform.position, pointers.player.transform.position);
		if (meleeCoolDown <= 0f && dist <= capabilities.meleeRange) {
			StartCoroutine('MeleeAttack');
		} else if (reactionCoolDown <= 0f) {
			
			var decide = Random.Range(0, reactions.randomLikelihood);
			if (false && !decide) {
				DoSomethingRandom();
// skip for now
			} else {
				
				var myPlatform :GameObject = onPlatform(pointers.player, 0.1);
				var playerPlatform :GameObject = onPlatform(pointers.player, 0.1);
				// if player.platform = self.platform - move to player
				if (myPlatform == playerPlatform || !myPlatform || !playerPlatform || (playerPlatform && lastLocation && playerPlatform != lastLocation)) {
					if (playerPlatform) lastLocation = playerPlatform;
					var moveAmount = -transform.localScale.x * capabilities.speed * Time.deltaTime;
					transform.Translate(new Vector2(moveAmount, 0));
				}
				
				
				// recursive calculate platform path to player to build move instructions
				// follow instructions while player is on same platform or in the air
			}
			
		}
	}
	
}

function distanceCalc(point1 :Vector2, point2 :Vector2): float {
	return Mathf.Sqrt(Mathf.Pow(point1.x - point2.x, 2.0) + Mathf.Pow(point1.y - point2.y, 2.0));
}

function FacePlayer() {
	var scale :float = -xScale(0.1);
	if (scale) transform.localScale = new Vector3(scale, 1f, 1f);
}

function xScale(tolerance :float) :float {
	if (pointers.player.transform.position.x < transform.position.x - tolerance) return -1f;
	else if (pointers.player.transform.position.x > transform.position.x + tolerance) return 1f;
	else return 0f;
}

function MeleeAttack() {
	ready = false;
	var renderer :SpriteRenderer = GetComponent(SpriteRenderer);
	renderer.color = Color.yellow;
	yield WaitForSeconds(1);
	renderer.color = Color.white;
	meleeCoolDown = reactions.meleeFreq;
	ready = true;
}

function DoSomethingRandom() {
	var action :int = Random.Range(0, ACTIONS);
	StartCoroutine(randomActions[action]);
	reactionCoolDown = reactions.reactionTime;
}

function Growl() {
	ready = false;
	var renderer :SpriteRenderer = GetComponent(SpriteRenderer);
	renderer.color = Color.red;
	yield WaitForSeconds(2);
	renderer.color = Color.white;
	ready = true;
}

function Stomp() {
	ready = false;
	var renderer :SpriteRenderer = GetComponent(SpriteRenderer);
	renderer.color = Color.green;
	yield WaitForSeconds(5);
	renderer.color = Color.white;
	ready = true;
}

function Hiss() {
	ready = false;
	var renderer :SpriteRenderer = GetComponent(SpriteRenderer);
	renderer.color = Color.blue;
	yield WaitForSeconds(4);
	renderer.color = Color.white;
	ready = true;
}

function onPlatform(object :GameObject, tolerance :float) :GameObject {
	var collider :BoxCollider2D = object.GetComponent(BoxCollider2D);
	var platforms :GameObject[] = GameObject.FindGameObjectsWithTag('Platform');
	for (var i :int = 0; i < platforms.Length; i++) {
		var thickness :float = platforms[i].transform.localScale.y / 2f;
		var vec :Vector3 = object.transform.position - collider.bounds.extents - new Vector3(0, thickness, 0);
		if (Mathf.Abs(vec.y - platforms[i].transform.position.y) <= tolerance) return platforms[i];
	}
	return null;
}
