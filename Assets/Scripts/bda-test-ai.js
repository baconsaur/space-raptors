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
private var randomActions :String[];
private var meleeCoolDown :float = 1f;
private var reactionCoolDown :float = 1f;
private var ready :boolean = true;
private var turnable :boolean = true;
private var lastLocation :GameObject;
private var methods :General;
private var pathFinding :PathFinding;
private var playerPlatform :GameObject;


function Start () {
	randomActions = new String[ACTIONS];
	randomActions[0] = 'Growl';
	randomActions[1] = 'Stomp';
	randomActions[2] = 'Hiss';
	pathFinding = ScriptableObject.CreateInstance('PathFinding') as PathFinding;
	methods = ScriptableObject.CreateInstance('General') as General;
//	pathFinding.buildSteps(pointers.player, this.gameObject, 'Platform', 0f);
	
}

function FixedUpdate () {
	if (turnable) FacePlayer();
	
	var platform = methods.onTaggedObject(pointers.player, 0.1, 'Platform');
	if (platform && platform != playerPlatform) {
		playerPlatform = platform;
		var path :Array = pathFinding.buildSteps(pointers.player, this.gameObject, 'Platform', 0, capabilities);
		Debug.Log(path.length);
		methods.forEach(path, Debug.Log);
	}
	
	if (ready) {
		if (meleeCoolDown > 0f) meleeCoolDown -= Time.deltaTime;
		if (reactionCoolDown > 0f) reactionCoolDown -= Time.deltaTime;
		var dist :float = methods.distance(transform.position, pointers.player.transform.position);
		if (meleeCoolDown <= 0f && dist <= capabilities.meleeRange) {
//			StartCoroutine('MeleeAttack');
		} else if (reactionCoolDown <= 0f) {
			
			var decide = Random.Range(0, reactions.randomLikelihood);
			if (false && !decide) {
				DoSomethingRandom();
// skip for now
			} else {
				
//				var myPlatform :GameObject = methods.onTaggedObject(pointers.player, 0.01, 'Platform');
//				var playerPlatform :GameObject = methods.onTaggedObject(pointers.player, 0.01, 'Platform');
//				// if player.platform = self.platform - move to player
//				if (myPlatform == playerPlatform || !myPlatform || !playerPlatform || (playerPlatform && lastLocation && playerPlatform != lastLocation)) {
//					if (playerPlatform) lastLocation = playerPlatform;
//					var moveAmount = -transform.localScale.x * capabilities.speed * Time.deltaTime;
//					transform.Translate(new Vector2(moveAmount, 0));
//				}
				
				
				
			}
			
		}
	}
	
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
